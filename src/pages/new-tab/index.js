import { createApp, markRaw } from 'vue';
import NewTab from './NewTab.vue';
import { createPinia } from 'pinia';
import router from '../../router/index.js';

const pinia = createPinia();
pinia.use(({ store }) => {
  store.router = markRaw(router);
});

const app = createApp(NewTab);

app.use(pinia);
app.use(router);

app.mount('#app');
