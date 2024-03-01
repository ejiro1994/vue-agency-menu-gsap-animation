<script setup lang="ts">
import List from './components/List/index.vue'
import type { Project } from './types/Project'

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
</script>

<template>
  <main class="flex justify-center items-center h-screen">
    <List :projects="projects" />
    <ModalCursor :project="projects" />
  </main>
</template>
