<script setup lang="ts">
import ListOfItems from './components/List/ListOfItems.vue'
import type { Project } from './types/Project'
import ModalCursor from './components/ModalCursor.vue'
import { reactive, ref } from 'vue'
import brandLogo from'./assets/images/brand-logo2.svg'

const modalCursor = ref<typeof ModalCursor>()

const projects: Project[] = [
  {
    title: 'music',
    src: 'music.png',
    color: '#000000'
  },
  {
    title: 'films',
    src: 'films.png',
    color: '#8C8C8C'
  },
  {
    title: 'live performances',
    src: 'live-performances.png',
    color: '#000000'
  },
  {
    title: 'scorebook',
    src: 'scorebook.png',
    color: '#706D63'
  },
  {
    title: 'about',
    src: 'about.png',
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
  <div>
    <nav class="fixed top-0 w-full py-6 flex justify-between items-center z-50 px-[14px] font-kormelink ">
      <img
        :src="brandLogo"
        :width="120"
        alt="Logo"
        class="opacity-90"
      />
      <button class=" uppercase text-lg font-medium hover:opacity-70 transition-opacity">
        Menu
      </button>
    </nav>
    <main class="flex flex-col justify-center items-center h-screen">
      <ListOfItems
        @itemIndex="(e) => (modalState.index = e)"
        :projects="projects"
        @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave"
        :modalState="modalState" />
      <ModalCursor ref="modalCursor" :projects="projects" :modalState="modalState" />
    </main>
  </div>
</template>
