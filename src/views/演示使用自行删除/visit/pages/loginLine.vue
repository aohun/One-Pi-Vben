<template>
  <div ref="loginLineRef" class="w-full h-180"></div>
</template>

<script setup lang="ts">
  import { useECharts } from '@/hooks/web/useECharts';
  import type { EChartsOption } from 'echarts';
  // import * as echarts from 'echarts';
  import { ref, onMounted } from 'vue';
  import { loginLine } from '../api';

  defineOptions({ name: 'LoginLine' });

  const loginLineRef = ref<HTMLDivElement>();
  const { setOptions } = useECharts(loginLineRef as any);

  onMounted(async () => {
    const data = await loginLine();
    console.log(data);
    const options: EChartsOption = {
      title: {
        text: '近一月登录量统计',
      },
      tooltip: {
        trigger: 'axis',
      },
      legend: {},
      toolbox: {
        show: true,
        feature: {
          dataZoom: {
            yAxisIndex: 'none',
          },
          dataView: { readOnly: true },
          magicType: { type: ['line', 'bar'] },
          saveAsImage: {},
        },
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: data.date,
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          name: '登录成功',
          type: 'line',
          data: data.success,
          lineStyle: {
            color: '#3399CC',
          },
          itemStyle: {
            color: '#3399CC',
          },
        },
        {
          name: '登录失败',
          type: 'line',
          data: data.fail,
          lineStyle: {
            color: '#CC6633',
          },
          itemStyle: {
            color: '#CC6633',
          },
        },
      ],
    };
    setOptions(options);
  });
</script>

<style scoped></style>
