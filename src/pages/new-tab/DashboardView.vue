<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';

const { token } = storeToRefs(useAuthStore());
const { login, logout } = useAuthStore();

const onClickLogin = async () => {
  // ToDo - temporary, just getting up and going
  await login({
    email: 'test@example.com',
    password: 'password',
  });

  console.log('here');
};
const onClickGoGet = async () => {
  debugger;
};
const onClickLogout = async () => {
  try {
    await logout();
    location.reload();
  } catch (error: unknown) {
    console.log(error);
  }
};
</script>

<template>
  <article>
    <p><button @click="onClickLogin">Log in</button></p>
    <p><button :disabled="!token" @click="onClickGoGet">Go get!</button></p>
    <p><button :disabled="!token" @click="onClickLogout">Log out</button></p>
  </article>
</template>

<style lang="scss" scoped>
//
</style>
