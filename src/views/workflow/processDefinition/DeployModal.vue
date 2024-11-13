<template>
  <BasicModal
    v-bind="$attrs"
    title="部署流程文件"
    :width="600"
    :can-fullscreen="false"
    :showCancelBtn="false"
    :showOkBtn="false"
    @register="registerInnerModal"
  >
    <UploadDragger
      name="file"
      :multiple="false"
      :maxCount="1"
      :data="{ categoryCode: categoryCodeStr }"
      :action="uploadUrl"
      :headers="headers"
      :accept="acceptFiles"
      @change="handleChange"
    >
      <p class="ant-upload-drag-icon">
        <inbox-outlined />
      </p>
      <p class="ant-upload-text">点击或者拖拽上传附件</p>
      <p class="ant-upload-hint"> 仅支持 .zip、.bpmn20.xml、bpmn 格式文件 </p>
    </UploadDragger>
  </BasicModal>
</template>

<script setup lang="ts">
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { useGlobSetting } from '@/hooks/setting';
  import { Upload } from 'ant-design-vue';
  import { InboxOutlined } from '@ant-design/icons-vue';
  import { getToken } from '@/utils/auth';
  import { useMessage } from '@/hooks/web/useMessage';
  import { ref } from 'vue';
  import {} from '@/api/workflow/processDefinition';

  const UploadDragger = Upload.Dragger;

  defineOptions({ name: 'DeployModal' });

  const emit = defineEmits(['register', 'reload']);

  const categoryCodeStr = ref<string>('');
  const [registerInnerModal, { closeModal }] = useModalInner((categoryCode: string) => {
    categoryCodeStr.value = categoryCode;
  });

  // 允许上传的文件
  const acceptFiles = '.zip,.bpmn20.xml,.bpmn';
  const { apiUrl, clientId } = useGlobSetting();
  // 部署的url
  const uploadUrl = `${apiUrl}/workflow/processDefinition/deployByFile`;
  const headers = {
    Authorization: 'Bearer ' + getToken(),
    clientId,
  };

  const { createMessage } = useMessage();
  function handleChange(info: Record<string, any>) {
    const file = info.file;
    const status = file?.status;

    if (status === 'done') {
      // 这里只返回http状态 并没有响应体
      const xhr: XMLHttpRequest = file.xhr;
      if (xhr.status === 200) {
        createMessage.success('部署成功');
        emit('reload');
        closeModal();
      } else {
        const msg = '服务器错误';
        createMessage.error(msg);
      }
    }
  }
</script>

<style scoped></style>
