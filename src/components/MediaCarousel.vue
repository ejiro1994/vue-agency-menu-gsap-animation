<template>
  <div class="relative">
    <div v-show="!allVideosLoaded" class="w-full h-[250px] bg-white"></div>
    <Carousel 
      ref="carouselRef" 
      :perPage="1" 
      :navigationEnabled="false" 
      :touchDrag="false"
      :mouseDrag="false"
      class="w-full px-[14px] mb-8 overflow-hidden transition-opacity duration-500"
      :class="{ 'opacity-0': !allVideosLoaded, 'opacity-100': allVideosLoaded }"
    >
      <Slide>
        <div class="w-full h-[250px] relative" style="background-color: #000000;">
          <video 
            ref="video1"
            src="/videos/higher.mov" 
            class="w-full h-full object-cover" 
            autoplay 
            muted 
            loop 
            playsinline
            webkit-playsinline
            preload="auto"
            x-webkit-airplay="allow"
            @loadeddata="handleVideoLoaded('video1')"
          ></video>
          <div class="absolute inset-0 mix-blend-hue"></div>
        </div>
      </Slide>
      <Slide>
        <div class="w-full h-[250px] relative" style="background-color: #000000;">
          <video 
            ref="video2"
            src="/videos/duality.mov" 
            class="w-full h-full object-cover" 
            autoplay 
            muted 
            loop 
            playsinline
            webkit-playsinline
            preload="auto"
            x-webkit-airplay="allow"
            playbackRate="0.5"
            @loadeddata="handleVideoLoaded('video2')"
          ></video>
          <div class="absolute inset-0 mix-blend-hue"></div>
        </div>
      </Slide>
      <Slide>
        <div class="w-full h-[250px] relative" style="background-color: #000000;">
          <video 
            ref="video3"
            src="/videos/unknownt.mov" 
            class="w-full h-full object-cover" 
            autoplay 
            muted 
            loop 
            playsinline
            webkit-playsinline
            preload="auto"
            x-webkit-airplay="allow"
            @loadeddata="handleVideoLoaded('video3')"
          ></video>
          <div class="absolute inset-0 mix-blend-hue"></div>
        </div>
      </Slide>
      <Slide>
        <div class="w-full h-[250px]" style="background-color: #000000;">
          <img 
            src="/images/carousel/2.png" 
            alt="Project Image 2" 
            class="w-full h-full object-cover"
            @load="handleImageLoaded('image1')" 
          />
        </div>
      </Slide>
      <Slide>
        <div class="w-full h-[250px]" style="background-color: #000000;">
          <img 
            src="/images/carousel/3.png" 
            alt="Project Image 3" 
            class="w-full h-full object-cover"
            @load="handleImageLoaded('image2')" 
          />
        </div>
      </Slide>
      <Slide>
        <div class="w-full h-[250px]" style="background-color: #000000;">
          <img 
            src="/images/carousel/4.png" 
            alt="Project Image 4" 
            class="w-full h-full object-cover"
            @load="handleImageLoaded('image3')" 
          />
        </div>
      </Slide>
      <Slide>
        <div class="w-full h-[250px]" style="background-color: #000000;">
          <img 
            src="/images/carousel/5.png" 
            alt="Project Image 5" 
            class="w-full h-full object-cover"
            @load="handleImageLoaded('image4')" 
          />
        </div>
      </Slide>
    </Carousel>
  </div>
</template>

<script setup lang="ts">
import { Carousel, Slide } from 'vue3-carousel'
import 'vue3-carousel/dist/carousel.css'
import { ref, onMounted, computed } from 'vue'

const carouselRef = ref()
const loadedMedia = ref(new Set())
const totalMediaCount = 7 // 3 videos + 4 images

const allVideosLoaded = computed(() => {
  return loadedMedia.value.size === totalMediaCount
})

const handleVideoLoaded = (videoId: string) => {
  loadedMedia.value.add(videoId)
  const video = document.querySelector(`[ref="${videoId}"]`) as HTMLVideoElement
  if (video) {
    video.play().catch(function(error) {
      console.log("Video play failed:", error)
    })
  }
}

const handleImageLoaded = (imageId: string) => {
  loadedMedia.value.add(imageId)
}

onMounted(() => {
  // Check if videos are already loaded (cached)
  const videos = document.querySelectorAll('video')
  videos.forEach((video, index) => {
    if (video.readyState >= 4) { // HAVE_ENOUGH_DATA
      handleVideoLoaded(`video${index + 1}`)
    }
  })

  // Check if images are already loaded (cached)
  const images = document.querySelectorAll('img')
  images.forEach((image, index) => {
    if (image.complete) {
      handleImageLoaded(`image${index + 1}`)
    }
  })
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