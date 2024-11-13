<template>
  <PageWrapper dense>
    <Row>
      <!-- 左边部门选择 -->
      <Col v-bind="{ xs: 24, sm: 24, md: 24, lg: 4 }" class="h-[calc(100vh-80px)]">
        <DeptTree
          v-model:selectDeptId="selectDeptId"
          v-model:searchValue="searchValue"
          @select="reload"
        />
      </Col>
      <!-- 右边表格及菜单 -->
      <Col v-bind="{ xs: 24, sm: 24, md: 24, lg: 20 }">
        <BasicTable @register="registerTable">
          <template #toolbar>
            <Space class="<sm:hidden">
              <a-button
                v-auth="'system:post:export'"
                @click="downloadExcel(postExport, '岗位数据', getForm().getFieldsValue())"
                >导出</a-button
              >
              <a-button
                class="<sm:hidden"
                type="primary"
                danger
                @click="multipleRemove(postRemove)"
                v-auth="'system:post:remove'"
                :disabled="!selected"
                >删除</a-button
              >
              <a-button type="primary" @click="handleAdd" v-auth="'system:post:add'">新增</a-button>
            </Space>
          </template>
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'action'">
              <TableAction
                stopButtonPropagation
                dropDownBtnDisplay
                :actions="[
                  {
                    label: '修改',
                    icon: IconEnum.EDIT,
                    type: 'primary',
                    ghost: true,
                    auth: 'system:user:edit',
                    ifShow: record.userId !== 1,
                    onClick: handleEdit.bind(null, record),
                  },
                  {
                    label: '删除',
                    icon: IconEnum.DELETE,
                    type: 'primary',
                    danger: true,
                    ghost: true,
                    auth: 'system:user:remove',
                    ifShow: record.userId !== 1,
                    popConfirm: {
                      placement: 'left',
                      title: `是否删除用户[${record.userName}]-${record.nickName}?`,
                      confirm: handleDelete.bind(null, record),
                    },
                  },
                ]"
              />
            </template>
          </template>
        </BasicTable>
      </Col>
    </Row>
    <PostDrawer @register="registerPostDrawer" @reload="reload" />
  </PageWrapper>
</template>

<script setup lang="ts">
  import { PageWrapper } from '@/components/Page';
  import { Row, Col, Space } from 'ant-design-vue';
  import { postList, postExport, postRemove } from '@/api/system/post';
  import { ref, toValue } from 'vue';
  import { BasicTable, useTable, TableAction } from '@/components/Table';
  import { downloadExcel } from '@/utils/file/download';
  import { columns, formSchemas } from './post.data';
  import { IconEnum } from '@/enums/appEnum';
  import PostDrawer from './PostDrawer.vue';
  import { useDrawer } from '@/components/Drawer';
  import DeptTree from '@/views/system/user/DeptTree.vue';

  // 缓存
  defineOptions({ name: 'Post' });

  // 左边部门用
  const selectDeptId = ref<string[]>([]);
  const searchValue = ref<string>('');

  const [registerTable, { reload, selected, multipleRemove, getForm }] = useTable({
    rowSelection: {
      type: 'checkbox',
    },
    title: '岗位列表',
    showIndexColumn: false,
    api: postList,
    rowKey: 'postId',
    useSearchForm: true,
    formConfig: {
      schemas: formSchemas,
      name: 'post',
      baseColProps: {
        xs: 24,
        sm: 24,
        md: 24,
        lg: 6,
      },
      labelWidth: 100,
      resetFunc: async () => {
        selectDeptId.value = [];
        searchValue.value = '';
        await reload();
      },
      // 日期选择格式化
      fieldMapToTime: [
        [
          'createTime',
          ['params[beginTime]', 'params[endTime]'],
          ['YYYY-MM-DD 00:00:00', 'YYYY-MM-DD 23:59:59'],
        ],
      ],
    },
    columns,
    // 需要添加上部门参数
    beforeFetch(params: Recordable) {
      if (toValue(selectDeptId).length === 1) {
        params.belongDeptId = toValue(selectDeptId)[0];
      }
      return params;
    },
    actionColumn: {
      width: 220,
      title: '操作',
      key: 'action',
      fixed: 'right',
    },
  });

  const [registerPostDrawer, { openDrawer }] = useDrawer();

  function handleEdit(record: Recordable) {
    openDrawer(true, { update: true, record });
  }

  function handleAdd() {
    openDrawer(true, { update: false });
  }

  async function handleDelete(record: Recordable) {
    await postRemove([record.postId]);
    await reload();
  }
</script>

<style lang="less" scoped>
  /** 去掉表格padding */
  :deep(.vben-basic-table-form-container) {
    padding: 5px;
  }
</style>
