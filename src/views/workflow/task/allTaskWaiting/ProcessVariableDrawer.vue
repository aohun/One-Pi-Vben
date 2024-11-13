<template>
  <BasicDrawer
    v-bind="$attrs"
    title="流程变量"
    :width="drawerWidth"
    :show-footer="false"
    @register="registerDrawerInner"
  >
    <Description @register="registerDescription" />
  </BasicDrawer>
</template>

<script setup lang="ts">
  import { useDrawerInner, BasicDrawer } from '@/components/Drawer';
  import { useMaxWidthOrDefault } from '@/hooks/web/useSize';
  import { getInstanceVariable } from '@/api/workflow/task';
  import { DescItem, Description, useDescription } from '@/components/Description';

  const drawerWidth = useMaxWidthOrDefault(600);
  const [registerDrawerInner, { drawerLoading }] = useDrawerInner(openDrawerCallback);
  async function openDrawerCallback(id: string) {
    drawerLoading(true);

    const ret = await getInstanceVariable(id);
    const schema: DescItem[] = [];
    const data = {};

    ret.forEach((item) => {
      data[item.key] = item.value;
      schema.push({ field: item.key, label: item.key });
    });

    setDescProps({
      data,
      schema,
    });

    drawerLoading(false);
  }

  const [registerDescription, { setDescProps }] = useDescription({
    column: 1,
    schema: [],
  });
</script>

<style scoped></style>
