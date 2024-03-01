<script setup lang="ts">
import ListItem from './ListItem.vue'
import type { Project } from '../../types/Project'

import { defineProps } from 'vue'

defineProps<{
  projects: Project[]
}>()
</script>

<template>
  <ul class="w-[1000px] flex flex-col items-center justify-cente">
    <ListItem v-for="project in projects" :key="project.title" :project="project" />
  </ul>
</template>
