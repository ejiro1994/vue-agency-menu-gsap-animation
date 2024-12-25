<template>
  <div class="audio-container">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const audioCache = ref<Map<string, HTMLAudioElement>>(new Map())

interface AudioTrack {
  src: string
  title: string
}

const preloadAudio = (src: string): Promise<HTMLAudioElement> => {
  if (audioCache.value.has(src)) {
    return Promise.resolve(audioCache.value.get(src)!)
  }

  return new Promise((resolve, reject) => {
    const audio = new Audio()
    audio.src = src
    audio.preload = 'auto'

    audio.addEventListener('canplaythrough', () => {
      audioCache.value.set(src, audio)
      resolve(audio)
    }, { once: true })

    audio.addEventListener('error', reject)
    audio.load()
  })
}

const playAudio = async (src: string) => {
  try {
    const audio = await preloadAudio(src)
    await audio.play()
  } catch (error) {
    console.error('Error playing audio:', error)
  }
}

const stopAllAudio = () => {
  audioCache.value.forEach(audio => {
    audio.pause()
    audio.currentTime = 0
  })
}

// Cleanup on unmount
onUnmounted(() => {
  audioCache.value.forEach(audio => {
    audio.pause()
    audio.src = ''
  })
  audioCache.value.clear()
})

// Expose methods for parent components
defineExpose({
  playAudio,
  stopAllAudio,
  preloadAudio
})
</script> 