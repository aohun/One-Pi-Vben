<template>
  <IFrame :frameSrc="url" />
</template>

<script setup lang="ts">
  import IFrame from '@/layouts/components/iframe/index.vue';
  import { ref } from 'vue';

  defineOptions({ name: 'Snailjob' });

  const url = ref<string>('http://localhost:8800/snail-job');
</script>

<style scoped></style>
