import { BasicColumn, FormSchema } from '@/components/Table';
import { Rule } from '@/components/Form';
import { VxeGridPropTypes, VxeTablePropTypes } from '@/components/VxeTable';
import { Input, Select } from 'ant-design-vue';

interface TypeOptions {
  label: string;
  value: string;
  placeholder: string;
  rules: Rule[];
}

export const typeSelectOptions: TypeOptions[] = [
  {
    label: 'Java类',
    value: 'class',
    placeholder: '填写全限定Java类名, 如: com.a.Test',
    rules: [
      {
        required: true,
        message: '输入正确的Java类名',
        trigger: ['change', 'blur'],
        pattern: /^([a-zA-Z_$][a-zA-Z\d_$]*\.)*[a-zA-Z_$][a-zA-Z\d_$]*$/,
      },
    ],
  },
  {
    label: '表达式',
    value: 'expression',
    placeholder: '如: ${beanClass.doSomething(execution)}',
    rules: [
      {
        required: true,
        message: '输入正确的表达式',
        trigger: ['change', 'blur'],
        pattern: /\$\{\S+\.\S+(\(\S+\))?}/,
      },
    ],
  },
  {
    label: '委托表达式',
    value: 'delegateExpression',
    placeholder: '如: ${beanClass}',
    rules: [
      {
        required: true,
        message: '输入正确的委托表达式',
        trigger: ['change', 'blur'],
        pattern: /\$\{\S+\}/,
      },
    ],
  },
];

/**
 * executionListener: 执行监听器
 * taskListener: 任务监听器
 */
export type ListenerType = 'executionListener' | 'taskListener';

/**
 * 执行监听器
 */
export const eventSelectOptions = [
  { label: '开始事件', value: 'start' },
  { label: '结束事件', value: 'end' },
  { label: '启用事件', value: 'take' },
];
/**
 * 任务监听器
 */
export const taskEventSelectOptions = [
  { label: '创建', value: 'create' },
  { label: '指派', value: 'assignment' },
  { label: '完成', value: 'complete' },
  { label: '删除', value: 'delete' },
];

export const rowTypeOptions = [
  { label: '字符串', value: 'stringValue' },
  { label: '表达式', value: 'expression' },
];

export const schemas: FormSchema[] = [
  {
    label: '事件',
    field: 'event',
    component: 'Select',
    required: true,
    componentProps: {
      allowClear: false,
      options: eventSelectOptions,
    },
  },
  {
    label: '类型',
    field: 'type',
    required: true,
    component: 'Select',
    componentProps({ formActionType }) {
      const { updateSchema, clearValidate } = formActionType;
      return {
        allowClear: false,
        options: typeSelectOptions,
        onSelect: async (value) => {
          const found = typeSelectOptions.find((item) => item.value === value);
          if (!found) {
            return;
          }
          // 清除校验
          await clearValidate();
          await updateSchema({
            field: 'className',
            label: found.label,
            rules: found.rules,
            componentProps: {
              placeholder: found.placeholder,
            },
          });
        },
      };
    },
  },
  {
    label: '表达式',
    field: 'className',
    component: 'Input',
    show({ model }) {
      return model.type ? true : false;
    },
  },
];

export const columns: BasicColumn[] = [
  {
    dataIndex: 'type',
    title: '类型',
    editRow: true,
    align: 'left',
    editComponent: 'Select',
    editComponentProps: {
      options: rowTypeOptions,
    },
    editRule: true,
  },
  {
    dataIndex: 'name',
    title: '名称',
    align: 'left',
    editRow: true,
    editComponent: 'Input',
    editRule: true,
  },
  {
    dataIndex: 'value',
    title: '值',
    align: 'left',
    editRow: true,
    editComponent: 'Input',
    editRule: true,
  },
];

export const validRules: VxeTablePropTypes.EditRules = {
  type: [{ required: true, message: '请选择' }],
  name: [{ required: true, message: '请输入' }],
  value: [{ required: true, message: '请输入' }],
};

export const vxeTableColumns: VxeGridPropTypes.Columns = [
  {
    type: 'checkbox',
    align: 'center',
    width: 60,
  },
  {
    title: '类型',
    field: 'type',
    align: 'center',
    slots: {
      default: ({ row }) => {
        const found = rowTypeOptions.find((item) => item.value === row.type);
        return found ? found.label : row.type;
      },
      edit: ({ row }) => {
        return (
          <Select v-model:value={row.type} options={rowTypeOptions} placeholder="选择类型"></Select>
        );
      },
    },
    editRender: {},
  },
  {
    title: '名称',
    field: 'name',
    align: 'center',
    slots: {
      edit: ({ row }) => {
        return <Input v-model:value={row.name} placeholder="输入名称"></Input>;
      },
    },
    editRender: {},
  },
  {
    title: '值',
    field: 'value',
    align: 'center',
    slots: {
      edit: ({ row }) => {
        return <Input v-model:value={row.value} placeholder="输入值"></Input>;
      },
    },
    editRender: {},
  },
  {
    title: '操作',
    align: 'center',
    slots: {
      default: ({ $table, row }) => {
        function removeRow() {
          $table.remove(row);
        }
        return (
          <a-button danger size="small" onClick={removeRow}>
            删除
          </a-button>
        );
      },
    },
  },
];
