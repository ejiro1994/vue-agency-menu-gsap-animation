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

const positionModalContainerX = ref(0)
const positionModalContainerY = ref(0)

const positionModalCursorX = ref(0)
const positionModalCursorY = ref(0)

useEventListener(window, 'mousemove', (e) => {
  x.value = e.clientX
  y.value = e.clientY
})

// useRafFn(() => {
//   positionModalContainerX.value = interpolate(positionModalContainerX.value, x.value, 0.08)
//   positionModalContainerY.value = interpolate(positionModalContainerY.value, y.value, 0.08)

//   positionModalCursorX.value = interpolate(positionModalCursorX.value, x.value, 0.05)
//   positionModalCursorY.value = interpolate(positionModalCursorY.value, y.value, 0.05)

//   console.log(positionModalContainerX.value)
// })

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
  //Move Container
  const x = gsap.quickTo(modalContainer.value, 'left', { duration: 0.8, ease: 'power3' })
  const y = gsap.quickTo(modalContainer.value, 'top', { duration: 0.8, ease: 'power3' })
  //Move cursor
  const x2 = gsap.quickTo(cursor.value, 'left', { duration: 0.5, ease: 'power3' })
  const y2 = gsap.quickTo(cursor.value, 'top', { duration: 0.5, ease: 'power3' })


  useEventListener(window, 'mousemove', ({clientX, clientY}) => {
   x(clientX)
    y(clientY)

    x2(clientX)
    y2(clientY)
})

  // window.addEventListener('mousemove', ({pageX, pageY}) => {
  //   x(pageX)
  //   y(pageY)

  //   x2(pageX)
  //   y2(pageY)
  // })
})
</script>

<template>
  <!-- modal container -->
  <div
    ref="modalContainer"
    :style="{ top: `${positionModalContainerY}px`, left: `${positionModalContainerX}px` }"
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
    :style="{ top: `${positionModalCursorY}px`, left: `${positionModalCursorX}px` }"
    ref="cursor"
    class="w-[80px] h-[80px] scale-0 rounded-full bg-[#455CE9] text-white flex items-center justify-center text-sm font-light pointer-events-none fixed top-0 left-0 z-20 -translate-x-1/2 -translate-y-1/2">
    View
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
