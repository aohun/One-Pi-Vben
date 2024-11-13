<template>
  <Skeleton active :paragraph="{ rows: 8 }" :loading="showTreeSkeleton">
    <BasicTree
      :height="350"
      v-if="deptTreeArray.length"
      :fieldNames="{ title: 'label', key: 'id' }"
      :tree-data="deptTreeArray"
      :showLine="{ showLeafIcon: false }"
      :search="true"
      v-model:searchValue="searchValue"
      defaultExpandAll
      @select="$emit('select')"
      v-model:selectedKeys="selectDeptId"
    />
    <!-- 仅本人数据权限 可以考虑直接不显示 -->
    <div class="mt-5" v-else>
      <Empty :image="Empty.PRESENTED_IMAGE_SIMPLE" description="无部门数据" />
    </div>
  </Skeleton>
</template>

<script setup lang="ts">
  import { Skeleton, Empty } from 'ant-design-vue';
  import { BasicTree } from '@/components/Tree';
  import { onMounted, ref } from 'vue';
  import type { DeptTree } from '@/api/system/user/model';
  import { departmentTree } from '@/api/system/user';
  import { eachTree } from '@/utils/helper/treeHelper';

  /**
   * 新写法定义emit
   * 事件名称: 参数类型[]
   */
  defineEmits<{ select: [] }>();

  const selectDeptId = defineModel('selectDeptId', {
    type: Array as PropType<string[]>,
    required: true,
  });

  const searchValue = defineModel('searchValue', {
    type: String,
    default: '',
  });

  /** 部门数据源 */
  type DeptTreeArray = DeptTree[];
  const deptTreeArray = ref<DeptTreeArray>([]);
  /** 骨架屏加载 */
  const showTreeSkeleton = ref<boolean>(true);

  onMounted(async () => {
    const ret = await departmentTree();
    // 添加部门前图标 不需要 注释eachTree即可
    eachTree(ret, (item) => {
      item.icon = 'el:group';
    });
    deptTreeArray.value = ret;
    showTreeSkeleton.value = false;
  });
</script>
