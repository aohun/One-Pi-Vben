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
            :height="350"
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
        <BasicTable @register="registerTable">
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
  import { User } from '@/api/system/user/model';

  defineOptions({ name: 'UserSelectModal' });

  /**
   * @todo 这里加上[key: string] emit推断为string而非key
   * 需要添加类型 直接在后面加上
   */
  const options = {
    bpmnSingle: { single: true }, // 设计器单选
    bpmnMultiple: { single: false }, // 设计器多选
    copy: { single: false }, // 抄送多选
    transfer: { single: true }, // 转办单选
    entrust: { single: true }, // 委托单选
    single: { single: true }, // 通用单选 适用于只有一个组件 不需要指定类型
    multiple: { single: false }, // 通用多选 适用于只有一个组件 不需要指定类型
  };
  /** 当前类型 */
  type CurrentType = keyof typeof options;
  /**
   * emit类型 xxxxDone
   * 默认为数组类型 单选需要自行转换
   * */
  type EmitEvents = { (e: `${keyof typeof options}Done`, userList: User[]): void };
  const emit = defineEmits<EmitEvents>();

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

  async function loadDeptTree() {
    const ret = await departmentTree();
    // 添加部门前图标 不需要 注释eachTree即可
    eachTree(ret, (item) => {
      item.icon = 'el:group';
    });
    data.tree = ret;
    showTreeSkeleton.value = false;
  }
  // 部门加载一次就够了
  onMounted(loadDeptTree);

  const [registerTable, { reload, getSelectRows, setSelectedRows, setSelectedRowKeys, setProps }] =
    useTable({
      rowSelection: {
        type: 'checkbox',
      },
      immediate: false, // 每次打开modal手动获取
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
        return params;
      },
    });

  const [registerInnerModal, { closeModal, modalLoading }] = useModalInner(openModalCallback);

  const currentType = ref<CurrentType>('bpmnSingle');
  /**
   *
   * @param userIds 用于回显使用
   */
  async function openModalCallback(data: { type: CurrentType; userIds?: string[] }) {
    modalLoading(true);

    const { type, userIds } = data;
    // 设置type 单选/多选
    const selectMode = options[type].single ? 'radio' : 'checkbox';
    setProps({
      rowSelection: {
        type: selectMode,
      },
    });
    currentType.value = type;
    // 重新加载第一页
    await reload({ page: 1 });

    // 回显勾选的数据
    if (userIds && userIds.length) {
      console.log(userIds);
      setSelectedRowKeys(userIds);
    }

    modalLoading(false);
  }

  function handleOk() {
    // 根据不同的类型emit不同的事件
    emit(`${currentType.value}Done`, getSelectRows());
    closeModal();
    handleReset();
  }

  function handleReset() {
    setSelectedRows([]);
    // 清空部门选择
    data.selectDeptId = [];
    deptSearchText.value = '';
  }
</script>

<style lang="less" scoped>
  /** 去掉表格padding */
  :deep(.vben-basic-table-form-container) {
    padding: 5px;
  }
</style>
