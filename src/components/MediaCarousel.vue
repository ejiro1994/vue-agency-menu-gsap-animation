<template>
  <div class="carousel-wrapper">
    <div 
      ref="carouselRef" 
      class="w-full mb-8 overflow-hidden custom-carousel"
      :class="{ 'opacity-0': !allMediaLoaded, 'opacity-100 transition-opacity duration-1000': allMediaLoaded }"
    >
      <div class="carousel-inner" :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
        <div 
          v-for="(slide, index) in slides" 
          :key="slide.src"
          class="carousel-slide"
        >
          <div class="w-full h-[250px] relative bg-black">
            <template v-if="slide.type === 'video'">
              <div :ref="el => setMediaContainer(el as HTMLElement, index)" class="w-full h-full" style="filter: sepia(1) hue-rotate(0deg) saturate(.15);"></div>
            </template>
            <img v-else
              :src="slide.src" 
              :alt="slide.alt" 
              class="w-full h-full object-cover"
              @load="() => handleMediaLoaded(index)"
            />
          </div>
        </div>
      </div>
      
      <div class="carousel-controls" v-if="showControls">
        <button @click="prevSlide" class="carousel-control prev">&lt;</button>
        <button @click="nextSlide" class="carousel-control next">&gt;</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch, nextTick, inject, type Ref, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const carouselRef = ref<HTMLElement | null>(null)
const currentSlide = ref(2) // Start at slide 2 (initial slide)
const showControls = ref(false)
const loadedMedia = ref<Set<number>>(new Set())
const showCarousel = ref(false)
const mediaCache = ref<Map<string, HTMLVideoElement | HTMLImageElement>>(new Map())
const mediaContainers = ref<(HTMLElement | null)[]>([])
const currentVideoElement = ref<HTMLVideoElement | null>(null)

interface GlobalEvents {
  splashScreenComplete: boolean
}

const globalEvents = inject<GlobalEvents>('globalEvents', { splashScreenComplete: false })

interface MediaSlide {
  type: 'video' | 'image'
  src: string
  playbackRate?: number
  alt?: string
}

const slides: MediaSlide[] = [
  { type: 'video', src: '/videos/higher.mov', playbackRate: 1 },
  { type: 'video', src: '/videos/duality.mov', playbackRate: 0.5 },
  { type: 'video', src: '/videos/unknownt.mov', playbackRate: 1 },
  { type: 'image', src: '/images/carousel/2.png', alt: 'Project Image 2' },
  { type: 'image', src: '/images/carousel/3.png', alt: 'Project Image 3' },
  { type: 'image', src: '/images/carousel/4.png', alt: 'Project Image 4' },
  { type: 'image', src: '/images/carousel/5.png', alt: 'Project Image 5' },
  { type: 'image', src: '/images/carousel/skin.png', alt: 'Skin (short film)' }
]

const loadedCount = ref(0)
const allMediaLoaded = computed(() => {
  return loadedCount.value === slides.length && globalEvents.splashScreenComplete
})

const setMediaContainer = (el: HTMLElement | null, index: number) => {
  if (el) {
    mediaContainers.value[index] = el
    nextTick(() => {
      initializeVideo(index)
    })
  }
}

const initializeVideo = (index: number) => {
  const slide = slides[index]
  if (slide.type !== 'video') return

  const container = mediaContainers.value[index]
  if (!container) return

  let video = mediaCache.value.get(slide.src) as HTMLVideoElement
  
  if (!video) {
    video = document.createElement('video')
    video.src = slide.src
    video.autoplay = true
    video.muted = true
    video.loop = true
    video.playsInline = true
    video.className = 'w-full h-full object-cover'
    video.playbackRate = slide.playbackRate || 1
    
    video.addEventListener('loadeddata', () => handleMediaLoaded(index))
    mediaCache.value.set(slide.src, video)
  }

  container.innerHTML = ''
  container.appendChild(video)
  currentVideoElement.value = video
}

const resetLoadingState = async () => {
  loadedMedia.value.clear()
  loadedCount.value = 0
  showCarousel.value = false
  
  await nextTick()
  checkLoadedMedia()
}

const handleMediaLoaded = (index: number) => {
  if (!loadedMedia.value.has(index)) {
    loadedMedia.value.add(index)
    loadedCount.value++
    checkAllMediaLoaded()
  }
}

const checkAllMediaLoaded = () => {
  if (allMediaLoaded.value && globalEvents.splashScreenComplete) {
    setTimeout(() => {
      showCarousel.value = true
    }, 500) // Reduced delay since we're now waiting for splash screen
  }
}

const checkLoadedMedia = () => {
  slides.forEach((slide, index) => {
    if (loadedMedia.value.has(index)) return

    if (slide.type === 'video') {
      const video = mediaCache.value.get(slide.src) as HTMLVideoElement
      if (video?.readyState >= 4) {
        handleMediaLoaded(index)
      }
    } else {
      const cachedImage = mediaCache.value.get(slide.src) as HTMLImageElement
      if (cachedImage) {
        handleMediaLoaded(index)
        return
      }

      const img = new Image()
      img.src = slide.src
      if (img.complete) {
        mediaCache.value.set(slide.src, img)
        handleMediaLoaded(index)
      } else {
        img.onload = () => {
          mediaCache.value.set(slide.src, img)
          handleMediaLoaded(index)
        }
      }
    }
  })
}

// Watch for route changes
watch(() => route.path, async (newPath, oldPath) => {
  // Only reset if we're moving to/from a route that doesn't use the carousel
  const carouselRoutes = ['/music', '/film-scores', '/live-performances']
  const wasOnCarouselRoute = carouselRoutes.includes(oldPath || '')
  const isOnCarouselRoute = carouselRoutes.includes(newPath || '')

  if (isOnCarouselRoute && !wasOnCarouselRoute) {
    // Coming to a carousel route from non-carousel route
    await resetLoadingState()
  } else if (!isOnCarouselRoute && wasOnCarouselRoute) {
    // Leaving carousel routes
    showCarousel.value = false
  } else if (isOnCarouselRoute && wasOnCarouselRoute) {
    // Moving between carousel routes - don't reset
    return
  }

  if (currentVideoElement.value) {
    try {
      await currentVideoElement.value.play()
    } catch (error) {
      console.error('Error playing video:', error)
    }
  }
}, { immediate: true })

// Watch for splash screen completion
watch(() => globalEvents.splashScreenComplete, async (isComplete) => {
  if (isComplete && allMediaLoaded.value) {
    checkAllMediaLoaded()
    // Try to play the current video
    if (currentVideoElement.value) {
      try {
        await currentVideoElement.value.play()
      } catch (error) {
        console.error('Error playing video:', error)
      }
    }
  }
})

// Add a periodic check for loaded media
let checkInterval: number | null = null

onMounted(async () => {
  await resetLoadingState()
  // Add periodic checking for media loading
  checkInterval = window.setInterval(() => {
    if (!allMediaLoaded.value) {
      checkLoadedMedia()
    }
  }, 1000)
  
  // Start on slide 2
  nextTick(() => {
    // Use our custom slideTo function directly
    slideTo(1)
  })
})

// Clean up the interval when component is unmounted
onUnmounted(() => {
  if (checkInterval !== null) {
    clearInterval(checkInterval)
  }
  
  // Properly cleanup video elements
  mediaCache.value.forEach((media) => {
    if (media instanceof HTMLVideoElement) {
      media.pause()
      media.remove()
    }
  })
  mediaCache.value.clear()
})

// For navigating from outside component
const handleExternalNavigate = (index: number) => {
  slideTo(index)
}

// Functions to control the carousel
const nextSlide = () => {
  if (currentSlide.value < slides.length - 1) {
    currentSlide.value++
  } else {
    currentSlide.value = 0 // Loop back to first slide
  }
}

const prevSlide = () => {
  if (currentSlide.value > 0) {
    currentSlide.value--
  } else {
    currentSlide.value = slides.length - 1 // Loop to last slide
  }
}

const slideTo = (index: number) => {
  if (index >= 0 && index < slides.length) {
    currentSlide.value = index
  }
}

defineExpose({ slideTo: handleExternalNavigate, nextSlide, prevSlide })
</script>

<style scoped>
.custom-carousel {
  position: relative;
  width: 100%;
}

.carousel-inner {
  display: flex;
  transition: transform 0.5s ease;
  width: 100%;
}

.carousel-slide {
  flex: 0 0 100%;
  width: 100%;
}

.carousel-controls {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  transform: translateY(-50%);
  display: flex;
  justify-content: space-between;
  padding: 0 15px;
}

.carousel-control {
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 18px;
  opacity: 0.7;
  transition: opacity 0.3s ease;
}

.carousel-control:hover {
  opacity: 1;
}
:deep(.carousel__track) {
  overflow: visible;
}

.carousel-wrapper {
  max-width: 690px;
  /* Remove margin to keep it left-aligned */
  margin: 0 auto;
}
</style>