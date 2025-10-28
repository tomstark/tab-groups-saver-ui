<script setup lang="ts">
import { useRoute } from 'vue-router';
const route = useRoute();
</script>

<template>
  <section class="window-list">
    <!-- ToDo - get all user windows and use v-for -->
    <article class="window">
      <div class="window__inner">
        <p>{{ route.params.slug }}</p>
      </div>
    </article>
  </section>
</template>

<style lang="scss" scoped>
@use '../../assets/styles/usables/mixins/grid';
@use '../../assets/styles/usables/variables/sizes';

.window-list {
  display: flex;
  flex-wrap: wrap;
}

.window {
  display: flex;
  padding: sizes.$halfGutter;
  width: 100%;

  @include grid.gridMediaSizes(sm) {
    width: 50%;
  }

  @include grid.gridMediaSizes(md) {
    width: 33%;
  }

  @include grid.gridMediaSizes(lg) {
    width: 25%;
  }

  &__inner {
    flex-grow: 1;
    background: green;
  }
}
</style>
