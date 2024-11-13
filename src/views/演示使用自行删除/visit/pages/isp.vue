<template>
  <div ref="ispRef" class="w-full h-180"></div>
</template>

<script setup lang="ts">
  import { useECharts } from '@/hooks/web/useECharts';
  import type { EChartsOption } from 'echarts';
  // import * as echarts from 'echarts';
  import { ref, onMounted } from 'vue';
  import { ispInfoList } from '../api';

  defineOptions({ name: 'Isp' });

  const ispRef = ref<HTMLDivElement>();
  const { setOptions } = useECharts(ispRef as any);

  onMounted(async () => {
    const data = await ispInfoList();
    const options: EChartsOption = {
      title: {
        text: '网络运营商占比',
        left: 'center',
      },
      tooltip: {
        trigger: 'item',
      },
      legend: {
        orient: 'vertical',
        left: 'left',
      },
      series: [
        {
          type: 'pie',
          radius: '50%',
          data,
          //百分比
          label: {
            show: true,
            formatter: '{b}: {c} - ({d}%)', //自定义显示格式(b:name, c:value, d:百分比)
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    };
    setOptions(options);
  });
</script>

<style scoped></style>
