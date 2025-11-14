<script setup lang="ts">
import CirclePlusIcon from '@/assets/images/icons/circle-plus.svg';
</script>

<template>
  <button class="new-space-button">
    <span class="new-space-button__inner">
      <CirclePlusIcon class="new-space-button__icon" width="20" height="20" />
      New Space
    </span>
  </button>
</template>

<style lang="scss" scoped>
@use '../assets/styles/usables/variables/colors';
@use '../assets/styles/usables/variables/sizes';
@use '../assets/styles/usables/functions' as fn;

.new-space-button {
  background: colors.$brandBlack;
  border-radius: sizes.$borderRadiusPrimary;
  border: none;
  color: colors.$whitePrimary;
  cursor: pointer;
  font-weight: bold;
  padding: 9px 6px;
  text-align: center;
  width: 100%;

  &:hover &__inner {
    opacity: 1;
  }

  &__inner {
    align-items: flex-start;
    display: flex;
    justify-content: center;
    opacity: 0.6;
    transition: opacity 0.2s ease-in-out;
  }

  &__icon {
    margin-right: 5px;
    position: relative;
    top: 1px;
  }
}
</style>
