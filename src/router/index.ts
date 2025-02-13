import { createRouter, createWebHistory } from 'vue-router'
import MusicPage from '../views/MusicPage.vue'
import FilmsPage from '../views/FilmsPage.vue'
import LivePerformancesPage from '../views/LivePerformancesPage.vue'
import ScorebookPage from '../views/ScorebookPage.vue'
import AboutPage from '../views/AboutPage.vue'
import WeddingsPage from '../views/WeddingsPage.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
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
    },
    {
      path: '/weddings',
      name: 'Weddings',
      component: WeddingsPage
    }
  ]
})

export default router
