<script setup lang="ts">
import ExternalLinkIcon from '@/assets/images/icons/external-link.svg';
import type { WindowI } from '@/types.ts';

interface Props {
  windowItem: WindowI;
}

defineProps<Props>();
</script>

<template>
  <article class="window">
    <div class="window__inner">
      <header class="window__header">
        <h3 class="window__name">
          {{ windowItem.name }}
        </h3>
        <span class="window__icons">
          <ExternalLinkIcon class="window__icon" />
        </span>
      </header>
      <slot></slot>
    </div>
  </article>
</template>

<style lang="scss" scoped>
@use '../assets/styles/usables/variables/colors';
@use '../assets/styles/usables/variables/sizes';

.window {
  background: rgba(colors.$whitePrimary, 0.4);
  border-radius: 10px;
  box-shadow: inset 0 0 90px 0 rgba(colors.$whitePrimary, 0.5);
  flex: 1;
  height: calc(100% - 19px);
  min-width: 500px;

  &__inner {
    padding: sizes.$halfGutter;
    display: flex;
    flex-direction: column;
  }

  &__header {
    display: flex;
    border-bottom: 3px solid colors.$lightPrimary;
    margin-bottom: 14px;
    padding-bottom: 2px;
  }

  &__name {
    color: #888;
    flex: 1;
    font-size: 18px;
    font-weight: bold;
    position: relative;
    top: -5px;
  }

  // ToDo
  // &__icons {
  // }

  &__icon {
    position: relative;
    top: -1px;
    width: 16px;
    height: 16px;
    opacity: 0.25;
    transition: opacity 0.2s ease-in-out;

    &:hover {
      opacity: 0.4;
      cursor: pointer;
    }
  }
}
</style>
