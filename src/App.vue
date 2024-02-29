<script setup lang="ts">
import ModalCursor from './components/ModalCursor.vue'

const projects = [
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
    src: 'locomotive.png'
  },
  {
    title: 'Silencio',
    src: 'silencio.png',
    color: '#706D63'
  }
]
</script>

<template>
  <main class="flex justify-center items-center h-screen">
    <ul class="w-[1000px] flex flex-col items-center justify-center">
      <li
        v-for="(project, index) in projects"
        :key="index"
        class="flex w-full justify-between items-center py-12 border-t border-b-[1px] cursor-pointer transition-all duration-200 hover:opacity-50 group"
      >
        <h2
          class="text-6xl m-0 font-normal transition-all duration-[400ms] group-hover:-translate-x-[10px]"
        >
          {{ project.title }}
        </h2>
        <p class="transition-all duration-[400ms] group-hover:translate-x-[10px]">
          Design & Development
        </p>
      </li>
    </ul>
    <ModalCursor :project="projects" />
  </main>
</template>
