<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import XIcon from '@/assets/images/icons/x.svg';
import { EVENT_KEYDOWN, KEY_ESCAPE } from '@/utilities/constants.ts';

interface Props {
  strictXClose?: boolean; // only close the modal if click the 'X' icon
}

const { strictXClose = false } = defineProps<Props>();

const show = ref(false);
const position = ref(false);
const isClosing = ref(false);

const scrollBarDisplayManager = (show: boolean) => {
  if (show) {
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
    return;
  }

  // hide
  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
  document.body.style.paddingRight = `${scrollbarWidth}px`;
  document.body.style.overflow = 'hidden';
};

const openModal = () => {
  setTimeout(() => {
    show.value = true;
  }, 1);

  setTimeout(() => {
    position.value = true;
  }, 200);

  scrollBarDisplayManager(false);
};

const emit = defineEmits(['close']);

const closeModal = () => {
  isClosing.value = true;

  setTimeout(() => {
    emit('close');

    scrollBarDisplayManager(true);
  }, 300);
};
openModal();

const closeHandler = (_: PointerEvent | KeyboardEvent, isX = false) => {
  if (!isX && strictXClose) {
    return;
  }

  closeModal();
};

function handleKeydown(event: KeyboardEvent) {
  if (event.key === KEY_ESCAPE) {
    closeHandler(event, false);
  }
}

onMounted(() => {
  window.addEventListener(EVENT_KEYDOWN, handleKeydown);
  console.log('onMounted');
});

onUnmounted(() => {
  window.removeEventListener(EVENT_KEYDOWN, handleKeydown);
  console.log('onUnmounted');
});

const modalVerticalSpace = 110;
const buffer = 20;
const scrollPanelHeight = window.innerHeight - modalVerticalSpace * 2 - buffer;
</script>

<template>
  <Teleport to="#modal">
    <transition name="fade">
      <div
        v-if="show"
        class="modal"
        :style="{ '--modal-vertical-space': `${modalVerticalSpace}px` }"
      >
        <div class="modal__inner" @click.self="closeHandler">
          <div
            :class="[
              'modal__body',
              { 'modal__body--positioned': position, 'modal__body--closing': isClosing },
            ]"
            role="dialog"
            aria-modal="true"
          >
            <XIcon
              class="modal__close-icon"
              @click="($event: PointerEvent) => closeHandler($event, true)"
            />
            <ScrollPanel :style="`width: 100%; max-height: ${scrollPanelHeight}px`">
              <slot />
            </ScrollPanel>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<style lang="scss" scoped>
@use '../assets/styles/usables/mixins/grid';
@use '../assets/styles/usables/placeholders' as *;
@use '../assets/styles/usables/variables/colors';
@use '../assets/styles/usables/variables/sizes';

.modal {
  $fromTopPositionOpen: var(--modal-vertical-space);
  $fromTopPositionClosed: 110px;
  @extend %absolute-full;
  position: fixed;
  z-index: 2;
  background: rgba(#000, 0.5);

  &__inner {
    display: flex;
    align-items: start;
    justify-content: center;
    min-height: 100vh;
  }

  &__body {
    background: white;
    border-radius: 10px;
    max-height: calc(100vh - ($fromTopPositionOpen * 2));
    max-width: calc(100% - 32px);
    min-height: 100px;
    min-width: auto;
    opacity: 0;
    padding: 10px;
    position: relative;
    top: $fromTopPositionClosed;
    transition:
      opacity 0.3s ease-out,
      top 0.3s ease-out;
    @include grid.gridMediaMinWidth((sm)) {
      max-width: none;
      min-width: 500px;
    }

    &--positioned {
      opacity: 1;
      top: 100px;
    }

    &--closing {
      opacity: 0;
      top: $fromTopPositionClosed;
    }
  }

  &__close-icon {
    position: absolute;
    top: 16px;
    right: 16px;
    width: 25px;
    height: 25px;
    cursor: pointer;
    opacity: 0.7;
    transition: opacity 0.2s ease-in-out;
    z-index: 3;

    &:hover {
      opacity: 1;
    }
  }
}

:deep(.modal__body) {
  .p-scrollpanel > .p-scrollpanel-bar {
    background-color: colors.$lightTertiary;
    opacity: 1; // ensure always shows
    right: 10px;
  }
}
</style>
