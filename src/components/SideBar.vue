<script setup lang="ts">
import Logo from '@/assets/images/logo.svg';
import { computed, type ComputedRef, onMounted, type Ref, ref } from 'vue';
import SpacesList from '@/components/SpacesList.vue';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/stores/auth.ts';
import { useSpacesStore } from '@/stores/spaces.ts';
import type { Nullable, Space } from '@/types.ts';
import router from '@/router';
import CircularLoader from '@/assets/images/circular-loader.svg';
import NewSpaceButton from '@/components/NewSpaceButton.vue';

const { user } = storeToRefs(useAuthStore());
const {
  spaces,
  userSpaces,
  newSpaceName,
  isLoading: spacesLoading,
} = storeToRefs(useSpacesStore());
const {
  loadUserSpaces,
  createNewSpace,
  updateSpacePosition,
  startLoading: startSpacesLoading,
  stopLoading: stopSpacesLoading,
} = useSpacesStore();

const maker: Ref<Nullable<Space>> = ref(null);
const resolvedSpaces: ComputedRef<Space[]> = computed(() => {
  if (maker.value !== null) {
    return [...spaces.value, maker.value];
  }
  return spaces.value;
});

const createMaker = () => {
  if (maker.value !== null) {
    // ToDo
    return;
  }
  maker.value = {
    id: 'space-maker',
    slug: '#',
    name: newSpaceName.value,
    composing: true,
    draggable: false,
    position: 0,
  };
};

const destroyMaker = () => (maker.value = null);

const onClickNewSpaceButton = () => {
  createMaker();
};

const onMakerDiscarded = () => {
  destroyMaker();
};

const onNewSpaceNamed = async (event: KeyboardEvent) => {
  const target = event.currentTarget as HTMLInputElement;

  try {
    destroyMaker();
    const newSpace = await createNewSpace(target.value);
    await router.push({ name: 'space', params: { slug: newSpace.slug } });
  } catch (error: unknown) {
    // ToDo
    console.log(error);
    // createMaker();
  }
};

const onItemRepositioned = async ({ slug, newPosition }: { slug: string; newPosition: number }) => {
  const nonUserSpacesCount = resolvedSpaces.value.length - userSpaces.value.length;
  const userSpacePosition = newPosition - nonUserSpacesCount;

  try {
    startSpacesLoading();
    await updateSpacePosition(slug, userSpacePosition);
    await loadUserSpaces();
  } catch (error: unknown) {
    // ToDo
    console.log(error);
  } finally {
    stopSpacesLoading();
  }
};

onMounted(async () => {
  if (user.value) {
    await loadUserSpaces();
  }
});
</script>

<template>
  <aside class="sidebar sidebar--left">
    <Logo class="logo" @click="router.push({ name: 'dashboard' })" />

    <transition name="fade">
      <div v-if="spacesLoading" class="loader"><CircularLoader width="50" height="50" /></div>
    </transition>

    <SpacesList
      :spaces="resolvedSpaces"
      @new-space-named="onNewSpaceNamed"
      @maker-discarded="onMakerDiscarded"
      @item-repositioned="onItemRepositioned"
    />

    <div v-if="!!user" class="sidebar__box">
      <NewSpaceButton @click="onClickNewSpaceButton" />
    </div>
  </aside>
</template>

<style lang="scss" scoped>
@use '../assets/styles/usables/mixins/grid';
@use '../assets/styles/usables/variables/colors';
@use '../assets/styles/usables/variables/sizes';
@use '../assets/styles/usables/placeholders' as *;

.sidebar {
  background: colors.$lightQuaternary;
  display: flex;
  flex-direction: column;
  padding: sizes.$fullGutter;
  position: relative;
  width: 100%; // ToDo - mobile when ready (mixed with JS)

  @include grid.gridMediaMinWidth((md)) {
    min-height: 100%;
    width: sizes.$sidebarWidth;
  }

  &__box {
    border-top: 1px solid colors.$lightTertiary;
    margin-top: auto;
    padding-top: sizes.$fullGutter;
  }
}

.logo {
  margin-bottom: sizes.$fullGutter;
  cursor: pointer;
}

.loader {
  @extend %absolute-full;
  @extend %flex-centered-content;
  background: linear-gradient(
    0deg,
    colors.$whitePrimary 0%,
    colors.$whitePrimary 80%,
    rgba(colors.$whitePrimary, 0) 100%
  );
}
</style>
