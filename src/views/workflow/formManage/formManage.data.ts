import { BasicColumn } from '@/components/Table';
import { FormSchema } from '@/components/Form';
import { useRender } from '@/hooks/component/useRender';
import { DictEnum } from '@/enums/dictEnum';
import { getDictOptions } from '@/utils/dict';

export const formSchemas: FormSchema[] = [
  {
    label: '表单名称',
    field: 'formName',
    component: 'Input',
  },
];

const { renderDict } = useRender();
export const columns: BasicColumn[] = [
  {
    title: '表单名称',
    dataIndex: 'formName',
  },
  {
    title: '表单类型',
    dataIndex: 'formType',
    customRender({ value }) {
      return renderDict(value, DictEnum.WF_FORM_TYPE);
    },
  },
  {
    title: '地址',
    dataIndex: 'router',
  },
  {
    title: '备注',
    dataIndex: 'remark',
  },
];

export const modalSchemas: FormSchema[] = [
  {
    label: '主键',
    field: 'id',
    component: 'Input',
    show: false,
  },
  {
    label: '表单名称',
    field: 'formName',
    required: true,
    component: 'Input',
  },
  {
    label: '表单类型',
    field: 'formType',
    required: true,
    defaultValue: 'static',
    component: 'RadioButtonGroup',
    componentProps({ formActionType }) {
      return {
        options: getDictOptions(DictEnum.WF_FORM_TYPE),
        async onChange(e) {
          // 拿到的可能是Event || string
          if (typeof e !== 'string') {
            return;
          }
          const type = e as string;
          formActionType.updateSchema([
            {
              field: 'router',
              required: type === 'static',
            },
            {
              field: 'formTypeName',
              required: type === 'dynamic',
            },
          ]);
          await formActionType.clearValidate(['router', 'formTypeName']);
        },
      };
    },
  },
  {
    label: '路由地址',
    field: 'router',
    required: true,
    component: 'Input',
    show({ model }) {
      return model.formType === 'static';
    },
  },
  {
    label: '表单',
    field: 'formTypeName',
    // required: true,
    component: 'Select',
    componentProps: {
      disabled: true,
      placeholder: '暂不支持',
    },
    show({ model }) {
      // todo
      return model.formType === 'dynamic';
    },
  },
  {
    label: '备注',
    field: 'remark',
    component: 'InputTextArea',
  },
];
