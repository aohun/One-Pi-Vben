<template>
  <div>
    <BasicForm @register="registerForm">
      <template #wfCopyList>
        <div class="flex flex-col gap-4px">
          <div>
            <Tag v-for="item in ccList" :key="item.userId">
              {{ item.nickName }}/{{ item.userName }}
            </Tag>
          </div>
          <a-button class="w-fit" pre-icon="bi:cc-square-fill" @click="handleSelectCC"
            >选择抄送人</a-button
          >
        </div>
      </template>
      <template #fileId="{ model, field }">
        <Upload
          v-model:file-list="model[field]"
          name="file"
          :multiple="true"
          :action="uploadUrl"
          :headers="headers"
          :accept="acceptFiles"
          @change="handleChange"
        >
          <a-button :pre-icon="IconEnum.UPLOAD">上传附件</a-button>
        </Upload>
        <p class="mt-4">
          请上传 大小不超过 <span class="text-red-500">20MB</span> 格式为
          <span class="text-red-500">doc/xls/ppt/txt/pdf/xlsx/docx/zip</span> 的文件
        </p>
      </template>
    </BasicForm>
    <Space class="ml-100px">
      <Popconfirm
        placement="top"
        title="确认提交吗?"
        ok-text="确认"
        cancel-text="再想想"
        :getPopupContainer="getPopupContainer"
        @confirm="handleSubmit"
      >
        <a-button :disabled="buttonDisabled">通过</a-button>
      </Popconfirm>

      <!-- 为多实例才(multiInstance)会显示 加签/减签 -->
      <template v-if="currentTask && currentTask.multiInstance">
        <a-button :disabled="buttonDisabled" @click="handleAddMultiInstance">加签</a-button>
        <a-button
          :disabled="buttonDisabled"
          @click="openDeleteMultiInstanceModal(true, currentTask.id)"
          >减签</a-button
        >
      </template>

      <a-button :disabled="buttonDisabled" @click="handleEntrust">委托</a-button>
      <a-button :disabled="buttonDisabled" @click="handleTransfer">转办</a-button>
      <a-button :disabled="buttonDisabled" @click="handleOpenRejectModal">驳回</a-button>
      <Popconfirm
        placement="top"
        title="确认终止吗?"
        ok-text="确认"
        cancel-text="再想想"
        :getPopupContainer="getPopupContainer"
        @confirm="handleTermination"
      >
        <a-button :disabled="buttonDisabled">终止</a-button>
      </Popconfirm>
    </Space>
    <!-- 用户选择 -->
    <UserSelectModal
      @register="registerUserSelectModal"
      @copy-done="onCCSelectDone"
      @entrust-done="onEntrustSelectDone"
      @transfer-done="onTransferSelectDone"
    />
    <!-- 驳回 -->
    <RejectModal @register="registerRejectModal" @reload="$emit('reload')" />
    <!-- 为多实例才(multiInstance)会显示 加签/减签 -->
    <template v-if="currentTask && currentTask.multiInstance">
      <!-- 加签 -->
      <AddMultiInstanceModal
        @register="registerAddMultiInstanceModal"
        @select-done="onAddMultiInstance"
      />
      <!-- 减签 -->
      <DeleteMultiInstanceModal
        @register="registerDeleteMultiInstanceModal"
        @select-done="onDeleteMultiInstance"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
  import { useModal } from '@/components/Modal';
  import { BasicForm, useForm } from '@/components/Form';
  import { modalSchemas } from './data';
  import { Upload, Tag, Popconfirm, Space } from 'ant-design-vue';
  import { useGlobSetting } from '@/hooks/setting';
  import { getToken } from '@/utils/auth';
  import { useMessage } from '@/hooks/web/useMessage';
  import { onMounted, ref } from 'vue';
  import { IconEnum } from '@/enums/appEnum';
  import UserSelectModal from '@/views/workflow/components/UserSelectModal/index.vue';
  import type { User } from '@/api/system/user/model';
  import {
    completeTask,
    terminationTask,
    getTaskById,
    delegateTask,
    transferTask,
    deleteMultiInstanceExecution,
    addMultiInstanceExecution,
  } from '@/api/workflow/task';
  import type { TaskInstance, DeleteMultiInstanceVo } from '@/api/workflow/task/model';
  import RejectModal from './RejectModal.vue';
  import DeleteMultiInstanceModal from './DeleteMultiInstanceModal';
  import AddMultiInstanceModal from '@/views/workflow/components/AddMultiInstanceModal/index.vue';
  import { useTabs } from '@/hooks/web/useTabs';
  import { getPopupContainer } from '@/utils';

  defineOptions({ name: 'ApprovalContent' });

  const emit = defineEmits(['register', 'reload']);
  const props = defineProps({
    taskId: {
      type: String,
      required: true,
    },
  });

  const currentTask = ref<TaskInstance | null>(null);

  onMounted(async () => {
    await setFieldsValue({ taskId: props.taskId });
    const resp = await getTaskById(props.taskId);
    currentTask.value = resp;
  });

  const [registerForm, { resetFields, getFieldsValue, setFieldsValue }] = useForm({
    name: 'approval_content',
    schemas: modalSchemas,
    showActionButtonGroup: false,
    labelWidth: 100,
    baseColProps: {
      span: 24,
    },
  });

  const acceptFiles = '.doc,.docx,.xls,.xlsx,.ppt, .pptx, .pdf, .txt, .zip';
  const { apiUrl, clientId } = useGlobSetting();
  const uploadUrl = `${apiUrl}/resource/oss/upload`;
  // 使用upload组件只能这样上传
  // todo 封装组件
  const headers = {
    Authorization: 'Bearer ' + getToken(),
    clientId,
  };

  // 附件id
  const ossIdlList = ref<string[]>([]);
  // 抄送信息
  const ccList = ref<Recordable[]>([]);
  const { createMessage, createConfirm } = useMessage();
  function handleChange(info: Record<string, any>) {
    console.log(info);
    const file = info.file;
    const status = file?.status;

    if (status === 'done') {
      // http 200会走到这里  需要再次判断
      const { response } = file;
      const { code, msg = '服务器错误', data } = response;
      if (code === 200) {
        const { ossId } = data;
        // 添加
        ossIdlList.value.push(ossId);
      } else {
        createMessage.error(msg);
      }
    }

    // 删除文件
    if (status === 'removed') {
      // http 200会走到这里  需要再次判断
      const { response } = file;
      const { code, msg = '服务器错误', data } = response;
      if (code === 200) {
        const { ossId } = data;
        // 删除对应的ID
        const index = ossIdlList.value.indexOf(ossId);
        index !== -1 && ossIdlList.value.splice(index, 1);
      } else {
        createMessage.error(msg);
      }
    }
  }

  const [registerUserSelectModal, { openModal: openUserSelectModal }] = useModal();
  function handleSelectCC() {
    openUserSelectModal(true, { type: 'copy' });
  }

  const [registerRejectModal, { openModal: openRejectModal }] = useModal();
  function handleOpenRejectModal() {
    if (!currentTask.value) {
      return;
    }
    const processInstanceId = currentTask.value.processInstanceId;
    const taskId = props.taskId;
    openRejectModal(true, { taskId, processInstanceId });
  }
  // 抄送
  function onCCSelectDone(userList: User[]) {
    console.log(userList);
    ccList.value = userList.map((item) => ({
      userId: item.userId,
      userName: item.userName,
      nickName: item.nickName,
    }));
  }

  const buttonDisabled = ref(false);
  async function handleSubmit() {
    try {
      buttonDisabled.value = true;

      const data = getFieldsValue();
      // 添加附件
      data.fileId = ossIdlList.value.join(',');
      // 添加抄送
      data.wfCopyList = ccList.value;
      console.log(data);
      // 提交
      await completeTask(data);
      await handleReset();
      emit('reload');
    } catch (e) {
      console.warn(e);
    } finally {
      buttonDisabled.value = false;
    }
  }

  /**
   * 终止
   */
  async function handleTermination() {
    try {
      buttonDisabled.value = true;

      const data = getFieldsValue();
      const requestData = {
        taskId: props.taskId,
        comment: data.message,
      };
      await terminationTask(requestData);
      await handleReset();
      emit('reload');
    } catch (e) {
      console.warn(e);
    } finally {
      buttonDisabled.value = false;
    }
  }
  // 委托
  async function handleEntrust() {
    openUserSelectModal(true, { type: 'entrust' });
  }

  /**
   * 公共方法
   */
  function handle(text: string, userList: User[], api: (data: Recordable) => Promise<void>) {
    if (Array.isArray(userList) && userList.length === 0) {
      return;
    }
    const currentUser = userList[0];
    createConfirm({
      title: '提示',
      iconType: 'warning',
      content: `是否${text}给用户[${currentUser.nickName}]?`,
      async onOk() {
        const data: Recordable = {
          nickName: currentUser.nickName,
          userId: currentUser.userId,
          taskId: props.taskId,
        };
        const fieldsValue = getFieldsValue();
        if (fieldsValue.message) {
          data.comment = fieldsValue.message;
        }
        await api(data);
        emit('reload');
      },
    });
  }

  function onEntrustSelectDone(userList: User[]) {
    handle('委托', userList, delegateTask);
  }

  /**
   * 转办
   */
  async function handleTransfer() {
    openUserSelectModal(true, { type: 'transfer' });
  }
  function onTransferSelectDone(userList: User[]) {
    handle('转办', userList, transferTask);
  }

  const { refreshPage } = useTabs();

  /**
   * 加签
   */
  const [registerAddMultiInstanceModal, { openModal: openAddMultiInstanceModal }] = useModal();
  function handleAddMultiInstance() {
    if (!currentTask.value) {
      return;
    }
    openAddMultiInstanceModal(true, currentTask.value.id);
  }
  async function onAddMultiInstance(userList: User[]) {
    if (!currentTask.value || !userList.length) {
      return;
    }
    await addMultiInstanceExecution({
      taskId: currentTask.value.id,
      assignees: userList.map((item) => item.userId),
      assigneeNames: userList.map((item) => item.nickName),
    });
    /** 刷新当前页 */
    await refreshPage();
  }

  /**
   * 减签
   */
  const [registerDeleteMultiInstanceModal, { openModal: openDeleteMultiInstanceModal }] =
    useModal();
  async function onDeleteMultiInstance(selectList: DeleteMultiInstanceVo[]) {
    if (!currentTask.value) {
      return;
    }
    await deleteMultiInstanceExecution({
      taskId: currentTask.value.id,
      taskIds: selectList.map((item) => item.id),
      executionIds: selectList.map((item) => item.executionId),
      assigneeIds: selectList.map((item) => item.assignee),
      assigneeNames: selectList.map((item) => item.assigneeName),
    });
    /** 刷新当前页 */
    await refreshPage();
  }

  async function handleReset() {
    await resetFields();
    ossIdlList.value = [];
    ccList.value = [];
    currentTask.value = null;
  }
</script>

<style scoped></style>
