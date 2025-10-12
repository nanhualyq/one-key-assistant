import SettingsLayout from 'src/layouts/SettingsLayout.vue';
import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/settings/action'
  },
  {
    path: '/settings',
    component: SettingsLayout,
    children: [
      {
        path: 'action',
        component: () => import('pages/settings/ActionSetting.vue')
      },
      {
        path: 'dict',
        component: () => import('pages/settings/DictSetting.vue')
      },
      {
        path: 'gemini',
        component: () => import('pages/settings/GeminiSetting.vue')
      },
      {
        path: 'tts',
        component: () => import('pages/settings/TtsSetting.vue')
      }
    ]
  },
  {
    path: '/dict',
    component: () => import('pages/DictPage.vue')
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
