<template>
  <BasicModal
    v-bind="$attrs"
    title="上传微信群图片"
    @register="registerInnerModal"
    @ok="handleSubmit"
    @cancel="clearFileList"
  >
    <!-- 手动处理 而不是放入文件就上传 -->
    <UploadDragger
      v-model:fileList="fileList"
      :maxCount="1"
      :showUploadList="true"
      :beforeUpload="() => false"
      accept="image/*"
    >
      <p class="ant-upload-drag-icon">
        <inbox-outlined />
      </p>
      <p class="ant-upload-text">点击或者拖拽到此处上传文件</p>
    </UploadDragger>
  </BasicModal>
</template>

<script setup lang="ts">
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { wechatUpload } from './api';
  import { Upload } from 'ant-design-vue';
  import { InboxOutlined } from '@ant-design/icons-vue';
  import { ref, unref } from 'vue';
  import { UploadFile } from 'ant-design-vue/es/upload/interface';

  import { useLocalStorage } from '@vueuse/core';

  // https://blog.csdn.net/weixin_35498622/article/details/126969884
  const UploadDragger = Upload.Dragger;

  defineOptions({ name: 'WechatUploadModal' });

  const emit = defineEmits(['register', 'reload']);

  const fileList = ref<UploadFile[]>([]);
  const [registerInnerModal, { modalLoading, closeModal }] = useModalInner();

  const authPassword = useLocalStorage('authPassword', '');
  async function handleSubmit() {
    try {
      modalLoading(true);
      if (fileList.value.length !== 1) {
        closeModal();
        return;
      }
      const data = {
        password: authPassword.value,
        file: unref(fileList)[0].originFileObj!,
      };
      await wechatUpload(data);
      emit('reload');
      closeModal();
    } catch (e) {
      console.warn(e);
    } finally {
      clearFileList();
      modalLoading(false);
    }
  }

  function clearFileList() {
    fileList.value = [];
  }
</script>

<style scoped></style>
