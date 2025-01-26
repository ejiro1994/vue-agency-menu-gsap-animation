<script setup lang="ts">
import ListOfItems from './components/List/ListOfItems.vue'
import type { Project } from './types/Project'
import ModalCursor from './components/ModalCursor.vue'
import Playlist from './components/Playlist.vue'
import { reactive, ref, provide, onMounted, computed, watch, nextTick } from 'vue'
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
const exploreButton = ref(null)

const projects: Project[] = [
  {
    title: 'music',
    src: 'music.png',
    color: '#FFFFFF'
  },
  {
    title: 'weddings',
    src: 'weddings.png',
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
    src: 'about.jpg',
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
const exploreButtonTimeline = gsap.timeline()

const route = useRoute()
const carouselRef = ref<InstanceType<typeof MediaCarousel> | null>(null)

// Show carousel only on routes that need it
const showCarousel = computed(() => {
  return ['/music', '/film-scores', '/live-performances', '/weddings'].includes(route.path)
})

const showPlaylist = computed(() => {
  return route.path !== '/'
})

const showCloseButton = computed(() => {
  return route.path !== '/'
})

// Add new ref for menu button visibility
const showMenuButton = ref(false)

// Modify the watch function for route changes
watch(() => route.path, (newPath) => {
  // Close menu when route changes, but only if it's open
  if (isMenuOpen.value) {
    toggleMenu()
  }

  // Reset menu button visibility
  showMenuButton.value = false

  // Add delay before showing menu button
  if (newPath !== '/') {
    setTimeout(() => {
      showMenuButton.value = true
    }, 1500) // 2 second delay to match your fade transition timing
  }
})

// Add new ref for loading state
const loadingComplete = ref(false)

// Add function to handle explore button click
const handleExplore = () => {
  // First fade out the splash content
  gsap.to([splashContent.value, loaderLine.value], {
    opacity: 0,
    duration: 0.8,
    ease: 'power3.inOut',
    onComplete: () => {


      // After content fades, proceed with the rest
      // Signal that splash screen animation is complete
      globalEvents.splashScreenComplete = true

      // Only open menu if we're on the home page
      if (route.path === '/') {
        toggleMenu()
        // Create a timeline for removing splash screen after menu loads
        const removeSpashTimeline = gsap.timeline()
        removeSpashTimeline
          .to(splashScreen.value, {
            opacity: 0,
            duration: 0.5,
            delay: 0,
            ease: 'power3.inOut',
            onComplete: () => {
              if (splashScreen.value) {
                (splashScreen.value as HTMLElement).style.display = 'none'
              }
            }
          })
      } else {
        // If not on home page, fade out splash screen
        gsap.to(splashScreen.value, {
          opacity: 0,
          duration: 1,
          ease: 'power3.inOut',
          onComplete: () => {
            if (splashScreen.value) {
              (splashScreen.value as HTMLElement).style.display = 'none'
            }
          }
        })
      }
    }
  })
}

onMounted(() => {
  // Create different timelines for home and other pages
  const splashTimeline = gsap.timeline({
    onComplete: () => {
      // If not home page, continue with fade out
      if (route.path !== '/') {
        gsap.to([splashContent.value, loaderLine.value], {
          opacity: 0,
          duration: 0.8,
          ease: 'power3.inOut',
          onComplete: () => {
            globalEvents.splashScreenComplete = true
            // Remove splash screen
            if (splashScreen.value) {
              gsap.to(splashScreen.value, {
                opacity: 0,
                duration: 1,
                ease: 'power3.inOut',
                onComplete: () => {
                  if (splashScreen.value) {
                    (splashScreen.value as HTMLElement).style.display = 'none'
                  }
                }
              })
            }
          }
        })
      } else {
        loadingComplete.value = true
      }
    }
  })

  // Animate splash content first
  splashTimeline
    .from(splashContent.value, {
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out'
    })
    .to(loaderLine.value, {
      strokeDashoffset: 0,
      duration: 0.8,
      ease: 'power2.inOut'
    }, '-=0.4')

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
    // Set muted explicitly
    menuVideo.value.muted = true
    // Try playing immediately
    menuVideo.value.play().catch(error => {
      console.log("Menu video play failed:", error)
      // If initial play fails, try again after user interaction
      document.addEventListener('touchstart', () => {
        menuVideo.value?.play()
      }, { once: true })
    })
  }

  // Create a watcher for loadingComplete
  watch(loadingComplete, (newValue) => {
    if (newValue && route.path === '/') {
      // Wait for next tick to ensure button is in DOM
      nextTick(() => {
        exploreButtonTimeline
          .to(exploreButton.value, {
            backgroundColor: '#8a7b5c',
            color: 'white',
            duration: 0.8,
            ease: 'power2.inOut'
          })
      })
    }
  })
})

// Add this new ref to track the button text independently
const buttonText = ref('Menu')

// Modify the toggleMenu function
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value

  // Update button text immediately when opening
  if (isMenuOpen.value) {
    buttonText.value = 'Close'
    document.body.style.overflow = 'hidden'
    menuTimeline.play()
    menuVideoTimeline.timeScale(1).play()
  } else {
    // Don't change button text immediately when closing
    document.body.style.overflow = ''
    menuTimeline.reverse()
    menuVideoTimeline.timeScale(3).reverse()
    // Only update button text after the animation/transition
    setTimeout(() => {
      buttonText.value = 'Menu'
    }, 500) // Adjust timing to match your fade transition
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
    document.body.style.overflow = ''
    menuTimeline.reverse()
    menuVideoTimeline.timeScale(3).reverse()
    // Update button text after the animation/transition
    setTimeout(() => {
      buttonText.value = 'Menu'
    }, 1100) // Adjust timing to match your fade transition
  }
}


</script>

<template>
  <div>
    <!-- Splash Screen -->
    <div ref="splashScreen" class="fixed inset-0 z-[60] bg-[#EDE9E5] flex flex-col items-center justify-center">
      <div ref="splashContent" class="text-center mb-8 flex flex-col items-center min-h-[200px]">
        <!-- Add separate wrappers for each line of text -->
        <div class="text-mask">
          <h1 class="text-l lg:text-xl mb-2 font-kormelink mt-10 reveal-text">Film Scores, Albums</h1>
        </div>
        <div class="text-mask">
          <h1 class="text-l lg:text-xl mb-2 font-kormelink mt-2 reveal-text">
            and <span class="fancy-text text-2xl lg:text-2xl tracking-wide">L</span>ive Performances
          </h1>
        </div>
        <Transition name="fade">
          <button ref="exploreButton" v-if="loadingComplete && route.path === '/'" @click="handleExplore"
            class="explore-button px-8 pt-4 pb-3 uppercase font-kormelink text-lg border border-[#9B8A50]/30 transition-colors duration-300 absolute mt-[140px] lg:text-xl">
            Explore
          </button>
        </Transition>
      </div>
      <svg class="w-[40%] h-2" viewBox="0 0 100 2" preserveAspectRatio="none">
        <line ref="loaderLine" x1="0" y1="1" x2="100" y2="1" stroke="#000" opacity="0.7" stroke-width="0.2"
          stroke-dasharray="100" stroke-dashoffset="100" />
      </svg>
    </div>

    <nav class="nav-container bg-[#EDE9E5]">
      <div class="nav-content">
   
        <div class="logo-container">
          <router-link to="/music" @click="handleLogoClick">
            <div ref="logoRef">
              <img :src="brandLogo" :width="120" alt="Logo"
                class="opacity-90 2xl:w-[150px] xl:w-[140px] 2xl:mt-4 lg:w-[130px]" />
            </div>
          </router-link>
        </div>
        <div class="invisible lg:visible"><!-- Spacer for desktop layout --></div>
        <Transition name="fade">
          <button v-if="showCloseButton && showMenuButton" class="menu-button" @click="toggleMenu">
            {{ buttonText }}
          </button>
        </Transition>
      </div>
    </nav>
    <main class="w-screen mt-[85px] md:mt-[94px] lg:mt-[100px]">
      <div ref="menuDrawer" class="fixed inset-0 z-40 bg-[#EDE9E5] mt-[78px]">
        <nav class="menu-nav p-8 md:p-14">
          <router-link v-for="(project, index) in projects" :key="project.title"
            :to="'/' + project.title.toLowerCase().replace(' ', '-')"
            class="menu-item block text-3xl md:text-4xl lg:text-5xl xl:text-6xl mb-6 md:mb-8 font-kormelink transition-opacity uppercase relative border-b-[1px] pt-4 pb-4 opacity-0 -translate-x-8"
            @mouseenter="() => handleMouseEnter(index)" @mouseleave="() => handleMouseLeave" @click="toggleMenu">
            <div class="flex items-center group">
              <h2 class="flex-1 group-hover:translate-x-6 group-hover:opacity-60 transition duration-300">
                {{ project.title }}
              </h2>
            </div>
          </router-link>

    

          <!-- Menu Video -->
          <div
            class="menu-video w-[200px] h-[100px] md:w-[300px] md:h-[150px] md:mt-[50px] overflow-hidden bg-black/5 mt-10">
            <video ref="menuVideo" autoplay loop muted playsinline defaultMuted webkit-playsinline preload="auto"
              disablePictureInPicture class="w-full h-full object-cover opacity-80">
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
      <!-- <template v-if="showPlaylist"> -->
      <MediaCarousel v-show="showCarousel" ref="carouselRef" class="mt-0" />
      <!-- <Playlist/> -->
      <!-- </template> -->

      <router-view v-slot="{ Component }" v-if="showPlaylist">
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
.explore-button {
  opacity: 0;
  animation: fadeIn 0.8s ease forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-enter-active {
  transition: all 2s ease;
  transition-delay: 1s;
}

.fade-leave-active {
  transition: all 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  /* transform: translateY(-20px); */
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
  @apply fixed top-0 w-full z-50 bg-[#EDE9E5];
  height: 78px;
  display: flex;
  align-items: center;
  padding: 0 20px;
}

.nav-content {
  @apply flex justify-between items-center w-full font-kormelink;
  @apply lg:container lg:mx-auto lg:max-w-7xl lg:relative;
  height: 100%;
}

.logo-container {
  /* Mobile styles */
  @apply relative left-0 translate-x-0;
  /* Tablet and desktop styles */
  @apply md:absolute md:left-1/2 md:-translate-x-1/2;
}

/* Optional: adjust the invisible spacer to only show on desktop */
.invisible {
  @apply hidden md:block;
}

.menu-button {
  @apply uppercase text-[20px] font-medium hover:opacity-70 flex items-center;
  height: 78px;
  /* Match the nav-container height */
  transition: opacity 0.8s ease, transform 0.3s ease;
}

/* Add styles for the text mask and reveal animation */
.text-mask {
  overflow: hidden;
  display: inline-block;
  margin-bottom: 0;
  /* Remove extra spacing */
}

.reveal-text {
  transform: translateY(100%);
  animation: revealUp 0.8s ease forwards;
  margin: 0;
  /* Remove default margin */
}

@keyframes revealUp {
  to {
    transform: translateY(0);
  }
}
</style>
