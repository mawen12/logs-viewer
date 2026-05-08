import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/layout/AppLayout.vue'),
      children: [
        {
          path: '/',
          name: 'home',
          component: () => import('@/pages/home/Home.vue'),
        }
      ]
    }
  ],
})

export default router
