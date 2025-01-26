<template>
  <div class="carousel-wrapper">
    <Carousel 
      ref="carouselRef" 
      :perPage="1" 
      :navigationEnabled="false" 
      :touchDrag="false"
      :mouseDrag="false"
      :initialSlide="2"
      class="w-full mb-8 overflow-hidden"
      :class="{ 'opacity-0': !allMediaLoaded, 'opacity-100 transition-opacity duration-1000': allMediaLoaded }"
    >
      <Slide v-for="(slide, index) in slides" :key="slide.src">
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
      </Slide>
    </Carousel>
  </div>
</template>

<script setup lang="ts">
import { Carousel, Slide } from 'vue3-carousel'
import 'vue3-carousel/dist/carousel.css'
import { ref, onMounted, computed, watch, nextTick, inject, type Ref, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const carouselRef = ref<InstanceType<typeof Carousel> | null>(null)
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
    carouselRef.value?.slideTo(1)
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

const slideTo = (index: number) => {
  carouselRef.value?.slideTo(index)
}

defineExpose({ slideTo })
</script>

<style scoped>
:deep(.carousel__track) {
  overflow: visible;
}

.carousel-wrapper {
  max-width: 690px;
  /* Remove margin to keep it left-aligned */
  margin: 0 auto;
}
</style>