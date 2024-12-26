<template>
    <div class="page-container">
        <h1 class="page-title font-kormelink italic mt-4"><span class="italic font-feature-[fancy]">L</span>ive Performances</h1>
        <p class="font-kormelink italic text-xs px-4 text-gray-500 mb-8">
      "I've written string arrangements for live performances that have elevated shows, adding depth and emotion to create unforgettable musical experiences."
    </p>
        <div class="content-container">
            <Playlist :filter="'LIVE'" />
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

.fancy-text {
    font-style: italic;
    font-feature-settings: "swsh" 1, "cswh" 1, "salt" 1, "dlig" 1;
    -webkit-font-feature-settings: "swsh" 1, "cswh" 1, "salt" 1, "dlig" 1;
    -moz-font-feature-settings: "swsh" 1, "cswh" 1, "salt" 1, "dlig" 1;
}
</style>