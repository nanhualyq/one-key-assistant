import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('pages/IndexPage.vue')
  },
  {
    path: '/gemini',
    component: () => import('pages/GeminiPage.vue')
  },
  {
    path: '/tts',
    component: () => import('pages/TtsPage.vue')
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
