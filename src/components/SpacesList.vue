<script setup lang="ts">
import { nextTick, onUpdated, ref, useTemplateRef } from 'vue';
import type { SpaceArray } from '@/types.ts';
import { useRoute } from 'vue-router';

const route = useRoute();
interface Props {
  spaces: SpaceArray;
}

defineProps<Props>();

const spaceNameInput = useTemplateRef('spaceNameInput');
const suppressBlurEvent = ref(false);

const onSpaceNameInputKeyupEsc = () => {
  suppressBlurEvent.value = true;
  emit('makerDiscarded');
};

const onSpaceNameInputBlur = ($event: FocusEvent) => {
  if (suppressBlurEvent.value) {
    suppressBlurEvent.value = false;
    return;
  }
  emit('newSpaceNamed', $event);
};

onUpdated(async () => {
  await nextTick();
  spaceNameInput.value?.[0]?.focus();
});

const emit = defineEmits(['newSpaceNamed', 'makerDiscarded']);
</script>

<template>
  <ul class="spaces-list">
    <li class="spaces-list__item spaces-list__item--title">Spaces</li>
    <li
      :class="[
        'spaces-list__item',
        { 'spaces-list__item--active': 'slug' in space && route.params.slug === space.slug },
      ]"
      v-for="space in spaces"
      :key="space.id"
    >
      <RouterLink
        class="spaces-list__link"
        :to="{ name: 'space', params: { slug: 'slug' in space ? space.slug : '#' } }"
      >
        <input
          v-if="'editable' in space && space.editable"
          class="spaces-list__input"
          ref="spaceNameInput"
          v-model="space.name"
          type="text"
          name="new-space-field"
          @keyup.enter="($event.currentTarget as HTMLInputElement).blur()"
          @keyup.esc="onSpaceNameInputKeyupEsc"
          @blur="onSpaceNameInputBlur"
        />
        <template v-else>{{ space.name }}</template>
      </RouterLink>
    </li>
  </ul>
</template>

<style lang="scss" scoped>
@use '../assets/styles/usables/mixins/grid';
@use '../assets/styles/usables/variables/colors';
@use '../assets/styles/usables/variables/sizes';
@use '../assets/styles/usables/functions' as fn;

.spaces-list {
  $block: &;
  margin-bottom: sizes.$fullGutter;

  &__item {
    margin-bottom: sizes.$halfGutter;

    &:last-child {
      margin-bottom: 0;
    }

    &--title {
      text-transform: uppercase;
      color: colors.$textLightSecondary;
    }
  }

  &__link {
    display: block;
    padding: fn.pxToRem(14px) sizes.$halfGutter;
    text-decoration: none;
    color: colors.$textDarkPrimary;
    background: colors.$whitePrimary;
    box-shadow: 0 0 fn.pxToRem(18px) 0 rgba(colors.$blackPrimary, 0.06);
    border-radius: sizes.$borderRadiusPrimary;
    transition: background-color 0.2s ease-in-out;

    @at-root #{$block}__item--active & {
      background: rgba(colors.$brandPink, 0.6);
      box-shadow: inset 0 0 fn.pxToRem(20px) fn.pxToRem(9px) rgba(colors.$brandPink, 0.19);
      color: colors.$whitePrimary;
      font-weight: bold;
    }
  }

  &__input {
    width: 100%;
    border: 1px solid colors.$lightPrimary;
    background: colors.$lightQuaternary;
    border-radius: fn.pxToRem(6px);

    &:focus-visible {
      outline: 1px dashed colors.$brandBlue;
    }
  }
}
</style>
