<script setup lang="ts">
interface Props {
  color: string;
}

defineProps<Props>();
</script>

<template>
  <article class="window" :style="`background: ${color}; opacity: 0.1;`">
    <!-- ToDo - adapt props / this markup, just using to lay things out initially -->
    <slot></slot>
  </article>
</template>

<style lang="scss" scoped>
.window {
  flex: 1;
  height: calc(100% - 19px);
  min-width: 700px;
}
</style>
