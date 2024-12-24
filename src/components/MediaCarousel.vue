<template>
  <div class="relative">
    <div v-show="!allVideosLoaded" class="w-full h-[250px] bg-white"></div>
    <Carousel 
      ref="carouselRef" 
      :perPage="1" 
      :navigationEnabled="false" 
      :touchDrag="false"
      :mouseDrag="false"
      class="w-full px-[14px] mb-8 overflow-hidden"
      :class="[
        'transition-opacity duration-1000',
        showCarousel ? 'opacity-100' : 'opacity-0 pointer-events-none'
      ]"
    >
      <Slide v-for="(slide, index) in slides" :key="index">
        <div class="w-full h-[250px] relative" :style="{ backgroundColor: '#000000' }">
          <video v-if="slide.type === 'video'"
            :ref="setVideoRef"
            :src="slide.src" 
            class="w-full h-full object-cover" 
            autoplay 
            muted 
            loop 
            playsinline
            webkit-playsinline
            preload="auto"
            x-webkit-airplay="allow"
            :playbackRate="slide.playbackRate"
            @loadeddata="() => handleVideoLoaded(index)"
          ></video>
          <img v-else
            :src="slide.src" 
            :alt="slide.alt" 
            class="w-full h-full object-cover"
            @load="() => handleImageLoaded(index)" 
          />
          <div v-if="slide.type === 'video'" class="absolute inset-0 mix-blend-hue"></div>
        </div>
      </Slide>
    </Carousel>
  </div>
</template>

<script setup lang="ts">
import { Carousel, Slide } from 'vue3-carousel'
import 'vue3-carousel/dist/carousel.css'
import { ref, onMounted, computed, watch, nextTick, inject } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const carouselRef = ref()
const loadedMedia = ref(new Set())
const videoRefs = ref<HTMLVideoElement[]>([])
const showCarousel = ref(false)

// Inject the global events object
const globalEvents = inject('globalEvents') as { splashScreenComplete: boolean }

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

const allVideosLoaded = computed(() => {
  return loadedMedia.value.size === totalMediaCount
})

const setVideoRef = (el: HTMLVideoElement) => {
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

const handleVideoLoaded = (index: number) => {
  loadedMedia.value.add(`media${index}`)
  if (videoRefs.value[index]) {
    videoRefs.value[index].play().catch(function(error) {
      console.log("Video play failed:", error)
    })
  }
  checkAllMediaLoaded()
}

const handleImageLoaded = (index: number) => {
  loadedMedia.value.add(`media${index}`)
  checkAllMediaLoaded()
}

const checkAllMediaLoaded = () => {
  if (allVideosLoaded.value && globalEvents.splashScreenComplete) {
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
        handleVideoLoaded(index)
      }
    } else {
      const img = new Image()
      img.src = slide.src
      if (img.complete) {
        handleImageLoaded(index)
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
  if (isComplete && allVideosLoaded.value) {
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