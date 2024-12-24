<script setup lang="ts">
import ListOfItems from './components/List/ListOfItems.vue'
import type { Project } from './types/Project'
import ModalCursor from './components/ModalCursor.vue'
import Playlist from './components/Playlist.vue'
import { reactive, ref, provide, onMounted } from 'vue'
import brandLogo from './assets/images/brand-logo.svg'
import { Carousel, Slide } from 'vue3-carousel'
import 'vue3-carousel/dist/carousel.css'
import gsap from 'gsap'

const modalCursor = ref<typeof ModalCursor>()
const menuDrawer = ref(null)

const projects: Project[] = [
  {
    title: 'music',
    src: 'music.png',
    color: '#000000'
  },
  {
    title: 'film scores',
    src: 'films.png',
    color: '#8C8C8C'
  },
  {
    title: 'live performances',
    src: 'live-performances.png',
    color: '#000000'
  },
  {
    title: 'about',
    src: 'about.png',
    color: '#706D63'
  }
]

const handleMouseEnter = (index: number) => {
  modalState.index = index
  modalCursor.value?.animateIn()
}

const handleMouseLeave = () => {
  modalCursor.value?.animateOut()
}

const modalState = reactive({
  active: false,
  index: 0
})

const isMenuOpen = ref(false)

// Initialize GSAP timeline
const menuTimeline = gsap.timeline({ paused: true })

onMounted(() => {
  // Set initial states
  gsap.set(menuDrawer.value, {
    yPercent: -100
  })

  gsap.set('.menu-item', {
    opacity: 0,
    x: -32
  })

  // Create menu animation timeline
  menuTimeline
    .to(menuDrawer.value, {
      yPercent: 0,
      duration: 0.7,
      ease: 'power3.inOut'
    })
    .to('.menu-item', {
      opacity: 1,
      x: 0,
      duration: 0.5,
      stagger: 0.1,
      ease: 'power3.out'
    }, '-=0.3')

  // Force play all videos for iOS
  const videos = document.querySelectorAll('video')
  videos.forEach(video => {
    video.play().catch(function(error) {
      console.log("Video play failed:", error)
    })
  })
})

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value

  if (isMenuOpen.value) {
    menuTimeline.play()
  } else {
    menuTimeline.reverse()
  }
}

const carouselRef = ref()

const handlePrev = () => {
  carouselRef.value?.prev()
}

const handleNext = () => {
  carouselRef.value?.next()
}

const goToSlide = (slideIndex: number) => {
  carouselRef.value?.slideTo(slideIndex)
}

provide('goToSlide', goToSlide)
</script>

<template>
  <div>
    <nav class="fixed top-0 w-full py-6 flex justify-between items-center z-50 px-[14px] font-kormelink bg-white">
      <router-link to="/">
        <img :src="brandLogo" :width="120" alt="Logo" class="opacity-90" />
      </router-link>
      <button class="uppercase text-[20px] font-medium hover:opacity-70 transition-opacity" @click="toggleMenu">
        {{ isMenuOpen ? 'Close' : 'Menu' }}
      </button>
    </nav>
    <main class="w-screen mt-[100px]">
      <div ref="menuDrawer" class="fixed inset-0 z-40 bg-white mt-[94px]">
        <nav class="menu-nav p-8 md:p-14">
          <router-link v-for="(project, index) in projects" :key="project.title"
            :to="'/' + project.title.toLowerCase().replace(' ', '-')"
            class="menu-item block text-3xl md:text-4xl lg:text-5xl mb-6 md:mb-8 font-kormelink hover:opacity-70 transition-opacity uppercase relative border-b-[1px] pt-4 pb-4 opacity-0 -translate-x-8"
            @mouseenter="() => window.innerWidth >= 768 && handleMouseEnter(index)" 
            @mouseleave="() => window.innerWidth >= 768 && handleMouseLeave" 
            @click="toggleMenu">
            <div class="flex items-center">
              <!-- <span class="text-sm md:text-sm opacity-50 w-[60px]">(0{{ index + 1 }})</span> -->
              <h2 class="flex-1">{{ project.title }}</h2>
            </div>
          </router-link>
        </nav>
        <div class="hidden md:block">
          <ModalCursor ref="modalCursor" :projects="projects" :modalState="modalState" />
        </div>
      </div>

      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.menu-nav {
  font-weight: 300;
}
</style>
