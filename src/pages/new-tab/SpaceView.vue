<script setup lang="ts">
import { useRoute } from 'vue-router';
const route = useRoute();

import { useHorizontalMouseOverScroll } from '@/composables/useHorizontalMouseOverScroll.ts';
import { onMounted, onUpdated } from 'vue';
import WindowItem from '@/components/WindowItem.vue';
import type { Nullable } from '@/types.ts';

const { initiate } = useHorizontalMouseOverScroll();

const initiateScroller = () => {
  const scrollPanelElement: Nullable<HTMLElement> = document.querySelector(
    '.windows-list__panel .p-scrollpanel-content',
  );
  if (scrollPanelElement === null) {
    throw new Error('ToDo - element not found');
  }
  initiate(scrollPanelElement);
};

onMounted(() => {
  console.log('onMounted');
  initiateScroller();
});

onUpdated(() => {
  console.log('onUpdated');
  initiateScroller();
});
</script>

<template>
  <section class="windows-list">
    <div class="windows-list__layout-parent">
      <div class="windows-list__layout-child">
        <ScrollPanel class="windows-list__panel">
          <div class="windows-list__panel-inner">
            <!-- ToDo - get all user windows and use v-for -->
            <WindowItem color="red">{{ route.params.slug }}</WindowItem>
            <WindowItem color="blue">b</WindowItem>
            <WindowItem color="red">c</WindowItem>
            <WindowItem color="blue">d</WindowItem>
            <WindowItem color="red">e</WindowItem>
            <WindowItem color="blue">f</WindowItem>
            <WindowItem color="red">g</WindowItem>
          </div>
        </ScrollPanel>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use '../../assets/styles/usables/mixins/grid';
@use '../../assets/styles/usables/variables/sizes';
@use '../../assets/styles/usables/variables/colors';

.windows-list {
  display: flex;
  flex-wrap: wrap;
  flex: 1;
  padding: sizes.$halfGutter;

  &__layout-parent {
    max-width: 100%;
  }

  &__layout-child {
    height: 100%;
  }

  &__panel {
    width: 100%;
    height: 100%;

    &-inner {
      display: flex;
    }
  }
}

:deep(.windows-list__panel) {
  .p-scrollpanel {
    &-bar {
      background-color: colors.$lightTertiary;
      opacity: 1; // ensure always shows
    }

    &-content {
      display: flex;
      flex-direction: column;
    }
  }
}
</style>
