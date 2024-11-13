// 通用上传接口
// import { uploadApi } from '@/api/upload';
import { JsonPreview } from '@/components/CodeEditor';
import CollapseContainer from '@/components/Container/src/collapse/CollapseContainer.vue';
import { useForm } from '@/components/Form';
import BasicForm from '@/components/Form/src/BasicForm.vue';
import { PageWrapper } from '@/components/Page';
import { defineComponent, ref } from 'vue';
import { Alert, Space } from 'ant-design-vue';

export default defineComponent({
  setup() {
    const imageJson = ref<Recordable>({});
    const fileJson = ref<Recordable>({});

    const [registerImageForm] = useForm({
      baseColProps: { span: 24 },
      labelWidth: 80,
      showActionButtonGroup: false,
      schemas: [
        {
          field: 'image',
          label: '图片',
          component: 'ImageUpload',
          componentProps: {
            // api: uploadApi, // 可自行按照uploadApi更改
            accept: ['jpg'], // 不支持image/* 建议使用拓展名
            maxNumber: 1, // 最大上传文件数
            resultField: 'url', // 上传成功后返回的字段名
            onChange(e) {
              imageJson.value = e;
            },
          },
        },
      ],
    });

    const [registerFileForm] = useForm({
      baseColProps: { span: 24 },
      labelWidth: 80,
      showActionButtonGroup: false,
      schemas: [
        {
          field: 'image',
          label: '文件上传',
          component: 'Upload',
          componentProps: {
            accept: ['xlsx'], // 不支持image/* 建议使用拓展名
            maxNumber: 3, // 最大上传文件数
            resultField: 'ossId', // 上传成功后返回的字段名
            onChange(e) {
              fileJson.value = e;
            },
          },
        },
      ],
    });

    return () => (
      <PageWrapper>
        <Space class={'w-full'} direction="vertical">
          <Alert message={'默认返回为数组 需要提交string类型需自行转换'}></Alert>
          <CollapseContainer title="图片上传 (返回字段为url)" canExpand={false}>
            <div class="flex p-16px flex-col gap-8px">
              <BasicForm onRegister={registerImageForm}></BasicForm>
              <JsonPreview data={imageJson.value} />
            </div>
          </CollapseContainer>
          <CollapseContainer title="文件上传 (返回字段为ID)" canExpand={false}>
            <div class="flex p-16px flex-col gap-8px">
              <BasicForm onRegister={registerFileForm}></BasicForm>
              <JsonPreview data={fileJson.value} />
            </div>
          </CollapseContainer>
        </Space>
      </PageWrapper>
    );
  },
});
