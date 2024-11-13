<template>
  <div ref="mapRef" class="w-full h-180"></div>
</template>

<script setup lang="ts">
  import { useECharts } from '@/hooks/web/useECharts';
  import type { EChartsOption } from 'echarts';
  // import * as echarts from 'echarts';
  import { ref, onMounted } from 'vue';
  import * as chinaMap from '../china.json';
  import { visitList, type Temp } from '../api';

  defineOptions({ name: 'VisitMap' });

  const mapRef = ref<HTMLDivElement>();
  const { setOptions, echarts } = useECharts(mapRef as any);

  function transformData(data: Temp[]) {
    const nameList: string[] = chinaMap.features.map((item) => item.properties.name);
    const dataNameList: string[] = data.map((item) => item.name);
    // 差集
    const diff = nameList.filter((item) => !dataNameList.includes(item) && item.trim() !== '');
    diff.forEach((name) => {
      data.push({
        name,
        value: 0,
      });
    });
  }

  onMounted(async () => {
    echarts.registerMap('china', chinaMap as any);
    const data = await visitList();
    transformData(data);
    const max = Math.max.apply(
      null,
      data.map((item) => item.value),
    );
    const options: EChartsOption = {
      title: {
        text: '用户访问量数据',
        left: 'right',
      },
      tooltip: {
        trigger: 'item',
        showDelay: 0,
        transitionDuration: 0.2,
        formatter: '{b}<br/>{c}',
      },
      visualMap: {
        left: 'left',
        min: 0,
        max,
        inRange: {
          color: ['#ffffff', '#00FF66', '#00CCFF', '#CC6600'],
        },
        text: ['最高', '最低'],
        calculable: true,
      },
      toolbox: {
        show: true,
        //orient: 'vertical',
        left: 'left',
        top: 'top',
        feature: {
          dataView: { readOnly: true },
          saveAsImage: {},
        },
      },
      series: [
        {
          type: 'map',
          roam: true,
          zoom: 1.5,
          // 由于缩放  这里加上偏移
          top: 200,
          map: 'china',
          label: {
            show: true,
            position: 'inside',
            // formatter: '{b}\n{c}',
            formatter: '{c}',
          },
          emphasis: {
            label: {
              show: true,
            },
          },
          data,
        },
      ],
    };
    setOptions(options);
  });
</script>

<style scoped></style>
