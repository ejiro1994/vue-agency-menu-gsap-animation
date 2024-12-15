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
    title: 'scorebook',
    src: 'scorebook.png',
    color: '#706D63'
  },
  {
    title: 'about',
    src: 'about.png',
    color: '#706D63'
  }
]

const handleMouseEnter = () => {
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
        <ListOfItems @itemIndex="(e) => (modalState.index = e)" :projects="projects" @mouseenter="handleMouseEnter"
          @mouseleave="handleMouseLeave" :modalState="modalState" />
        <ModalCursor ref="modalCursor" :projects="projects" :modalState="modalState" />
      </div>

      <Carousel ref="carouselRef" :perPage="1" :navigationEnabled="false" class="w-screen">
        <Slide>
          <div class="w-screen h-[383px] relative" style="background-color: #000000;">
            <video 
              src="/videos/higher.mov" 
              class="w-full h-full object-cover" 
              autoplay 
              muted 
              loop 
              playsinline
            ></video>
            <div class="absolute inset-0  mix-blend-hue"></div>
          </div>
        </Slide>
        <Slide>
          <div class="w-screen h-[383px] relative" style="background-color: #000000;">
            <video 
              src="/videos/duality.mov" 
              class="w-full h-full object-cover" 
              autoplay 
              muted 
              loop 
              playsinline
              playbackRate="0.5"
            ></video>
            <div class="absolute inset-0  mix-blend-hue"></div>
          </div>
        </Slide>
        <Slide>
          <div class="w-screen h-[383px] relative" style="background-color: #000000;">
            <video 
              src="/videos/unknownt.mov" 
              class="w-full h-full object-cover" 
              autoplay 
              muted 
              loop 
              playsinline
            ></video>
            <div class="absolute inset-0 mix-blend-hue"></div>
          </div>
        </Slide>
        <Slide>
          <div class="w-screen h-[383px]" style="background-color: #000000;">
            <img src="/images/carousel/2.png" alt="Project Image 2" class="w-full h-full object-cover" />
          </div>
        </Slide>
        <Slide>
          <div class="w-screen h-[383px]" style="background-color: #000000;">
            <img src="/images/carousel/3.png" alt="Project Image 3" class="w-full h-full object-cover" />
          </div>
        </Slide>
        <Slide>
          <div class="w-screen h-[383px]" style="background-color: #000000;">
            <img src="/images/carousel/4.png" alt="Project Image 4" class="w-full h-full object-cover" />
          </div>
        </Slide>
        <Slide>
          <div class="w-screen h-[383px]" style="background-color: #000000;">
            <img src="/images/carousel/5.png" alt="Project Image 5" class="w-full h-full object-cover" />
          </div>
        </Slide>
      </Carousel>
      <Playlist class="mb-8" />
    </main>
  </div>
</template>

<style scoped>
/* Remove the previous transition classes as they're no longer needed */
</style>
