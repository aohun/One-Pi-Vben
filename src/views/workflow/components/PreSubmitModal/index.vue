<template>
  <BasicModal
    v-bind="$attrs"
    title="提示"
    :width="600"
    :can-fullscreen="false"
    @register="registerInnerModal"
    @ok="handleSubmit"
    @cancel="handleReset"
  >
    <BasicForm @register="registerForm">
      <template #wfCopyList>
        <div class="flex flex-col gap-4px">
          <div>
            <Tag v-for="item in ccList" :key="item.userId">
              {{ item.nickName }}/{{ item.userName }}
            </Tag>
          </div>
          <a-button class="w-fit" pre-icon="bi:cc-square-fill" @click="handleSelectCC">
            选择抄送人
          </a-button>
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
    <UserSelectModal @register="registerUserModal" @copy-done="onSelectDone" />
    <template #footer>
      <a-button @click="handleReset">取消</a-button>
      <Popconfirm
        placement="topRight"
        title="确认提交吗?"
        ok-text="确认"
        cancel-text="再想想"
        :getPopupContainer="getPopupContainer"
        @confirm="handleSubmit"
      >
        <a-button type="primary">提交</a-button>
      </Popconfirm>
    </template>
  </BasicModal>
</template>

<script setup lang="ts">
  import { useModalInner, BasicModal, useModal } from '@/components/Modal';
  import { BasicForm, useForm } from '@/components/Form';
  import { modalSchemas } from './data';
  import { Upload, Tag, Popconfirm } from 'ant-design-vue';
  import { useGlobSetting } from '@/hooks/setting';
  import { getToken } from '@/utils/auth';
  import { useMessage } from '@/hooks/web/useMessage';
  import { ref } from 'vue';
  import { IconEnum } from '@/enums/appEnum';
  import UserSelectModal from '@/views/workflow/components/UserSelectModal/index.vue';
  import type { User } from '@/api/system/user/model';
  import { completeTask } from '@/api/workflow/task';
  import { getPopupContainer } from '@/utils';

  defineOptions({ name: 'PreSubmitModal' });

  const emit = defineEmits(['register', 'reload']);

  const [registerInnerModal, { closeModal }] = useModalInner(async (taskId: string) => {
    await setFieldsValue({ taskId });
  });

  const [registerForm, { resetFields, getFieldsValue, setFieldsValue }] = useForm({
    name: 'pre_submit',
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
  const { createMessage } = useMessage();
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

  const [registerUserModal, { openModal: OpenUserModal }] = useModal();
  function handleSelectCC() {
    const userIds = ccList.value.map((item) => item.userId);
    OpenUserModal(true, { type: 'copy', userIds });
  }

  function onSelectDone(userList: User[]) {
    console.log(userList);
    ccList.value = userList.map((item) => ({
      userId: item.userId,
      userName: item.userName,
      nickName: item.nickName,
    }));
  }

  async function handleSubmit() {
    const data = getFieldsValue();
    // 添加附件
    data.fileId = ossIdlList.value.join(',');
    // 添加抄送
    data.wfCopyList = ccList.value;
    // 提交
    await completeTask(data);
    closeModal();
    await handleReset();
    emit('reload');
  }

  async function handleReset() {
    await resetFields();
    ossIdlList.value = [];
    ccList.value = [];
    closeModal();
  }
</script>

<style scoped></style>
