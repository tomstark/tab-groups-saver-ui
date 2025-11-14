<script setup lang="ts">
import type { TabGroup } from '@/types.ts';
import { TabGroupColor } from '@/utilities/enums.ts';
import ExternalLinkIcon from '@/assets/images/icons/external-link.svg';
import XIcon from '@/assets/images/icons/x.svg';

interface Props {
  tabGroup: TabGroup;
}

defineProps<Props>();
</script>

<template>
  <li class="tab-group">
    <ul class="tab-group__inner">
      <li class="tab-group__item">
        <p
          class="tab-group__name"
          :style="{
            '--tab-group-color': TabGroupColor[tabGroup.color ?? 'grey'],
          }"
        >
          <span>{{ tabGroup.name }}</span>
        </p>
        <span class="tab-group__icons">
          <ExternalLinkIcon class="tab-group__icon" />
          <XIcon class="tab-group__icon tab-group__icon--x" />
        </span>
      </li>
      <slot></slot>
    </ul>
  </li>
</template>

<style lang="scss" scoped>
@use '../assets/styles/usables/variables/colors';
@use '../assets/styles/usables/variables/sizes';

.tab-group {
  background: colors.$whitePrimary;
  border-radius: 8px;
  flex: 1;
  padding: sizes.$halfGutter;

  &__item {
    display: flex;
  }

  &__name {
    flex: 1;

    span {
      background: var(--tab-group-color);
      border-radius: 5px;
      color: white;
      display: inline-flex;
      font-weight: bold;
      line-height: 1.2;
      padding: 3px 8px;
    }
  }

  &__icons {
    display: flex;
    gap: 5px;
    margin-left: 10px;
  }

  &__icon {
    height: 14px;
    width: 14px;
    opacity: 0.25;
    transition: opacity 0.2s ease-in-out;

    &:hover {
      opacity: 1;
      cursor: pointer;
    }

    &--x {
      height: 15px;
      width: 15px;
    }
  }
}
</style>
