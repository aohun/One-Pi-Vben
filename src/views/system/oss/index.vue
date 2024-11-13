<template>
  <PageWrapper dense>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <Space>
          <Tooltip title="预览图片">
            <Switch v-model:checked="preview" />
          </Tooltip>
          <a-button v-auth="'system:ossConfig:list'" @click="handleToSettings">配置管理</a-button>
          <a-button
            class="<sm:hidden"
            type="primary"
            danger
            @click="multipleRemove(ossRemove)"
            :disabled="!selected"
            v-auth="'system:oss:remove'"
            >删除</a-button
          >
          <FileUpload
            v-auth="'system:oss:upload'"
            class="<sm:hidden"
            v-bind="fileAttrs"
            @reload="reload"
          />
          <FileUpload v-auth="'system:oss:upload'" v-bind="imageAttrs" @reload="reload" />
        </Space>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'url'">
          <TableImg
            v-if="preview && isImageFile(record.url)"
            :imgList="[record.url]"
            :size="50"
            simpleShow
          />
          <Tooltip v-else :title="record.url">{{ record.url }}</Tooltip>
        </template>
        <template v-if="column.key === 'action'">
          <TableAction
            stopButtonPropagation
            :actions="[
              {
                label: '下载',
                icon: IconEnum.DOWNLOAD,
                type: 'primary',
                ghost: true,
                auth: 'system:oss:download',
                onClick: handleDownload.bind(null, record),
              },
              {
                label: '删除',
                icon: IconEnum.DELETE,
                type: 'primary',
                danger: true,
                ghost: true,
                auth: 'system:oss:remove',
                popConfirm: {
                  placement: 'left',
                  title: `是否删除文件[${record.fileName}]?`,
                  confirm: handleDelete.bind(null, record),
                },
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
  </PageWrapper>
</template>

<script setup lang="ts">
  import { PageWrapper } from '@/components/Page';
  import { BasicTable, useTable, TableAction } from '@/components/Table';
  import { Space, Switch, Tooltip } from 'ant-design-vue';
  import { useLoading } from '@/components/Loading';
  import { onMounted, ref, reactive } from 'vue';
  import { ossList, ossRemove, ossDownload } from '@/api/system/oss';
  import { configInfoByKey } from '@/api/system/config';
  import { useGo } from '@/hooks/web/usePage';
  import { downloadByData } from '@/utils/file/download';
  import { IconEnum } from '@/enums/appEnum';
  import { formSchemas, columns } from './oss.data';
  import FileUpload from './components/FileUpload.vue';
  import { MimeType } from '@/enums/mimeType';
  import { createAsyncComponent } from '@/utils/factory/createAsyncComponent';

  /**
   * 异步导入
   */
  const TableImg = createAsyncComponent(
    () => import('@/components/Table/src/components/TableImg.vue'),
  );

  defineOptions({ name: 'Oss' });

  const preview = ref<boolean>(false);

  const imageAttrs = reactive({
    btnText: '上传图片',
    accept: ['image/*'],
    maxSize: 5,
  });

  const { txt, doc, docx, xls, xlsx, ppt, pptx, pdf, mp3 } = MimeType;
  const fileAttrs = reactive({
    btnText: '上传文件',
    accept: [txt, doc, docx, xls, xlsx, ppt, pptx, pdf, mp3],
    maxSize: 10,
  });

  function isImageFile(ext: string) {
    const supportList = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    return supportList.some((item) => ext.toLocaleLowerCase().includes(item));
  }

  onMounted(async () => {
    const ret = await configInfoByKey('sys.oss.previewListResource');
    preview.value = Boolean(ret);
  });

  const [registerTable, { reload, selected, multipleRemove }] = useTable({
    rowSelection: {
      type: 'checkbox',
    },
    title: '文件列表',
    showIndexColumn: false,
    api: ossList,
    rowKey: 'ossId',
    useSearchForm: true,
    formConfig: {
      schemas: formSchemas,
      labelWidth: 100,
      baseColProps: {
        xs: 24,
        sm: 24,
        md: 24,
        lg: 6,
      },
      // 日期选择格式化
      fieldMapToTime: [
        // 'YYYY-MM-DD'为时间格式，参考moment
        [
          'createTime',
          ['params[beginCreateTime]', 'params[endCreateTime]'],
          ['YYYY-MM-DD 00:00:00', 'YYYY-MM-DD 23:59:59'],
        ],
      ],
    },
    columns: columns,
    actionColumn: {
      width: 200,
      title: '操作',
      key: 'action',
      fixed: 'right',
    },
  });

  const [openFullLoading, closeFullLoading] = useLoading({
    tip: '下载文件中...',
  });
  async function handleDownload(record: Recordable) {
    try {
      openFullLoading();
      const data = await ossDownload(record.ossId);
      downloadByData(data, record.originalName);
    } finally {
      closeFullLoading();
    }
  }

  async function handleDelete(record: Recordable) {
    await ossRemove([record.ossId]);
    await reload();
  }

  const go = useGo();
  function handleToSettings() {
    go('/system/oss-config/index');
  }
</script>

<style scoped></style>
