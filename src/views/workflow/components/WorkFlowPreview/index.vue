<template>
  <div class="flex flex-col gap-16px mt-16px" v-if="props.businessKey">
    <CollapseContainer title="审批记录">
      <Timeline v-if="historyRecordList.length" class="pt-8px px-16px">
        <TimelineItem v-for="item in historyRecordList" :key="item.id" color="blue">
          <div class="flex flex-row mb-3">
            <!-- 节点名称 -->
            <span class="font-bold">{{ item.name }}</span>
          </div>
          <div class="flex flex-row justify-between">
            <div id="left" class="flex gap-2 items-center">
              <Avatar :size="40" style="background-color: #fde3cf; color: #f56a00">{{
                nameFormat(item.nickName)
              }}</Avatar>
              <div class="flex flex-col gap-5px">
                <span>{{ item.nickName }}</span>
                <div>
                  <Tag :color="transformColor(item)?.color">{{ item.statusName }}</Tag>
                </div>
              </div>
            </div>
            <div id="right">
              <div class="text-gray-500" v-if="item.endTime">完成: {{ item.endTime }}</div>
              <div class="text-gray-500" v-if="item.runDuration">耗时: {{ item.runDuration }}</div>
            </div>
          </div>
          <!-- 评论 -->
          <div class="py-5px" v-if="item.comment">
            <Alert :message="item.comment" type="info" />
          </div>
          <!-- 附件 contentId为oss下载id  -->
          <div v-if="item.attachmentList" class="flex flex-row items-center">
            <div>附件: </div>
            <a-button
              type="link"
              v-for="file in item.attachmentList"
              :key="file.id"
              @click="handleDownload(file)"
              >{{ file.name }}</a-button
            >
          </div>
          <!-- 底部留一点间距 -->
          <div class="mb-2"></div>
        </TimelineItem>
      </Timeline>
      <Skeleton active v-show="loading" />
    </CollapseContainer>

    <CollapseContainer title="流程图">
      <!-- v-show会有bug -->
      <Skeleton active v-if="loading" />
      <BpmnViewer v-if="!loading" :businessKey="props.businessKey" />
    </CollapseContainer>
  </div>
</template>

<script setup lang="ts">
  // 审批记录 页面
  import { getHistoryRecord } from '@/api/workflow/processInstance';
  import type { HistoryRecord } from '@/api/workflow/processInstance/model';
  import { onMounted, ref } from 'vue';
  import { Timeline, TimelineItem, Avatar, Alert, Tag, Skeleton } from 'ant-design-vue';
  import { downloadByData } from '@/utils/file/download';
  import { ossDownload } from '@/api/system/oss';
  import { useLoading } from '@/components/Loading';
  import { nodeStatusOptions } from '@/views/workflow/common';
  import { BpmnViewer } from '@/components/BpmnViewer';
  import { CollapseContainer } from '@/components/Container';

  const props = defineProps({
    /** 表的id */
    businessKey: {
      type: String,
      required: true,
    },
  });

  const loading = ref<boolean>(true);

  /** 时间轴data */
  const historyRecordList = ref<HistoryRecord[]>([]);
  onMounted(async () => {
    const list = await getHistoryRecord(props.businessKey);
    historyRecordList.value = list;

    loading.value = false;
  });

  function transformColor(record: HistoryRecord) {
    return nodeStatusOptions.find((item) => item.value === record.status);
  }

  function nameFormat(name: string) {
    if (!name) return '';
    if (name.length <= 2) return name;
    // 保留最后两个
    return name.substring(name.length - 2);
  }

  const [openFullLoading, closeFullLoading] = useLoading({
    tip: '下载文件中...',
  });
  async function handleDownload(file: Recordable) {
    try {
      openFullLoading();
      const data = await ossDownload(file.contentId);
      downloadByData(data, file.name);
    } finally {
      closeFullLoading();
    }
  }
</script>

<style scoped></style>
