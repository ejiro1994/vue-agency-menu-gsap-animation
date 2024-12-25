<template>
  <PageLayout>
    <h1 class="page-title font-kormelink italic mt-4 text-base">Featured String Arrangements</h1>
    <p class="font-kormelink italic text-xs px-4 text-gray-500 mb-8">
      "For over three years, I've partnered with artists and directors to craft string arrangements that elevate projects with unparalleled depth, beauty and emotion."
    </p>
    <div class="content-container">
      <Playlist />
    </div>
  </PageLayout>
</template>

<script setup lang="ts">
import PageLayout from '@/layouts/PageLayout.vue'
import Playlist from '../components/Playlist.vue'
import { inject } from 'vue'

const goToSlide = inject('goToSlide')
</script>

<style scoped>
/* .page-container {
    padding: 50px 0 40px;
    width: 100%;
} */

.content-container {
    width: 100%;
}

.page-title {
    font-size: 2rem;
    margin-bottom: 2rem;
    font-weight: 300;
    padding: 0 14px;
}

.fancy-text {
    font-style: italic;
    font-feature-settings: "swsh" 1, "cswh" 1, "salt" 1, "dlig" 1;
    -webkit-font-feature-settings: "swsh" 1, "cswh" 1, "salt" 1, "dlig" 1;
    -moz-font-feature-settings: "swsh" 1, "cswh" 1, "salt" 1, "dlig" 1;
}
</style>