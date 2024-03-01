<script setup lang="ts">
import type { Project } from '../types/Project'
import { useEventListener, useRafFn } from '@vueuse/core'
import gsap from 'gsap'
import { onMounted, ref } from 'vue'
import { CustomEase } from 'gsap/all'
import { interpolate } from 'gsap/all'

defineProps<{
  projects: Project[]
  modalState: {
    active: boolean
    index: number
  }
}>()

const x = ref(0)
const y = ref(0)

const positionX = ref(0);
const positionY = ref(0);

useEventListener(window, 'mousemove', (e) => {
  x.value = e.clientX
  y.value = e.clientY

  console.log('x value', x.value, 'y value', y.value)
})

const modalContainer = ref(null)
const cursor = ref(null)
const cursorLabel = ref(null)

const animateIn = () => {
  gsap.to(modalContainer.value, {
    scale: 1,
    duration: 0.4,
    ease: CustomEase.create('custom', 'M0,0 C0.76,0 0.24,1 1,1 ')
  })
}
const animateOut = () => {
  gsap.to(modalContainer.value, {
    scale: 0,
    duration: 0.4,
    ease: CustomEase.create('custom', 'M0,0 C0.76,0 0.24,1 1,1 ')
  })
}
defineExpose({
  animateIn,
  animateOut
})




useRafFn(() => {
  positionX.value = interpolate(positionX.value, x.value, 0.08);
  positionY.value = interpolate(positionY.value, y.value, 0.08);
});
// onMounted(() => {
//   //Move Container
//   let xMoveContainer = gsap.quickTo(modalContainer.value, 'left', { duration: 0.8, ease: 'power3' })
//   let yMoveContainer = gsap.quickTo(modalContainer.value, 'top', { duration: 0.8, ease: 'power3' })
//   //Move cursor
//   let xMoveCursor = gsap.quickTo(cursor.value, 'left', { duration: 0.5, ease: 'power3' })
//   let yMoveCursor = gsap.quickTo(cursor.value, 'top', { duration: 0.5, ease: 'power3' })
//   //Move cursor label
//   let xMoveCursorLabel = gsap.quickTo(cursorLabel.value, 'left', { duration: 0.45, ease: 'power3' })
//   let yMoveCursorLabel = gsap.quickTo(cursorLabel.value, 'top', { duration: 0.45, ease: 'power3' })

//   window.addEventListener('mousemove', (e) => {
//     const { pageX, pageY } = e
//     xMoveContainer(pageX)
//     yMoveContainer(pageY)
//     xMoveCursor(pageX)
//     yMoveCursor(pageY)
//     xMoveCursorLabel(pageX)
//     yMoveCursorLabel(pageY)
//   })
// })
</script>

<template>
  <!-- modal container -->
  <div
    ref="modalContainer"
    :style="{ top: `${positionY}px`, left: `${positionX}px` }"
    class="h-[350px] w-[400px]  overflow-hidden flex items-center justify-center bg-green-100 scale-0 fixed top-0 left-0 z-10 -translate-x-1/2 -translate-y-1/2 pointer-events-none">

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
    <div
      ref="cursor"
      class="w-[80px] h-[80px] rounded-full bg-[#455CE9] text-white absolute z-10 flex items-center justify-center text-sm font-light pointer-events-none"></div>
    <!-- cursor label -->
    <div
      ref="cursorLabel"
      class="w-[80px] h-[80px] rounded-full text-white absolute z-10 flex items-center justify-center text-sm font-light pointer-events-none bg-transparent">
      View
    </div>
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
