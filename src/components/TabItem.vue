<script setup lang="ts">
import type { Nullable, Tab } from '@/types.ts';
import DashedSquareIcon from '@/assets/images/icons/dashed-square.svg';
import XIcon from '@/assets/images/icons/x.svg';
import ModalDialog from '@/components/ModalDialog.vue';
import { ref } from 'vue';
import TabForm from '@/components/TabForm.vue';
import { useConfirm } from 'primevue';

interface Props {
  tab: Tab;
}

defineProps<Props>();

const confirm = useConfirm();

const requireConfirmation = (event: PointerEvent) => {
  const tabInner: Nullable<HTMLElement> =
    (event.currentTarget as HTMLElement | undefined)?.closest('.tab__inner') ?? null;

  if (tabInner === null) {
    throw new Error('.tab__inner not found'); // ToDo - error handling
  }

  confirm.require({
    target: tabInner,
    group: 'delete-tab-confirmation',
    message: 'Are you sure you want to delete this tab?',
    accept: () => {
      console.log('accept');
    },
  });
};

const onClickDashedSquareIcon = () => {
  isEditModalOpen.value = true;
};

// const onClickXIcon = () => {
//   console.log('onClickXIcon');
// };

const isEditModalOpen = ref(false);
</script>

<template>
  <li class="tab">
    <div class="tab__inner">
      <!-- ToDo - if in 'open' space, go to the tab, else open in a new tab -->
      <a
        :href="tab.url"
        :class="['tab__link', { 'tab__link--no-image': !tab.icon }]"
        target="_blank"
      >
        <img v-if="tab.icon" :src="tab.icon" class="tab__image" alt="tab favicon" />
        <p class="tab__title tab__title--truncate">
          {{ tab.title }}
        </p>
      </a>
      <span class="tab__icons">
        <DashedSquareIcon class="tab__icon" @click="onClickDashedSquareIcon" />
        <XIcon class="tab__icon tab__icon--x" @click="requireConfirmation($event)" />
      </span>
    </div>
  </li>

  <ModalDialog v-if="isEditModalOpen" @close="isEditModalOpen = false">
    <TabForm :tab="tab" />
  </ModalDialog>

  <ConfirmPopup
    group="delete-tab-confirmation"
    :pt="{ root: { style: 'padding: 10px;' }, footer: { style: 'padding-top: 10px;' } }"
  >
    <template #container="{ message, acceptCallback }">
      <div>
        <span>{{ message.message }}</span>
        <div>
          <button @click="acceptCallback">Delete</button>
        </div>
      </div>
    </template>
  </ConfirmPopup>
</template>

<style lang="scss" scoped>
@use '../assets/styles/usables/variables/colors';
@use '../assets/styles/usables/placeholders' as *;

.tab {
  $block: &;
  color: grey;
  flex: 1;
  height: 28px;

  &:first-child {
    margin-top: 7px;
  }

  &:last-child {
    margin-bottom: -7px;
  }

  &__inner {
    display: flex;
    align-items: center;
    overflow: hidden;

    &:hover {
      #{$block}__link {
        color: colors.$brandBlue;
        flex-basis: calc(100% - 40px);
      }
    }
  }

  &__link {
    align-items: center;
    display: flex;
    gap: 6px;
    text-decoration: none;
    color: grey;
    transition:
      color 0.2s ease-in-out,
      flex-basis 0.2s ease-in-out,
      width 0.2s ease-in-out;
    flex: 1 0 100%;

    &--no-image {
      &:before {
        content: '';
        height: 16px;
        width: 16px;
        background: #ec439d;
        background: linear-gradient(45deg, rgba(236, 67, 157, 1) 0%, rgba(125, 77, 255, 1) 100%);
        border-radius: 3px;
        opacity: 0.6;
      }
    }
  }

  &__image {
    border-radius: 3px;
    display: block;
    height: 16px;
    width: 16px;
  }

  &__title {
    display: block;
    flex: 1;

    &--truncate {
      @extend %single-line-ellipsis;
    }
  }

  &__icons {
    display: inline-flex;
    gap: 6px;
    min-width: 32px;
    margin-left: 6px;
  }

  &__icon {
    color: colors.$brandBlue;
    width: 16px;
    height: 16px;
    opacity: 0.4;
    cursor: pointer;
    transition: opacity 0.2s ease-in-out;

    &:hover {
      opacity: 1;
    }

    &--x {
      width: 17px;
      height: 17px;
    }
  }
}
</style>
