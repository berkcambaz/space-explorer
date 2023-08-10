import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "/home",
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('../views/Home.vue'),
    },
    {
      path: '/picture-of-the-day',
      name: 'picture-of-the-day',
      component: () => import('../views/PictureOfTheDay.vue'),
    },
    {
      path: '/you-on-earth',
      name: 'you-on-earth',
      component: () => import('../views/YouOnEarth.vue'),
    },
    {
      path: '/earth-enhanced',
      name: 'earth-enhanced',
      component: () => import('../views/EarthEnhanced.vue'),
    },
    {
      path: '/profile/:id',
      name: 'profile',
      component: () => import('../views/Profile.vue'),
    },
    {
      path: '/:path(.*)',
      name: 'not-found',
      component: () => import('../views/NotFound.vue'),
    },
  ]
})

export default router
