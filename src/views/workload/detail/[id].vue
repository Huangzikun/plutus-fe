<script setup lang="ts">
import { useRoute } from 'vue-router';

const route = useRoute();
const workloadId = route.params.id;
</script>

<template>
  <div class="h-full flex-col">
    <div class="mb-16px text-20px font-medium">工作量详情</div>
    <div class="text-16px text-gray-600">工作量ID: {{ workloadId }}</div>
  </div>
</template>

<style scoped></style>
