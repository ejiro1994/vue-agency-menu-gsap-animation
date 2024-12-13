<script setup lang="ts">
import ListOfItems from './components/List/ListOfItems.vue'
import type { Project } from './types/Project'
import ModalCursor from './components/ModalCursor.vue'
import { reactive, ref } from 'vue'
import brandLogo from'./assets/images/brand-logo.svg'

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
  <main class="flex flex-col justify-center items-center h-screen">
    <img
      :src="brandLogo"
      :width="140"
      alt="Logo"
      class="mx-auto pt-9 z-20 fixed top-1 opacity-90"
    />
    <ListOfItems
      @itemIndex="(e) => (modalState.index = e)"
      :projects="projects"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
      :modalState="modalState" />
    <ModalCursor ref="modalCursor" :projects="projects" :modalState="modalState" />
  </main>
</template>
