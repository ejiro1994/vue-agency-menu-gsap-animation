<script setup lang="ts">
import ListItem from './ListItem.vue'
import type { Project } from '../../types/Project'

import { defineProps } from 'vue'

defineProps<{
  projects: Project[]
  modalState: {
    index: number
    active: boolean
  }
}>()

// const emit = defineEmits(['itemIndex'])

const emit = defineEmits<{
  itemIndex: [index: number]
}>()

const handleMouseEnter = (index: number) => {
  emit('itemIndex', index)
}
</script>

<template>
  <ul class="w-full max-w-[1000px] px-4 md:px-6 flex flex-col items-center justify-center">
    <ListItem
      @mouseenter="handleMouseEnter(index)"
      v-for="(project, index) in projects"
      :index="index"
      :key="project.title"
      :project="project" />
  </ul>
</template>
