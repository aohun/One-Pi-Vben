<template>
  <BasicModal
    v-bind="$attrs"
    title="用户选择"
    defaultFullscreen
    :canFullscreen="false"
    @register="registerInnerModal"
    @ok="handleOk"
    @cancel="handleReset"
  >
    <Row>
      <!-- 左边部门选择 -->
      <Col v-bind="{ xs: 24, sm: 24, md: 24, lg: 4 }" class="h-[calc(100vh-80px)]">
        <Skeleton :active="true" :paragraph="{ rows: 8 }" :loading="showTreeSkeleton">
          <BasicTree
            v-if="data.tree.length"
            :fieldNames="{ title: 'label', key: 'id' }"
            :tree-data="data.tree as any"
            :showLine="{ showLeafIcon: false }"
            :search="true"
            v-model:searchValue="deptSearchText"
            defaultExpandAll
            @select="handleSelectDept"
            v-model:selectedKeys="data.selectDeptId"
          />
        </Skeleton>
      </Col>
      <!-- 右边表格及菜单 -->
      <Col v-bind="{ xs: 24, sm: 24, md: 24, lg: 20 }">
        <BasicTable @register="registerTable" @row-click="handleRowClick">
          <template #tableTitle>
            <Tag v-for="item in getSelectRows()" :key="item.userId">{{ item.nickName }}</Tag>
          </template>
          <template #bodyCell="{ column, record }">
            <template v-if="column && record && column.dataIndex === 'avatar'">
              <avatar v-if="record.avatar" :src="record.avatar" />
              <avatar
                v-else
                src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
              />
            </template>
          </template>
        </BasicTable>
      </Col>
    </Row>
  </BasicModal>
</template>

<script setup lang="ts">
  import { useModalInner, BasicModal } from '@/components/Modal';
  import { Row, Col, Skeleton, Avatar, Tag } from 'ant-design-vue';
  import { BasicTree } from '@/components/Tree/index';
  import { departmentTree, type DeptTreeData } from '@/api/system/user';
  // 这里使用工作流的user而不是systemUser
  // import { getPageByUserList } from '@/api/workflow/user';
  import { userList } from '@/api/system/user';
  import { onMounted, reactive, ref } from 'vue';
  import { BasicTable, useTable } from '@/components/Table';
  import { columns, schemas } from './data';
  import { eachTree } from '@/utils/helper/treeHelper';
  import { getTaskUserIdsByAddMultiInstance } from '@/api/workflow/task';

  defineOptions({ name: 'AddMultiInstanceModal' });

  const props = defineProps({
    // 是否默认多选模式
    multiple: {
      type: Boolean,
      required: false,
      default: true,
    },
  });

  interface TreeProps {
    tree: DeptTreeData[];
    selectDeptId: string[];
  }
  /** 左边搜索框 */
  const deptSearchText = ref<string>('');
  const data: TreeProps = reactive({
    tree: [],
    selectDeptId: [],
  });
  const showTreeSkeleton = ref<boolean>(true);

  // 选中部门后刷新表格
  async function handleSelectDept() {
    await reload();
  }

  onMounted(async () => {
    const ret = await departmentTree();
    // 添加部门前图标 不需要 注释eachTree即可
    eachTree(ret, (item) => {
      item.icon = 'el:group';
    });
    data.tree = ret;
    showTreeSkeleton.value = false;
  });

  const [registerTable, { reload, getSelectRows, setSelectedRows }] = useTable({
    rowSelection: {
      type: 'checkbox',
    },
    showSelectionBar: true,
    // 点击选择行
    clickToRowSelect: true,
    // 切换页码不重置选中
    clearSelectOnPageChange: false,
    showIndexColumn: false,
    size: 'small',
    api: userList,
    rowKey: 'userId',
    useSearchForm: true,
    formConfig: {
      schemas: schemas,
      name: 'user',
      baseColProps: {
        xs: 24,
        sm: 24,
        md: 24,
        lg: 8,
      },
      labelWidth: 80,
      resetFunc: async () => {
        data.selectDeptId = [];
        deptSearchText.value = '';
        await reload();
      },
    },
    columns,
    // 需要添加上部门参数
    beforeFetch(params: Recordable) {
      if (data.selectDeptId.length === 1) {
        params.deptId = data.selectDeptId[0];
      }
      // 加上排除id  加签使用
      if (excludeUserIds.value) {
        params.excludeUserIds = excludeUserIds.value;
      }
      return params;
    },
  });

  const excludeUserIds = ref<string>('');
  const [registerInnerModal, { closeModal, modalLoading }] = useModalInner(openModalCallback);
  async function openModalCallback(taskId: string) {
    modalLoading(true);

    const idJoin = await getTaskUserIdsByAddMultiInstance(taskId);
    excludeUserIds.value = idJoin;

    modalLoading(false);
  }

  /**
   * selectDone为点击确定的回调 未选中返回空数组 选中返回对应的User[]
   */
  const emit = defineEmits(['register', 'selectDone']);

  function handleOk() {
    emit('selectDone', getSelectRows());
    closeModal();
    handleReset();
  }

  function handleReset() {
    excludeUserIds.value = '';
    setSelectedRows([]);
  }

  /**
   * rowClick点击事件
   */
  function handleRowClick(record: Recordable) {
    // 多选模式不做处理
    if (props.multiple) return;
    // 单选模式设置当前
    setSelectedRows([record]);
  }
</script>

<style lang="less" scoped>
  /** 去掉表格padding */
  :deep(.vben-basic-table-form-container) {
    padding: 5px;
  }
</style>
