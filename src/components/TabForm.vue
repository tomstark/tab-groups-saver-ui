<script setup lang="ts">
import type { Tab } from '@/types.ts';

interface Props {
  tab: Tab;
}

defineProps<Props>();
</script>

<template>
  <pre>{{ tab }}</pre>
</template>

<style lang="scss" scoped></style>
