import { createRouter, createWebHashHistory } from 'vue-router';
import DashboardView from '@/pages/new-tab/DashboardView.vue';
import SpaceWindows from '@/pages/new-tab/SpaceWindows.vue';

const routes = [
  {
    path: '',
    name: 'dashboard',
    component: DashboardView,
  },
  {
    path: '/space/:slug',
    name: 'space',
    component: SpaceWindows,
  },
];

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
});

// router.beforeEach(async (to, from) => {
//   console.log('from', from);
//   console.log('to', to);
// });

export default router;
