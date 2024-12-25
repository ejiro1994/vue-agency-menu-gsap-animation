<template>
  <div class="relative">
    <Carousel 
      ref="carouselRef" 
      :perPage="1" 
      :navigationEnabled="false" 
      :touchDrag="false"
      :mouseDrag="false"
      class="w-full px-[14px] mb-8 overflow-hidden"
      :class="{ 'opacity-0': !allMediaLoaded, 'opacity-100 transition-opacity duration-1000': allMediaLoaded }"
    >
      <Slide v-for="(slide, index) in slides" :key="slide.src">
        <div class="w-full h-[250px] relative bg-black">
          <video v-if="slide.type === 'video'"
            :src="slide.src" 
            class="w-full h-full object-cover" 
            autoplay 
            muted 
            loop 
            playsinline
            @loadeddata="() => handleMediaLoaded(index)"
          ></video>
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
const videoRefs = ref<HTMLVideoElement[]>([])
const showCarousel = ref(false)
const mediaCache = ref<Map<string, HTMLVideoElement | HTMLImageElement>>(new Map())

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
  { type: 'image', src: '/images/carousel/5.png', alt: 'Project Image 5' }
]

const loadedCount = ref(0)
const allMediaLoaded = computed(() => {
  return loadedCount.value === slides.length && globalEvents.splashScreenComplete
})

const resetLoadingState = async () => {
  loadedMedia.value.clear()
  loadedCount.value = 0
  videoRefs.value = []
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
    if (loadedMedia.value.has(index)) return // Skip if already loaded

    if (slide.type === 'video') {
      // Check cache first
      const cachedVideo = mediaCache.value.get(slide.src) as HTMLVideoElement
      if (cachedVideo) {
        handleMediaLoaded(index)
        return
      }

      const video = document.querySelector(`video[src="${slide.src}"]`) as HTMLVideoElement
      if (video) {
        if (video.readyState >= 4) {
          mediaCache.value.set(slide.src, video)
          handleMediaLoaded(index)
        }
      }
    } else {
      // For images
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
watch(() => route.path, async () => {
  await resetLoadingState()
}, { immediate: true })

// Watch for splash screen completion
watch(() => globalEvents.splashScreenComplete, (isComplete) => {
  if (isComplete && allMediaLoaded.value) {
    checkAllMediaLoaded()
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
  }, 1000) // Check every second
})

// Clean up the interval when component is unmounted
onUnmounted(() => {
  if (checkInterval !== null) {
    clearInterval(checkInterval)
  }
  // Clear the media cache
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
</style>