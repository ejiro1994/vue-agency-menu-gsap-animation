<script setup lang="ts">
import type { Project } from '../types/Project'
import { useEventListener, useRafFn } from '@vueuse/core'
import gsap from 'gsap'
import { onMounted, ref } from 'vue'
import { CustomEase } from 'gsap/all'
import { interpolate } from 'gsap/all'

gsap.registerPlugin(CustomEase)

defineProps<{
  projects: Project[]
  modalState: {
    active: boolean
    index: number
  }
}>()

const x = ref(0)
const y = ref(0)

const modalContainer = ref(null)
const cursor = ref(null)
// const cursorLabel = ref(null)    

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
  const modalX = gsap.quickTo(modalContainer.value, 'left', { duration: 0.8, ease: 'power3' })
  const modalY = gsap.quickTo(modalContainer.value, 'top', { duration: 0.8, ease: 'power3' })
  const cursorX = gsap.quickTo(cursor.value, 'left', { duration: 0.5, ease: 'power3' })
  const cursorY = gsap.quickTo(cursor.value, 'top', { duration: 0.5, ease: 'power3' })

  useEventListener(window, 'mousemove', ({ clientX, clientY }) => {
    x.value = clientX
    y.value = clientY
    modalX(clientX)
    modalY(clientY)
    cursorX(clientX)
    cursorY(clientY)
  })
})
</script>

<template>
  <!-- modal container -->
  <div
    ref="modalContainer"
    class="h-[350px] w-[400px] flex overflow-hidden items-center justify-center bg-green-100 scale-0 absolute top-0 left-0 z-10 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
    <!-- modal slider -->
    <div :style="{ top: modalState.index * -100 + '%' }" class="ease-cubic-bezier-custom">
      <!-- modal -->
      <div
        v-for="({ src, color }, index) in projects"
        :key="`modal_${index}`"
        class="h-full w-full flex justify-center items-center"
        :style="{ backgroundColor: color }">
        <img :src="`/images/${src}`" alt="image" class="w-[300px]" />
      </div>
    </div>
    <!-- cursor -->

    <!-- cursor label -->
    <!-- <div
      ref="cursorLabel"
      class="w-[80px] h-[80px] rounded-full text-white absolute z-10 flex items-center justify-center text-sm font-light pointer-events-none bg-transparent">
      View
    </div> -->
    <!-- <div
      ref="cursor"
           :style="{ top: `${positionModalCursorY}px`, left: `${positionModalCursorX}px` }"
      class="w-[80px] h-[80px] rounded-full bg-[#455CE9] text-white text-sm font-light pointer-events-none fixed z-20 -translate-x-1/2 -translate-y-1/2">
      View
    </div> -->
  </div>
  <div
    ref="cursor"
    class="w-[80px] h-[80px] scale-0 rounded-full bg-[#455CE9] text-white flex items-center justify-center text-sm font-light pointer-events-none fixed top-0 left-0 z-20 -translate-x-1/2 -translate-y-1/2">
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
