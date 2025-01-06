<template>
  <div class="page-container">
    <h1 class="page-title font-kormelink italic mt-4"><span class="">F</span>ilms</h1>
    <p class="font-kormelink italic text-xs px-4 text-gray-500 mb-8">
      "Ever wondered why some film scores stay with you forever? It's the strings."
    </p>
    <div class="content-container">
      <Playlist :filter="'FILM'" />
    </div>
  </div>
</template>

<script setup lang="ts">
import Playlist from '../components/Playlist.vue'
import { inject } from 'vue'

// Use the goToSlide from App.vue
const goToSlide = inject('goToSlide')
</script>

<style scoped>
/* .page-container {
  padding: 120px 0 40px;
  width: 100%;
} */

.content-container {
  width: 100%;
}

.page-title {
  font-size: 2.5rem;
  margin-bottom: 2rem;
  font-weight: 300;
  padding: 0 14px;
}
</style> 