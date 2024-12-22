<template>
    <div class="page-container">
        <MediaCarousel ref="carousel" />
        <h1 class="page-title font-kormelink italic mt-4 text-base">Featured String Arrangements</h1>
        <p class="font-kormelink italic text-xs px-4 text-gray-500 mb-8">
            "Discover the power of expertly crafted string arrangements that add depth, beauty and emotion to your musical vision."


        </p>
        <div class="content-container">
            <Playlist />
        </div>
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
    width: 100%;
}

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