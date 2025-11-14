<script setup lang="ts">
import { useRoute } from 'vue-router';
import { useHorizontalMouseOverScroll } from '@/composables/useHorizontalMouseOverScroll.ts';
import { computed, type ComputedRef, onUpdated, reactive, ref, type Ref, watch } from 'vue';
import type { Nullable, WindowI } from '@/types.ts';
import { storeToRefs } from 'pinia';
import { useWindowsStore } from '@/stores/windows.ts';
import CircularLoader from '@/assets/images/circular-loader.svg';
import { useSpacesStore } from '@/stores/spaces.ts';
import TabGroup from '@/components/TabGroup.vue';
import TabItem from '@/components/TabItem.vue';
import { Sortable } from 'sortablejs-vue3';
import type { SortableOptions } from 'sortablejs';
import { windowResizeEventController } from '@/utilities/helpers/windowResizeEventController.ts';
import WindowItem from '@/components/WindowItem.vue';

const route = useRoute();
const { userSpaces } = storeToRefs(useSpacesStore());
const { isLoading: windowsLoading, windows } = storeToRefs(useWindowsStore());
const { loadWindows } = useWindowsStore();
const { initiate } = useHorizontalMouseOverScroll();
const { createResizeController } = windowResizeEventController();
const spaceId: Ref<Nullable<string>> = ref(null);

const spaceWindows: ComputedRef<WindowI[]> = computed(() => {
  if (spaceId.value === null) {
    return [];
  }
  return windows.value[spaceId.value] ?? [];
});
// const allSpaceTabGroups = computed(() => spaceWindows.value.flatMap((window) => window.tabGroups));
// const allSpaceTabs = computed(() => allSpaceTabGroups.value.flatMap((tabGroup) => tabGroup.tabs));

const initiateScroller = () => {
  const scrollPanelElement: Nullable<HTMLElement> = document.querySelector(
    '.windows-list__panel .p-scrollpanel-content',
  );
  if (scrollPanelElement === null) {
    throw new Error('ToDo - element not found');
  }
  initiate(scrollPanelElement);
};

const setSpaceId = () => {
  spaceId.value = userSpaces.value.find((space) => space.slug === route.params.slug)?.id ?? null;
};

const windowResizeScrollerController = createResizeController(() => {
  try {
    initiateScroller();
  } catch {
    // ToDo - Okay with swallowing the error here, but possibly log (dev only? look at later)
  }
}, 400);

const initiateSpaceWindows = async () => {
  windowResizeScrollerController.stop(); // initial reset
  setSpaceId();

  if (spaceId.value) {
    await loadWindows(spaceId.value);
  }

  initiateScroller();
  windowResizeScrollerController.start();
};

watch(userSpaces, async () => {
  // Essentially the onMounted in this instance
  // (onMounted beat the hydration of userSpaces.value which was undesirable)
  await initiateSpaceWindows();
});

onUpdated(async () => {
  await initiateSpaceWindows();
});

const tabGroupsSortableJsOptions: SortableOptions = reactive({
  animation: 200,
  group: 'tab-groups',
  // ghostClass: 'spaces-list__item--ghost',
  // draggable: '.spaces-list__item--draggable',
});
const tabsSortableJsOptions: SortableOptions = reactive({
  animation: 200,
  group: 'tabs',
  // ghostClass: 'spaces-list__item--ghost',
  // draggable: '.spaces-list__item--draggable',
});
</script>

<template>
  <section class="windows-list">
    <transition name="fade">
      <div v-if="windowsLoading" class="loader"><CircularLoader width="50" height="50" /></div>
    </transition>

    <div class="windows-list__layout-parent">
      <div class="windows-list__layout-child">
        <ScrollPanel class="windows-list__panel">
          <div class="windows-list__panel-inner">
            <WindowItem
              v-for="windowItem in spaceWindows"
              :key="windowItem.id"
              :window-item="windowItem"
            >
              <Sortable
                class="windows-list__windows"
                tag="ul"
                :list="windowItem.tabGroups"
                item-key="id"
                :options="tabGroupsSortableJsOptions"
              >
                <!-- ToDo @update="onTabGroupsSortableUpdate"-->
                <template #item="{ element: tabGroup }">
                  <TabGroup :tab-group="tabGroup">
                    <Sortable
                      tag="ul"
                      :list="tabGroup.tabs"
                      item-key="id"
                      :options="tabsSortableJsOptions"
                    >
                      <!-- ToDo @update="onTabsSortableUpdate"-->
                      <template #item="{ element: tab }">
                        <TabItem :tab="tab" />
                      </template>
                    </Sortable>
                  </TabGroup>
                </template>
              </Sortable>
            </WindowItem>
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
@use '../../assets/styles/usables/placeholders' as *;

.loader {
  @extend %absolute-full;
  @extend %flex-centered-content;
  background: colors.$lightPrimary;
  margin: sizes.$halfGutter;
}

.windows-list {
  display: flex;
  flex-wrap: wrap;
  flex: 1;
  padding: sizes.$halfGutter;
  position: relative;

  &__layout-parent {
    max-width: 100%;
  }

  &__layout-child {
    height: 100%;
  }

  &__panel {
    height: 100%;
    width: 100%;

    &-inner {
      display: flex;
      gap: 32px;
      height: 100%;

      &:after {
        background: transparent;
        content: '';
        flex: 1;
        margin-left: -12px;
        max-width: 1px;
        min-width: 1px;
        position: relative;
      }
    }
  }

  &__windows {
    display: flex;
    flex-direction: column;
    gap: sizes.$halfGutter;
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
