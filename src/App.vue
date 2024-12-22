<script setup lang="ts">
import ListOfItems from './components/List/ListOfItems.vue'
import type { Project } from './types/Project'
import ModalCursor from './components/ModalCursor.vue'
import Playlist from './components/Playlist.vue'
import { reactive, ref, provide, onMounted } from 'vue'
import brandLogo from './assets/images/brand-logo2.svg'
import { Carousel, Slide } from 'vue3-carousel'
import 'vue3-carousel/dist/carousel.css'
import gsap from 'gsap'

const modalCursor = ref<typeof ModalCursor>()

const projects: Project[] = [
  {
    title: 'music',
    src: 'music.png',
    color: '#000000'
  },
  {
    title: 'films',
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

const carouselRef = ref()

const handlePrev = () => {
  carouselRef.value?.prev()
  console.log('Previous button clicked')
}

const handleNext = () => {
  carouselRef.value?.next()
  console.log('Next button clicked')
}

const goToSlide = (slideIndex: number) => {
  carouselRef.value?.slideTo(slideIndex)
}

provide('goToSlide', goToSlide)

const isMenuOpen = ref(false)

const menuDrawer = ref(null)

// Initialize GSAP by setting initial state
onMounted(() => {
  gsap.set(menuDrawer.value, {
    yPercent: -100
  })

  // Force play all videos for iOS
  const videos = document.querySelectorAll('video')
  videos.forEach(video => {
    video.play().catch(function (error) {
      console.log("Video play failed:", error)
    })
  })
})

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value

  if (isMenuOpen.value) {
    // Animate menu in
    gsap.to(menuDrawer.value, {
      yPercent: 0,
      duration: 0.7,
      ease: 'power3.inOut'
    })
  } else {
    // Animate menu out
    gsap.to(menuDrawer.value, {
      yPercent: -100,
      duration: 0.7,
      ease: 'power3.inOut'
    })
  }
}

</script>

<template>
  <div>
    <nav class="fixed top-0 w-full py-6 flex justify-between items-center z-50 px-[14px] font-kormelink bg-white">
      <img :src="brandLogo" :width="120" alt="Logo" class="opacity-90" />
      <button class="uppercase text-[20px] font-medium hover:opacity-70 transition-opacity" @click="toggleMenu">
        {{ isMenuOpen ? 'Close' : 'Menu' }}
      </button>
    </nav>
    <main class="w-screen mt-[100px]">
      <div ref="menuDrawer" class="fixed inset-0 z-40 bg-white mt-[94px]">
        <nav class="menu-nav p-8 md:p-14">
          <router-link v-for="(project, index) in projects" :key="project.title"
            :to="'/' + project.title.toLowerCase().replace(' ', '-')"
            class="block text-3xl md:text-4xl lg:text-5xl mb-6 md:mb-8 font-kormelink hover:opacity-70 transition-opacity uppercase relative border-b-[1px] pt-4 pb-4"
            @mouseenter="() => handleMouseEnter(index)" @mouseleave="handleMouseLeave" @click="toggleMenu">
            <div class="flex items-center">
              <span class="text-sm md:text-sm opacity-50 w-[60px]">(0{{ index + 1 }})</span>
              <h2 class="flex-1">{{ project.title }}</h2>
            </div>
          </router-link>
        </nav>
        <ModalCursor ref="modalCursor" :projects="projects" :modalState="modalState" />
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
