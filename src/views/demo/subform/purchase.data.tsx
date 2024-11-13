import { BasicColumn } from '@/components/Table';
import { FormSchema } from '@/components/Form';
import { VxeGridPropTypes, VxeTablePropTypes } from 'vxe-table';
import { Input, InputNumber } from 'ant-design-vue';
import { useRender } from '@/hooks/component/useRender';
// import { businessStatusOptions } from '@/views/workflow/common';
import { DictEnum } from '@/enums/dictEnum';

export const formSchemas: FormSchema[] = [
  {
    label: '采购标题',
    field: 'name',
    component: 'Input',
  },
];

const { renderDict } = useRender();
export const columns: BasicColumn[] = [
  {
    title: '主键',
    dataIndex: 'id',
  },
  {
    title: '采购标题',
    dataIndex: 'name',
  },
  {
    title: '备注',
    dataIndex: 'notes',
  },
  {
    title: '流程状态',
    dataIndex: 'status',
    customRender({ value }) {
      return renderDict(value, DictEnum.WF_BUSINESS_STATUS);
    },
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
    label: '采购标题',
    field: 'name',
    required: true,
    component: 'Input',
  },
  {
    label: '备注',
    field: 'notes',
    component: 'InputTextArea',
  },
];

export const vxeTableColumns: VxeGridPropTypes.Columns = [
  {
    type: 'checkbox',
    align: 'center',
    width: 60,
  },
  {
    title: '序号',
    type: 'seq',
    fixed: 'left',
    width: '50',
    align: 'center',
  },
  {
    title: '名称',
    field: 'name',
    slots: {
      edit: ({ row }) => {
        return <Input v-model:value={row.name} placeholder="输入名称"></Input>;
      },
    },
    editRender: {},
  },
  {
    title: '数量',
    field: 'num',
    slots: {
      edit: ({ row }) => {
        return (
          <InputNumber
            v-model:value={row.num}
            min={1}
            max={100}
            placeholder="输入1-100"
          ></InputNumber>
        );
      },
    },
    editRender: {},
  },
  {
    title: '单价',
    field: 'price',
    slots: {
      edit: ({ row }) => {
        return (
          <InputNumber
            v-model:value={row.price}
            min={1}
            max={100}
            placeholder="输入1-100"
          ></InputNumber>
        );
      },
    },
    editRender: {},
  },
  {
    title: '总价',
    field: 'total',
    slots: {
      default: ({ row }) => {
        row.total = row.price * row.num;
        return row.total;
      },
    },
  },
];

export const validRules: VxeTablePropTypes.EditRules = {
  name: [{ required: true, message: '请输入' }],
  num: [{ required: true, message: '请输入' }],
  price: [{ required: true, message: '请输入' }],
};
