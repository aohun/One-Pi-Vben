<template>
  <PageWrapper>
    <div class="flex flex-col gap-16px">
      <CollapseContainer title="点赞/fork记录(折线图)" :can-expand="false">
        <div ref="chartRef" class="h-500px"></div>
      </CollapseContainer>
      <CollapseContainer title="点赞/fork记录(环形图)" :can-expand="false">
        <div ref="roundRef" class="h-500px"></div>
      </CollapseContainer>
    </div>
  </PageWrapper>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import { giteeRecord, type GiteeResponse } from './api';
  import { CollapseContainer } from '@/components/Container';
  import { useECharts } from '@/hooks/web/useECharts';
  import { EChartsOption } from 'echarts';
  import { PageWrapper } from '@/components/Page';

  const chartRef = ref<HTMLDivElement | null>(null);
  const { setOptions: setChartOptions } = useECharts(chartRef as any);
  function loadChart(resp: GiteeResponse) {
    const chartOption: EChartsOption = {
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: ['Fork', '点赞'],
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: resp.starList.map((item) => item.date),
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          name: 'Fork',
          type: 'line',
          data: resp.forkList.map((item) => item.count),
        },
        {
          name: '点赞',
          type: 'line',
          data: resp.starList.map((item) => item.count),
        },
      ],
    };

    setChartOptions(chartOption);
  }

  const roundRef = ref<HTMLDivElement | null>(null);
  const { setOptions: setRoundOptions } = useECharts(roundRef as any);
  function loadRound(resp: GiteeResponse) {
    const totalStar = resp.starList.reduce((acc, cur) => acc + cur.count, 0);
    const totalFork = resp.forkList.reduce((acc, cur) => acc + cur.count, 0);

    const roundOption: EChartsOption = {
      tooltip: {
        trigger: 'item',
      },
      legend: {
        orient: 'vertical',
        left: 'left',
      },
      series: [
        {
          name: '点赞/Fork',
          type: 'pie',
          radius: '50%',
          data: [
            { value: totalStar, name: '点赞' },
            { value: totalFork, name: 'Fork' },
          ],
          label: {
            align: 'center',
            formatter: '{b}: {c} ({d}%)',
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

    setRoundOptions(roundOption);
  }

  onMounted(async () => {
    const resp = await giteeRecord();
    console.log(resp);

    loadChart(resp);
    loadRound(resp);
  });
</script>
