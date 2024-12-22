<template>
  <Carousel 
    ref="carouselRef" 
    :perPage="1" 
    :navigationEnabled="false" 
    :touchDrag="false"
    :mouseDrag="false"
    class="w-full px-[14px] mb-8 overflow-hidden"
  >
    <Slide>
      <div class="w-full h-[250px] relative" style="background-color: #000000;">
        <video 
          src="/videos/higher.mov" 
          class="w-full h-full object-cover" 
          autoplay 
          muted 
          loop 
          playsinline
          webkit-playsinline
          preload="auto"
          x-webkit-airplay="allow"
        ></video>
        <div class="absolute inset-0 mix-blend-hue"></div>
      </div>
    </Slide>
    <Slide>
      <div class="w-full h-[250px] relative" style="background-color: #000000;">
        <video 
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
        ></video>
        <div class="absolute inset-0 mix-blend-hue"></div>
      </div>
    </Slide>
    <Slide>
      <div class="w-full h-[250px] relative" style="background-color: #000000;">
        <video 
          src="/videos/unknownt.mov" 
          class="w-full h-full object-cover" 
          autoplay 
          muted 
          loop 
          playsinline
          webkit-playsinline
          preload="auto"
          x-webkit-airplay="allow"
        ></video>
        <div class="absolute inset-0 mix-blend-hue"></div>
      </div>
    </Slide>
    <Slide>
      <div class="w-full h-[250px]" style="background-color: #000000;">
        <img src="/images/carousel/2.png" alt="Project Image 2" class="w-full h-full object-cover" />
      </div>
    </Slide>
    <Slide>
      <div class="w-full h-[250px]" style="background-color: #000000;">
        <img src="/images/carousel/3.png" alt="Project Image 3" class="w-full h-full object-cover" />
      </div>
    </Slide>
    <Slide>
      <div class="w-full h-[250px]" style="background-color: #000000;">
        <img src="/images/carousel/4.png" alt="Project Image 4" class="w-full h-full object-cover" />
      </div>
    </Slide>
    <Slide>
      <div class="w-full h-[250px]" style="background-color: #000000;">
        <img src="/images/carousel/5.png" alt="Project Image 5" class="w-full h-full object-cover" />
      </div>
    </Slide>
  </Carousel>
</template>

<script setup lang="ts">
import { Carousel, Slide } from 'vue3-carousel'
import 'vue3-carousel/dist/carousel.css'
import { ref, onMounted } from 'vue'

const carouselRef = ref()

onMounted(() => {
  // Force play all videos for iOS
  const videos = document.querySelectorAll('video')
  videos.forEach(video => {
    video.play().catch(function(error) {
      console.log("Video play failed:", error)
    })
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