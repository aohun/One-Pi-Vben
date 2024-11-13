<template>
  <div></div>
</template>

<script setup lang="ts">
  import { onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import { authCallback } from '@/api/auth';
  import { OAuthLoginParams } from '@/api/auth/model';
  import { getToken } from '@/utils/auth';
  import { PageEnum } from '@/enums/pageEnum';
  import { useGo } from '@/hooks/web/usePage';
  import { useLoading } from '@/components/Loading';
  import { accountBindList } from '@/views/auth/common';
  import { useMessage } from '@/hooks/web/useMessage';
  import { useUserStore } from '@/store/modules/user';

  const route = useRoute();

  const code = route.query.code as string;
  const state = route.query.state as string;
  const stateJson = JSON.parse(atob(state));
  // 来源
  const source = route.query.source as string;
  // 租户ID
  const defaultTenantId = '000000';
  const tenantId = (stateJson.tenantId as string) ?? defaultTenantId;
  const domain = stateJson.domain as string;

  const go = useGo();
  const { createMessage } = useMessage();
  const [openFullLoading, closeFullLoading] = useLoading({
    tip: '加载中...',
  });
  const { login } = useUserStore();

  onMounted(async () => {
    // 如果域名不相等 则重定向处理
    const host = window.location.host;
    if (domain !== host) {
      const urlFull = new URL(window.location.href);
      urlFull.host = domain;
      window.location.href = urlFull.toString();
      return;
    }

    try {
      openFullLoading();
      // 已经实现的平台
      const currentClient = accountBindList.find((item) => item.source === source && item.action);
      if (!currentClient) {
        createMessage.error({ content: `未找到${source}平台` });
        return;
      }
      const data: OAuthLoginParams = {
        socialCode: code,
        socialState: state,
        tenantId: tenantId,
        source,
        grantType: 'social',
      };
      // 没有token为登录 有token是授权
      if (!getToken()) {
        // todo
        await login(data);
        createMessage.success(source + '登录成功');
      } else {
        await authCallback(data);
        createMessage.success(source + '授权成功');
      }
    } catch (e) {
      // 500 你还没有绑定第三方账号，绑定后才可以登录！
    } finally {
      closeFullLoading();
      setTimeout(() => {
        go(PageEnum.BASE_HOME);
      }, 2000);
    }
  });
</script>

<style scoped></style>
