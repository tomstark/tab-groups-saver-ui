import { createApp, markRaw } from 'vue';
import NewTab from './NewTab.vue';
import { createPinia } from 'pinia';
import router from '../../router/index.js';
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura'; // ToDo - Use? How big

const pinia = createPinia();
pinia.use(({ store }) => {
  store.router = markRaw(router);
});

const app = createApp(NewTab);

app.use(pinia);
app.use(router);
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      prefix: 'p',
      darkModeSelector: 'system',
      cssLayer: false,
    },
  },
});

app.mount('#app');
