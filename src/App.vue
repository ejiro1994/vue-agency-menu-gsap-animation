<script setup lang="ts">
import ListOfItems from './components/List/ListOfItems.vue'
import type { Project } from './types/Project'
import ModalCursor from './components/ModalCursor.vue'
import Playlist from './components/Playlist.vue'
import { reactive, ref, provide, onMounted, computed } from 'vue'
import brandLogo from './assets/images/brand-logo.svg'
import iconLogo from './assets/images/logo-icon.svg'
import { Carousel, Slide } from 'vue3-carousel'
import 'vue3-carousel/dist/carousel.css'
import gsap from 'gsap'
import { useRoute } from 'vue-router'
import MediaCarousel from '@/components/MediaCarousel.vue'
import ShaderComponent from './components/ShaderComponent.vue'
// import menuImage from '@/assets/images/menu-image.png'

// Create a reactive global events object
const globalEvents = reactive({
  splashScreenComplete: false
})

// Provide the global events object to child components
provide('globalEvents', globalEvents)

const modalCursor = ref<typeof ModalCursor>()
const menuDrawer = ref(null)
const logoRef = ref(null)
const splashScreen = ref(null)
const splashContent = ref(null)
const loaderLine = ref(null)
const menuVideo = ref<HTMLVideoElement | null>(null)

const projects: Project[] = [
  {
    title: 'music',
    src: 'music.png',
    color: '#FFFFFF'
  },
  {
    title: 'film scores',
    src: 'films.png',
    color: '#F5F5F5'
  },
  {
    title: 'live performances',
    src: 'live-performances.png',
    color: '#FFFFFF'
  },
  {
    title: 'about',
    src: 'about.png',
    color: '#F5F5F5'
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
const menuVideoTimeline = gsap.timeline({ paused: true })

const route = useRoute()
const carouselRef = ref<InstanceType<typeof MediaCarousel> | null>(null)

// Show carousel only on routes that need it
const showCarousel = computed(() => {
  return ['/music', '/film-scores', '/live-performances'].includes(route.path)
})

onMounted(() => {
  // Create splash screen animation timeline
  const splashTimeline = gsap.timeline({
    onComplete: () => {
      // Remove splash screen from DOM after animation
      if (splashScreen.value) {
        (splashScreen.value as HTMLElement).style.display = 'none'
        // Signal that splash screen animation is complete
        globalEvents.splashScreenComplete = true
      }
    }
  })

  // Animate splash content first
  splashTimeline
    .from(splashContent.value, {
      opacity: 0,
      // scale: 0.9,
      duration: 0.8,
      ease: 'power3.out'
    })
    .to(loaderLine.value, {
      strokeDashoffset: 0,
      duration: 1.5,
      ease: 'power2.inOut'
    }, '-=0.4')
    .to([splashContent.value, loaderLine.value], {
      opacity: 0,
      // scale: 1.1,
      duration: 0.5,
      ease: 'power3.in'
    }, '+=0.2')
    .to(splashScreen.value, {
      yPercent: -100,
      duration: 0.8,
      ease: 'power3.inOut'
    }, '-=0.3')

  // After splash screen animation, animate the main logo
  splashTimeline.add(() => {
    gsap.to(logoRef.value, {
      opacity: 0.9,
      duration: 0.5,
      ease: 'power2.out'
    })
  })

  // Set initial states for menu
  gsap.set(menuDrawer.value, {
    yPercent: -100
  })

  gsap.set(logoRef.value, {
    opacity: 0,
    y: 20
  })

  gsap.set('.menu-item', {
    opacity: 0,
    x: -32
  })

  gsap.set('.menu-video', {
    opacity: 1,
    clipPath: 'inset(0 100% 0 0)',
  })

  // Animate logo
  gsap.to(logoRef.value, {
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: 'power3.out',
    delay: 0.2
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

  // Create separate timeline for video
  menuVideoTimeline
    .to('.menu-video', {
      clipPath: 'inset(0 0% 0 0)',
      duration: 1.2,
      delay: 0.5,
      ease: 'power2.inOut'
    })

  // Force play all videos for iOS
  const videos = document.querySelectorAll('video')
  videos.forEach(video => {
    video.play().catch(function (error) {
      console.log("Video play failed:", error)
    })
  })

  // Add specific handling for menu video
  if (menuVideo.value) {
    menuVideo.value.play().catch(error => {
      console.log("Menu video play failed:", error)
    })
  }
})

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value

  if (isMenuOpen.value) {
    menuTimeline.play()
    menuVideoTimeline.timeScale(1).play()
  } else {
    menuTimeline.reverse()
    menuVideoTimeline.timeScale(3).reverse() // 3x faster on reverse
  }
}


const goToSlide = (slideIndex: number) => {
  carouselRef.value?.slideTo(slideIndex)
}

provide('goToSlide', goToSlide)

const handleLogoClick = () => {
  // Close menu if it's open
  if (isMenuOpen.value) {
    isMenuOpen.value = false
    menuTimeline.reverse()
    menuVideoTimeline.timeScale(3).reverse() // 3x faster on reverse

  }

  // Scroll to top
  gsap.to(window, {
    scrollTo: { y: 0 },
    duration: 2,
    delay: 1,
    ease: 'power4.inOut'
  })
}

const handleEmailClick = () => {
  window.location.href = 'mailto:lennox.akpoduado@gmail.com?subject=Project Collaboration Inquiry'
}
</script>

<template>
  <div>
    <!-- Splash Screen -->
    <div ref="splashScreen" class="fixed inset-0 z-[60] bg-white flex flex-col items-center justify-center">
      <div ref="splashContent" class="text-center mb-8 flex flex-col items-center">
        <h1 class="text-l mb-4 font-kormelink mt-10">Film Scores, Albums<br>and <span
            class="fancy-text text-2xl tracking-wide">L</span>ive Performances</h1>
        <!-- <img :src="brandLogo" :width="70" alt="Logo" class=" mt-[150px] mb-4" /> -->
        <img :src="iconLogo" :width="15" alt="Logo" class=" mb-[150px] mt-2" />
      </div>
      <svg class="w-[40%] h-2" viewBox="0 0 100 2" preserveAspectRatio="none">
        <line ref="loaderLine" x1="0" y1="1" x2="100" y2="1" stroke="#000" opacity="0.7" stroke-width="0.2"
          stroke-dasharray="100" stroke-dashoffset="100" />
      </svg>
    </div>

    <nav class="nav-container">
      <div class="nav-content">
        <!-- <button @click="handleEmailClick"
          class="hidden lg:block text-xl font-kormelink px-4 py-2 hover:bg-black hover:text-white transition-colors duration-300 uppercase border-b-[1px] border-b-black/50">
          inquire
        </button> -->
        <div class="logo-container">
          <router-link to="/" @click="handleLogoClick">
            <div ref="logoRef">
              <img :src="brandLogo" :width="120" alt="Logo" class="opacity-90 2xl:w-[130px]" />
            </div>
          </router-link>
        </div>
        <div class="invisible lg:visible"><!-- Spacer for desktop layout --></div>
        <button class="menu-button" @click="toggleMenu">
          {{ isMenuOpen ? 'Close' : 'Menu' }}
        </button>
      </div>
    </nav>
    <main class="w-screen mt-[100px]">
      <div ref="menuDrawer" class="fixed inset-0 z-40 bg-white mt-[94px]">
        <nav class="menu-nav p-8 md:p-14">
          <router-link v-for="(project, index) in projects" :key="project.title"
            :to="'/' + project.title.toLowerCase().replace(' ', '-')"
            class="menu-item block text-3xl md:text-4xl lg:text-5xl mb-6 md:mb-8 font-kormelink transition-opacity uppercase relative border-b-[1px] pt-4 pb-4 opacity-0 -translate-x-8"
            @mouseenter="() => handleMouseEnter(index)" @mouseleave="() => handleMouseLeave" @click="toggleMenu">
            <div class="flex items-center group">
              <h2 class="flex-1 group-hover:translate-x-6 group-hover:opacity-60 transition duration-300">
                {{ project.title }}
              </h2>
            </div>
          </router-link>

          <!-- Mobile Contact Button -->
          <button 
            @click="handleEmailClick"
            class="menu-item lg:hidden block text-3xl font-kormelink uppercase   px-6 pt-4 pb-3 border border-black/30 textblack-white transition-colors duration-300 mt-10 hover:bg-black hover:text-white"
          >
          inquire
          </button>

          <!-- Menu Video -->
          <div
            class="menu-video w-[200px] h-[100px] md:w-[300px] md:h-[150px] md:mt-[50px] overflow-hidden bg-black/5 mt-10">
            <video ref="menuVideo" autoplay loop muted playsinline class="w-full h-full object-cover opacity-80">
              <source src="/videos/duality.mov" type="video/mp4" />
              <source src="/videos/duality.mov" type="video/quicktime" />
              Your browser does not support the video tag.
            </video>
          </div>
        </nav>
        <div class="hidden md:block">
          <ModalCursor ref="modalCursor" :projects="projects" :modalState="modalState" :isMenuOpen="isMenuOpen" />
        </div>
      </div>

      <MediaCarousel v-show="showCarousel" ref="carouselRef" class="mt-[150px]" />

      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <div class="menu-image-container">
      <!-- <img :src="menuImage" alt="Menu Image" class="w-24" /> -->
    </div>

  </div>
</template>

<style scoped>
.fade-enter-active {
  transition-delay: 2s;
  transition: opacity 0.5s ease;

}


.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.menu-nav {
  font-weight: 300;
}

.text-center {
  text-align: center;
}

.mb-4 {
  margin-bottom: 1rem;
}

.mb-8 {
  margin-bottom: 2rem;
}

.fancy-text {
  font-style: italic;
  font-feature-settings: "swsh" 1, "cswh" 1, "salt" 1, "dlig" 1;
  -webkit-font-feature-settings: "swsh" 1, "cswh" 1, "salt" 1, "dlig" 1;
  -moz-font-feature-settings: "swsh" 1, "cswh" 1, "salt" 1, "dlig" 1;
}

.nav-container {
  @apply fixed top-0 w-full py-6 px-[14px] z-50 bg-white;
}

.nav-content {
  @apply flex justify-between items-center font-kormelink;
  @apply lg:container lg:mx-auto lg:max-w-7xl lg:relative;
}

.logo-container {
  @apply lg:absolute lg:left-1/2 lg:-translate-x-1/2;
}

.menu-button {
  @apply uppercase text-[20px] font-medium hover:opacity-70 transition-opacity;
}
</style>
