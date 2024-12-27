<script setup lang="ts">
import type { Project } from '../types/Project'
import { useEventListener } from '@vueuse/core'
import gsap from 'gsap'
import { onMounted, ref } from 'vue'
import { CustomEase } from 'gsap/all'

gsap.registerPlugin(CustomEase)

defineProps<{
  projects: Project[]
  modalState: {
    active: boolean
    index: number
  }
  isMenuOpen: boolean
}>()

const x = ref(0)
const y = ref(0)
const modalContainer = ref(null)
const cursor = ref(null)

const animateIn = () => {
  gsap.to([modalContainer.value, cursor.value], {
    scale: 1,
    duration: 0.5,
    ease: CustomEase.create('custom', 'M0,0 C0.76,0 0.24,1 1,1 ')
  })
}

const animateOut = () => {
  gsap.to([modalContainer.value, cursor.value], {
    scale: 0,
    duration: 0.5,
    ease: CustomEase.create('custom', 'M0,0 C0.76,0 0.24,1 1,1 ')
  })
}

defineExpose({
  animateIn,
  animateOut
})

onMounted(() => {
  const menuOffset = 94
  const modalX = gsap.quickTo(modalContainer.value, 'left', { duration: 0.8, ease: 'power3' })
  const modalY = gsap.quickTo(modalContainer.value, 'top', { duration: 0.8, ease: 'power3' })
  const cursorX = gsap.quickTo(cursor.value, 'left', { duration: 0.5, ease: 'power3' })
  const cursorY = gsap.quickTo(cursor.value, 'top', { duration: 0.5, ease: 'power3' })

  useEventListener(window, 'mousemove', (e) => {
    x.value = e.clientX
    y.value = e.clientY - menuOffset

    modalX(e.clientX)
    modalY(e.clientY - menuOffset)

    cursorX(e.clientX)
    cursorY(e.clientY - menuOffset)
  })
})
</script>

<template>
  <div ref="modalContainer"
    class="h-[350px] w-[400px] flex overflow-hidden items-center justify-center bg-[#FFFFFF] scale-0 absolute top-0 left-0 z-10 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
    :class="{ 'hidden': !isMenuOpen }">
    <div :style="{ top: modalState.index * -100 + '%' }" class="ease-cubic-bezier-custom">
      <div v-for="({ title, src, color }, index) in projects" :key="`modal_${index}`"
        class="h-full w-full flex justify-center items-center" :style="{ backgroundColor: color || '#F5F5F5' }">
        <template v-if="title === 'film scores'">
          <video autoplay loop muted playsinline class="w-[300px]">
            <source src="/videos/duality.mov" type="video/mp4" />
            <source src="/videos/duality.mov" type="video/quicktime" />
            Your browser does not support the video tag.
          </video>
        </template>
        <template v-else>
          <img :src="`/images/${src}`" alt="image" class="w-[300px]" />
        </template>
      </div>
    </div>
  </div>
  <div ref="cursor"
    class="w-[80px] h-[80px] scale-0 rounded-full bg-[#8a7b5c] text-white flex items-center justify-center text-sm font-light pointer-events-none fixed top-0 left-0 z-20 -translate-x-1/2 -translate-y-1/2"
    :class="{ 'hidden': !isMenuOpen }">
    Listen
  </div>
</template>

<style scoped>
.ease-cubic-bezier-custom {
  height: 100%;
  width: 100%;
  position: absolute;
  transition: top 0.5s cubic-bezier(0.76, 0, 0.24, 1);
}
</style>
