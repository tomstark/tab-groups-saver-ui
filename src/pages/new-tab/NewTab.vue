<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';
import SideBar from '@/components/SideBar.vue';
import CircularLoader from '@/assets/images/circular-loader.svg';

const { loading, errors } = storeToRefs(useAuthStore());
const { syncAuthUser } = useAuthStore();

onMounted(async () => {
  await syncAuthUser();
});
</script>

<template>
  <transition name="fade">
    <div v-if="loading" key="loader" class="loader">
      <CircularLoader width="150" height="150" />
    </div>
    <div v-else key="content" class="global-content">
      <SideBar />
      <main>
        <header class="global-content__header">
          <pre class="temporary">{{ errors }}</pre>
        </header>
        <router-view />
      </main>
    </div>
  </transition>
</template>

<style lang="scss">
@use '../../assets/styles/global';
</style>

<style lang="scss" scoped>
@use '../../assets/styles/usables/mixins/grid';
@use '../../assets/styles/usables/variables/colors';
@use '../../assets/styles/usables/variables/sizes';
@use '../../assets/styles/usables/placeholders' as *;

.loader {
  @extend %absolute-full;
  @extend %flex-centered-content;
  background: colors.$lightPrimary;
}

.global-content {
  display: flex;
  flex-wrap: wrap;
  min-height: 100vh;

  &__header {
    padding: sizes.$halfGutter;
  }
}

.temporary {
  background: rgba(colors.$whitePrimary, 0.7);
}

main {
  background: colors.$lightPrimary;
  flex-grow: 1;
  padding: sizes.$halfGutter;
  width: 100%;

  @include grid.gridMediaMinWidth((sm)) {
    width: calc(100% - #{sizes.$sidebarWidth});
  }
}
</style>
