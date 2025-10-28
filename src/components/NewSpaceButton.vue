<script setup lang="ts">
import PlusIcon from '@/assets/images/plus-icon.svg';
</script>

<template>
  <button class="new-space-button">
    <span class="new-space-button__inner">
      <PlusIcon class="new-space-button__icon" width="20" height="20" />
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
  text-align: center;
  font-weight: bold;
  padding: fn.pxToRem(9px) fn.pxToRem(6px);
  border: none;
  border-radius: sizes.$borderRadiusPrimary;
  color: colors.$whitePrimary;
  cursor: pointer;
  width: 100%;

  &:hover &__inner {
    opacity: 1;
  }

  &__inner {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    transition: opacity 0.2s ease-in-out;
    opacity: 0.6;
  }

  &__icon {
    margin-right: fn.pxToRem(5px);
    top: 1px;
    position: relative;
  }
}
</style>
