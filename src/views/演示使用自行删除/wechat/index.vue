<template>
  <PageWrapper dense>
    <div class="flex flex-row">
      <div class="<sm:hidden">
        <h3 class="text-center">人数已满, 需要手动拉人👇</h3>
        <Image
          :src="'data:image/png;base64,' + currentImage"
          :width="360"
          :preview="false"
          fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3PTWBSGcbGzM6GCKqlIBRV0dHRJFarQ0eUT8LH4BnRU0NHR0UEFVdIlFRV7TzRksomPY8uykTk/zewQfKw/9znv4yvJynLv4uLiV2dBoDiBf4qP3/ARuCRABEFAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghgg0Aj8i0JO4OzsrPv69Wv+hi2qPHr0qNvf39+iI97soRIh4f3z58/u7du3SXX7Xt7Z2enevHmzfQe+oSN2apSAPj09TSrb+XKI/f379+08+A0cNRE2ANkupk+ACNPvkSPcAAEibACyXUyfABGm3yNHuAECRNgAZLuYPgEirKlHu7u7XdyytGwHAd8jjNyng4OD7vnz51dbPT8/7z58+NB9+/bt6jU/TI+AGWHEnrx48eJ/EsSmHzx40L18+fLyzxF3ZVMjEyDCiEDjMYZZS5wiPXnyZFbJaxMhQIQRGzHvWR7XCyOCXsOmiDAi1HmPMMQjDpbpEiDCiL358eNHurW/5SnWdIBbXiDCiA38/Pnzrce2YyZ4//59F3ePLNMl4PbpiL2J0L979+7yDtHDhw8vtzzvdGnEXdvUigSIsCLAWavHp/+qM0BcXMd/q25n1vF57TYBp0a3mUzilePj4+7k5KSLb6gt6ydAhPUzXnoPR0dHl79WGTNCfBnn1uvSCJdegQhLI1vvCk+fPu2ePXt2tZOYEV6/fn31dz+shwAR1sP1cqvLntbEN9MxA9xcYjsxS1jWR4AIa2Ibzx0tc44fYX/16lV6NDFLXH+YL32jwiACRBiEbf5KcXoTIsQSpzXx4N28Ja4BQoK7rgXiydbHjx/P25TaQAJEGAguWy0+2Q8PD6/Ki4R8EVl+bzBOnZY95fq9rj9zAkTI2SxdidBHqG9+skdw43borCXO/ZcJdraPWdv22uIEiLA4q7nvvCug8WTqzQveOH26fodo7g6uFe/a17W3+nFBAkRYENRdb1vkkz1CH9cPsVy/jrhr27PqMYvENYNlHAIesRiBYwRy0V+8iXP8+/fvX11Mr7L7ECueb/r48eMqm7FuI2BGWDEG8cm+7G3NEOfmdcTQw4h9/55lhm7DekRYKQPZF2ArbXTAyu4kDYB2YxUzwg0gi/41ztHnfQG26HbGel/crVrm7tNY+/1btkOEAZ2M05r4FB7r9GbAIdxaZYrHdOsgJ/wCEQY0J74TmOKnbxxT9n3FgGGWWsVdowHtjt9Nnvf7yQM2aZU/TIAIAxrw6dOnAWtZZcoEnBpNuTuObWMEiLAx1HY0ZQJEmHJ3HNvGCBBhY6jtaMoEiJB0Z29vL6ls58vxPcO8/zfrdo5qvKO+d3Fx8Wu8zf1dW4p/cPzLly/dtv9Ts/EbcvGAHhHyfBIhZ6NSiIBTo0LNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiEC/wGgKKC4YMA4TAAAAABJRU5ErkJggg=="
        />
      </div>
      <div>
        <BasicTable @register="registerTable">
          <template #tableTitle>
            <Space>
              <a-button type="primary" @click="handleUpload" v-auth="'wechat:wechat:upload'"
                >上传群图片</a-button
              >
              <a-button type="primary" @click="handleAuth" v-auth="'wechat:wechat:list'"
                >授权</a-button
              >
              <a-button @click="refresh" v-auth="'wechat:wechat:list'">刷新缓存</a-button>
              <Alert
                class="h-30px <sm:hidden"
                show-icon
                message="该功能只是为了方便上传gitee微信群图片, 勿乱操作(会禁止登录)"
                type="warning"
              />
            </Space>
          </template>
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'groupImg'">
              <TableImg :imgList="[record.groupImg]" />
            </template>
            <template v-if="column.key === 'action'">
              <TableAction
                stopButtonPropagation
                :actions="[
                  {
                    label: '设为默认',
                    icon: IconEnum.EDIT,
                    disabled: record.status == 0,
                    auth: 'wechat:wechat:edit',
                    onClick: handleChangeStatus.bind(null, record),
                  },
                  {
                    label: '删除',
                    icon: IconEnum.DELETE,
                    color: 'error',
                    disabled: record.status == 0,
                    auth: 'wechat:wechat:remove',
                    popConfirm: {
                      placement: 'left',
                      title: '是否删除微信群[' + record.id + ']?',
                      confirm: handleDelete.bind(null, record),
                    },
                  },
                ]"
              />
            </template>
          </template>
        </BasicTable>
      </div>
    </div>

    <WechatUploadModal @register="registerUploadModal" @reload="reload" />
    <AuthModal @register="registerAuthModal" />
  </PageWrapper>
</template>

<script setup lang="ts">
  import { PageWrapper } from '@/components/Page';
  import { BasicTable, useTable, TableAction, TableImg } from '@/components/Table';
  import { Space, Alert, Image } from 'ant-design-vue';
  import {
    wechatList,
    wechatRemove,
    wechatChangeStatus,
    currentGroupImageBase64,
    refresh,
  } from './api';
  import { useModal } from '@/components/Modal';
  import { columns } from './wechat.data';
  import { IconEnum } from '@/enums/appEnum';
  import WechatUploadModal from './UploadModal.vue';
  import AuthModal from './AuthModal.vue';
  import { useMessage } from '@/hooks/web/useMessage';
  import { useLocalStorage } from '@vueuse/core';
  import { cloneDeep } from 'lodash-es';
  import { onMounted, ref } from 'vue';

  defineOptions({ name: 'Wechat' });

  const currentImage = ref<string>('');
  onMounted(async () => {
    await loadCurrentImage();
  });

  async function loadCurrentImage() {
    currentImage.value = await currentGroupImageBase64();
  }

  const [registerTable, { reload }] = useTable({
    rowSelection: {
      type: 'checkbox',
    },
    api: wechatList,
    showIndexColumn: false,
    rowKey: 'id',
    columns: columns,
    actionColumn: {
      width: 200,
      title: '操作',
      key: 'action',
      fixed: 'right',
    },
  });

  const [registerUploadModal, { openModal: openUploadModal }] = useModal();
  const [registerAuthModal, { openModal: openAuthModal }] = useModal();

  const authPassword = useLocalStorage('authPassword', '');
  function handleUpload() {
    openUploadModal(true);
  }

  function handleAuth() {
    openAuthModal(true);
  }

  const { createConfirm } = useMessage();
  async function handleChangeStatus(record: Recordable) {
    createConfirm({
      iconType: 'warning',
      title: '提示',
      content: `是否将此项目设为默认`,
      onOk: async () => {
        const data = cloneDeep(record);
        data.status = data.status == 1 ? 0 : 1;
        await wechatChangeStatus(data, authPassword.value);
        await reload();

        setTimeout(async () => {
          await loadCurrentImage();
        }, 3000);
      },
    });
  }

  async function handleDelete(record: Recordable) {
    await wechatRemove([record.id], authPassword.value);
    await reload();
  }
</script>

<style scoped></style>
