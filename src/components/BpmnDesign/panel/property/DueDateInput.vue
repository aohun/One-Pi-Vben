<template>
  <InputNumber v-bind="$attrs" :min="1" v-model:value="currentNumber" @change="handleOnChange()">
    <template #addonAfter>
      <RadioGroup v-model:value="currentSelect" button-style="solid" @change="handleOnChange()">
        <RadioButton v-for="item in options" :key="item.value" :value="item.value">{{
          item.label
        }}</RadioButton>
      </RadioGroup>
    </template>
  </InputNumber>
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { InputNumber, RadioButton, RadioGroup } from 'ant-design-vue';

  export default defineComponent({
    name: 'DueDateInput',
    components: {
      InputNumber,
      RadioButton,
      RadioGroup,
    },
    props: {
      value: {
        type: String,
        required: true,
      },
    },
    emits: ['change'],
    setup(props, { emit }) {
      function initNumber(): string | number | undefined {
        /** 提取数字 */
        const regex = /\d+/;
        const match = props.value.match(regex);

        if (match) {
          return Number(match[0]);
        }
        return undefined;
      }

      function initType() {
        if (props.value) {
          if (props.value.endsWith('H')) {
            return 'PT{v}H';
          }
          if (props.value.endsWith('D')) {
            return 'P{v}D';
          }
          if (props.value.endsWith('W')) {
            return 'P{v}W';
          }
          if (props.value.endsWith('M')) {
            return 'P{v}M';
          }
        }
        return 'PT{v}H';
      }

      const options = [
        { label: '小时', value: 'PT{v}H' },
        { label: '天', value: 'P{v}D' },
        { label: '周', value: 'P{v}W' },
        { label: '月', value: 'P{v}M' },
      ];

      const currentSelect = ref(initType());
      const currentNumber = ref(initNumber());

      /**
       * 因为已经v-model 这里通用
       */
      function handleOnChange() {
        const number = currentNumber.value;
        const type = currentSelect.value;
        /** 这里是为了兼容Input */
        const e = {
          target: {
            value: '',
          },
        };
        // 是否填写了数字
        if (number) {
          const valueWithType = type.replace('{v}', String(number));
          e.target.value = valueWithType;
        }
        console.log(e);
        emit('change', e);
      }

      return {
        options,
        currentSelect,
        currentNumber,
        handleOnChange,
      };
    },
  });
</script>

<style lang="less" scoped>
  :deep(.ant-input-number-group-addon) {
    padding: 0;
    border: none;
  }
</style>
