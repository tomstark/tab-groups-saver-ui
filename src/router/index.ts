import { createRouter, createWebHashHistory } from 'vue-router';
import DashboardView from '@/pages/new-tab/DashboardView.vue';
import SpaceView from '@/pages/new-tab/SpaceView.vue';

const routes = [
  {
    path: '',
    name: 'dashboard',
    component: DashboardView,
  },
  {
    path: '/space/:slug',
    name: 'space',
    component: SpaceView,
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
