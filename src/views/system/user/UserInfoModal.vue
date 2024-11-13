<template>
  <BasicModal
    v-bind="$attrs"
    :width="600"
    title="用户信息"
    :footer="null"
    @register="registerInnerModal"
  >
    <Description v-show="!showSkeleton" @register="registerDescription" />
    <Skeleton active v-if="showSkeleton" :paragraph="{ rows: 8 }" />
  </BasicModal>
</template>

<script setup lang="ts">
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { userInfo } from '@/api/system/user';
  import { Description, useDescription } from '@/components/Description';
  import { descSchema } from './user.info';
  import { Skeleton } from 'ant-design-vue';
  import { ref } from 'vue';

  defineOptions({ name: 'UserInfoModal' });

  const showSkeleton = ref<boolean>(true);
  const [registerInnerModal, { closeModal }] = useModalInner(async (userId: string | number) => {
    showSkeleton.value = true;
    if (!userId) {
      return closeModal();
    }
    const response = await userInfo(userId);
    // 外部的roleIds postIds才是真正对应的  新增时为空
    // posts有为Null的情况 需要给默认值
    const { postIds = [], roleIds = [], user, roles = [], posts = [] } = response;

    const postNames = posts
      .filter((item) => postIds.includes(item.postId))
      .map((item) => item.postName);

    const roleNames = roles
      .filter((item) => roleIds.includes(item.roleId))
      .map((item) => item.roleName);

    (user as any).postNames = postNames;
    (user as any).roleNames = roleNames;

    // 赋值
    setDescProps({ data: user });
    showSkeleton.value = false;
  });

  const [registerDescription, { setDescProps }] = useDescription({
    column: 1,
    labelStyle: {
      width: '150px',
      minWidth: '150px',
    },
    schema: descSchema,
  });
</script>

<style scoped></style>
