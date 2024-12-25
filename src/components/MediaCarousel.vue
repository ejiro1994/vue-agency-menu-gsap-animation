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
import { ref, onMounted, computed, watch, nextTick, inject, reactive, type ComponentPublicInstance } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const carouselRef = ref()
const loadedMedia = ref(new Set())
const videoRefs = ref<(el: HTMLVideoElement | null) => void>([])
const showCarousel = ref(false)

interface GlobalEvents {
  splashScreenComplete: boolean
}

const globalEvents = inject<GlobalEvents>('globalEvents', { splashScreenComplete: false })

const slides = [
  { type: 'video', src: '/videos/higher.mov', playbackRate: 1 },
  { type: 'video', src: '/videos/duality.mov', playbackRate: 0.5 },
  { type: 'video', src: '/videos/unknownt.mov', playbackRate: 1 },
  { type: 'image', src: '/images/carousel/2.png', alt: 'Project Image 2' },
  { type: 'image', src: '/images/carousel/3.png', alt: 'Project Image 3' },
  { type: 'image', src: '/images/carousel/4.png', alt: 'Project Image 4' },
  { type: 'image', src: '/images/carousel/5.png', alt: 'Project Image 5' }
]

const totalMediaCount = slides.length

const loadedCount = ref(0)
const allMediaLoaded = computed(() => {
  return loadedCount.value === slides.length && globalEvents.splashScreenComplete
})

const setVideoRef = (el: HTMLVideoElement | null) => {
  if (el) {
    videoRefs.value.push(el)
  }
}

const resetLoadingState = async () => {
  loadedMedia.value.clear()
  videoRefs.value = []
  showCarousel.value = false
  
  await nextTick()
  checkLoadedMedia()
}

const handleMediaLoaded = (index: number) => {
  loadedCount.value++
}

const checkAllMediaLoaded = () => {
  if (allMediaLoaded.value && globalEvents.splashScreenComplete) {
    setTimeout(() => {
      showCarousel.value = true
    }, 500) // Reduced delay since we're now waiting for splash screen
  }
}

const checkLoadedMedia = () => {
  // Check videos and images
  slides.forEach((slide, index) => {
    if (slide.type === 'video') {
      const video = videoRefs.value[index]
      if (video && video.readyState >= 4) {
        handleMediaLoaded(index)
      }
    } else {
      const img = new Image()
      img.src = slide.src
      if (img.complete) {
        handleMediaLoaded(index)
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

onMounted(async () => {
  await resetLoadingState()
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