import { createRouter, createWebHistory } from 'vue-router'
import MusicPage from '../views/MusicPage.vue'
import FilmsPage from '../views/FilmsPage.vue'
import LivePerformancesPage from '../views/LivePerformancesPage.vue'
import ScorebookPage from '../views/ScorebookPage.vue'
import AboutPage from '../views/AboutPage.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/music'
    },
    {
      path: '/music',
      name: 'Music',
      component: MusicPage
    },
    {
      path: '/film-scores',
      name: 'Films',
      component: FilmsPage
    },
    {
      path: '/live-performances',
      name: 'Live Performances',
      component: LivePerformancesPage
    },
    {
      path: '/scorebook',
      name: 'Scorebook',
      component: ScorebookPage
    },
    {
      path: '/about',
      name: 'About',
      component: AboutPage
    }
  ]
})

export default router