<script setup lang="ts">
import ListOfItems from './components/List/ListOfItems.vue'
import type { Project } from './types/Project'
import ModalCursor from './components/ModalCursor.vue'
import { reactive, ref } from 'vue'

const modalCursor = ref<typeof ModalCursor>()

const projects: Project[] = [
  {
    title: 'C2 Montreal',
    src: 'c2montreal.png',
    color: '#000000'
  },
  {
    title: 'Office Studio',
    src: 'officestudio.png',
    color: '#8C8C8C'
  },
  {
    title: 'Locomotive',
    src: 'locomotive.png',
    color: '#000000'
  },
  {
    title: 'Silencio',
    src: 'silencio.png',
    color: '#706D63'
  }
]

const handleMouseEnter = () => {
  modalCursor.value?.animateIn()
}

const handleMouseLeave = () => {
  modalCursor.value?.animateOut()
}

const modalState = reactive({
  active: false,
  index: 0
})

// const handleItemIndex = (e: number) => {
// modalState.index = e
// }
</script>

<template>
  <main class="flex justify-center items-center h-screen">
    <ListOfItems
      @itemIndex="(e) => (modalState.index = e)"
      :projects="projects"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
      :modalState="modalState" />
    <ModalCursor ref="modalCursor" :projects="projects" :modalState="modalState" />
  </main>
</template>
