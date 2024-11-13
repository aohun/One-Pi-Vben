<template>
  <div v-if="getShow">
    <LoginFormTitle class="enter-x" />
    <Form
      name="sms-login"
      class="p-4 enter-x"
      :model="formData"
      :rules="getFormRules"
      ref="formRef"
    >
      <FormItem class="enter-x">
        <Alert message="测试使用 并不会真的发送😅" type="info" />
      </FormItem>
      <FormItem name="tenantId" class="enter-x" v-if="tenant.tenantEnabled">
        <Select v-model:value="formData.tenantId" size="large">
          <template #suffixIcon>
            <Icon icon="mdi:company" />
          </template>
          <SelectOption v-for="item in tenant.voList" :key="item.tenantId" :value="item.tenantId">{{
            item.companyName
          }}</SelectOption>
        </Select>
      </FormItem>

      <FormItem name="mobile" class="enter-x">
        <Input
          size="large"
          v-model:value="formData.mobile"
          :placeholder="t('sys.login.mobile')"
          class="fix-auto-fill"
        />
      </FormItem>
      <FormItem name="sms" class="enter-x">
        <!-- 演示站使用 自行修改 默认placeholder :placeholder="t('sys.login.smsCode')" -->
        <CountdownInput
          size="large"
          class="fix-auto-fill"
          v-model:value="formData.sms"
          :sendCodeApi="sendCodeApi"
          placeholder="1234为正确"
        />
      </FormItem>

      <FormItem class="enter-x">
        <Button
          type="primary"
          size="large"
          block
          @click="handleLogin"
          :loading="loading"
          :disabled="!tenant.loadSuccess || !sentSms"
        >
          {{ t('sys.login.loginButton') }}
        </Button>
        <Button size="large" block class="mt-4" @click="handleBackLogin">
          {{ t('sys.login.backSignIn') }}
        </Button>
      </FormItem>
    </Form>
  </div>
</template>
<script lang="ts" setup>
  import { reactive, ref, computed, unref, watch } from 'vue';
  import { Form, Input, Button, Select, Alert } from 'ant-design-vue';
  import { CountdownInput } from '@/components/CountDown';
  import LoginFormTitle from './LoginFormTitle.vue';
  import { useI18n } from '@/hooks/web/useI18n';
  import { useLoginState, useFormRules, useFormValid, LoginStateEnum } from './useLogin';
  import { tenantList } from '@/api/auth';
  import { sendSmsCode } from '@/api/auth/captcha';
  import { TenantResp } from '@/api/auth/model';
  import Icon from '@/components/Icon/Icon.vue';
  import { useMessage } from '@/hooks/web/useMessage';
  import { useUserStore } from '@/store/modules/user';

  const FormItem = Form.Item;
  const SelectOption = Select.Option;
  const { t } = useI18n();
  const { handleBackLogin, getLoginState, setLoginState } = useLoginState();
  const { getFormRules } = useFormRules();

  const formRef = ref();
  const loading = ref(false);

  // 默认租户ID 未启用租户也是这个
  const defaultTenantId = '000000';
  const formData = reactive({
    mobile: '15888888888',
    sms: '',
    tenantId: defaultTenantId,
  });

  const { validForm, validate } = useFormValid(formRef);

  const getShow = computed(() => unref(getLoginState) === LoginStateEnum.MOBILE);
  /** 使用watch替代mounted mounted当前页和账号密码登录页会加载两次租户框 这里使用懒加载 */
  watch(getShow, async (show) => {
    // 不在当前页
    if (!show) return;
    // tenant选择框已经加载了
    if (tenant.loadSuccess) return;
    // 只会在打开验证码页面登陆一次
    await tenantSelectInit();
  });

  // 租户信息
  const tenant = reactive<TenantResp & { loadSuccess: boolean }>({
    tenantEnabled: false,
    voList: [],
    loadSuccess: false,
  });

  async function tenantSelectInit() {
    try {
      const ret = await tenantList();
      // 启用租户的话默认选择第一项
      const { tenantEnabled, voList } = ret;
      if (tenantEnabled) {
        const currentTenantId = voList.length ? voList[0].tenantId : defaultTenantId;
        formData.tenantId = currentTenantId;
      }
      Object.assign(tenant, ret);
      // 设置为租户加载成功
      tenant.loadSuccess = true;
    } catch (e) {
      console.error('租户选择异常');
      tenant.loadSuccess = false;
    }
  }

  const userStore = useUserStore();
  const { createMessage, notification } = useMessage();
  /** 是否已经发送过短信 */
  const sentSms = ref<boolean>(false);
  async function sendCodeApi(): Promise<boolean> {
    try {
      // 发送前先验证手机号
      await validate.value('mobile');
      // 发送
      await sendSmsCode(formData.mobile);
      createMessage.success('发送短信验证码成功');
      sentSms.value = true;
      return true;
    } catch (e) {
      return false;
    }
  }

  async function handleLogin() {
    const data = await validForm();
    if (!data) return;
    try {
      loading.value = true;
      const requestParam: any = {
        phonenumber: data.mobile,
        smsCode: data.sms,
        grantType: 'sms',
      };
      // 租户启用需要添加参数
      if (tenant.tenantEnabled) {
        requestParam.tenantId = formData.tenantId;
      } else {
        // 没有启用租户的话添加默认租户
        requestParam.tenantId = defaultTenantId;
      }
      const userInfo = await userStore.login({
        ...requestParam,
        mode: 'none', //不要默认的错误提示
      });
      if (userInfo) {
        notification.success({
          message: t('sys.login.loginSuccessTitle'),
          description: `${t('sys.login.loginSuccessDesc')}: ${userInfo.nickName}`,
          duration: 3,
        });
      }
      /**
       * 返回账号密码登录页
       *
       * 这里不设置会有奇奇怪怪的问题😅
       * 比如退出登录后会跳转到当前页(手机号登录) 但是租户框加载不出来
       * */
      setLoginState(LoginStateEnum.LOGIN);
    } catch (error) {
      const content = (error as unknown as Error).message || t('sys.api.networkExceptionMsg');
      createMessage.error(content);
    } finally {
      loading.value = false;
    }
  }
</script>
