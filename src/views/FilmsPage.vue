<template>
  <div class="page-container">
    <MediaCarousel ref="carousel" />
    <h1 class="page-title font-kormelink italic mt-4">Films</h1>
    <Playlist :filter="'FILM'" />
  </div>
</template>

<script setup lang="ts">
import Playlist from '../components/Playlist.vue'
import MediaCarousel from '../components/MediaCarousel.vue'
import { ref, provide } from 'vue'

const carousel = ref()

// Provide the goToSlide function for the playlist component
const goToSlide = (slideIndex: number) => {
  carousel.value?.slideTo(slideIndex)
}

provide('goToSlide', goToSlide)
</script>

<style scoped>
.page-container {
  padding: 120px 0 40px;
  max-width: 1200px;
  margin: 0 auto;
}

.page-title {
  font-size: 2.5rem;
  margin-bottom: 2rem;
  font-weight: 300;
  padding: 0 14px;
}
</style> 