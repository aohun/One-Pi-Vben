/**
 * 节点状态
 * tagColor: tag组件的color
 * timeLineColor: Timeline.Item的color https://www.antdv.com/components/timeline-cn#api
 */
export interface NodeStatus {
  label: string;
  value: string;
  timeLineColor: string;
  tagColor: string;
}

export const nodeStatusOptions = [
  { label: '撤销', value: 'cancel', color: 'warning' },
  { label: '通过', value: 'pass', color: 'green' },
  { label: '待审核', value: 'waiting', color: 'processing' },
  { label: '作废', value: 'invalid', color: 'black' },
  { label: '退回', value: 'back', color: 'warning' },
  { label: '终止', value: 'termination', color: 'error' },
  { label: '转办', value: 'transfer', color: 'blue' },
  { label: '委托', value: 'pending', color: 'blue' },
  { label: '加签', value: 'copy', color: 'success' },
  { label: '减签', value: 'sign_off', color: 'orange' },
];

export const businessStatusOptions = [
  { label: '已撤销', value: 'cancel', color: 'gray' },
  { label: '草稿', value: 'draft', color: 'default' },
  { label: '待审核', value: 'waiting', color: 'processing' },
  { label: '已完成', value: 'finish', color: 'green' },
  { label: '已作废', value: 'invalid', color: 'black' },
  { label: '已退回', value: 'back', color: 'warning' },
  { label: '已终止', value: 'termination', color: 'error' },
];
