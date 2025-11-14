<script setup lang="ts">
import { nextTick, onUpdated, reactive, ref, useTemplateRef } from 'vue';
import type { Space } from '@/types.ts';
import { useRoute } from 'vue-router';
import { Sortable } from 'sortablejs-vue3';
import type { SortableEvent, SortableOptions } from 'sortablejs';
import { assertSpace } from '@/assertions.ts';

const route = useRoute();
interface Props {
  spaces: Space[];
}

const { spaces } = defineProps<Props>();

const sortableJsOptions: SortableOptions = reactive({
  animation: 200,
  group: 'spaces',
  ghostClass: 'spaces-list__item--ghost',
  draggable: '.spaces-list__item--draggable',
});

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

const validateSpace = (value: unknown): Space => {
  assertSpace(value);
  return value;
};

const onSortableUpdate = ($event: SortableEvent) => {
  const space = validateSpace(spaces[$event.oldIndex as number]);

  emit('itemRepositioned', {
    slug: space.slug,
    newPosition: ($event.newIndex as number) + 1,
  });
};

onUpdated(async () => {
  await nextTick();
  spaceNameInput.value?.focus();
});

const emit = defineEmits(['newSpaceNamed', 'makerDiscarded', 'itemRepositioned']);
</script>

<template>
  <ul class="spaces-list">
    <li class="spaces-list__item spaces-list__item--title">Spaces</li>
    <li>
      <Sortable
        tag="ul"
        :list="spaces"
        item-key="id"
        :options="sortableJsOptions"
        @update="onSortableUpdate"
      >
        <template #item="{ element: space }">
          <li
            :class="[
              'spaces-list__item',
              {
                'spaces-list__item--active': route.params.slug === space.slug,
                'spaces-list__item--draggable': !!space.draggable,
              },
            ]"
          >
            <RouterLink
              class="spaces-list__link"
              :to="{ name: 'space', params: { slug: space.slug } }"
            >
              <input
                v-if="space.composing"
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
        </template>
      </Sortable>
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
      color: colors.$textLightSecondary;
      text-transform: uppercase;
    }

    &--ghost a {
      box-shadow: inset 0 0 0 2px colors.$brandPink;
      opacity: 0.5;
    }
  }

  &__link {
    background: colors.$whitePrimary;
    border-radius: sizes.$borderRadiusPrimary;
    box-shadow: 0 0 18px 0 rgba(colors.$blackPrimary, 0.06);
    color: colors.$textDarkPrimary;
    display: block;
    padding: 14px sizes.$halfGutter;
    text-decoration: none;
    transition: background-color 0.2s ease-in-out;

    @at-root #{$block}__item--active & {
      background: rgba(colors.$brandPink, 0.6);
      box-shadow: inset 0 0 20px 9px rgba(colors.$brandPink, 0.19);
      color: colors.$whitePrimary;
      font-weight: bold;
    }
  }

  &__input {
    background: colors.$lightQuaternary;
    border-radius: 6px;
    border: 1px solid colors.$lightPrimary;
    width: 100%;

    &:focus-visible {
      outline: 1px dashed colors.$brandBlue;
    }
  }
}
</style>
