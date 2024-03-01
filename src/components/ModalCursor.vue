<script setup lang="ts">
import { defineProps } from 'vue'
import type { Project } from '../types/Project'

defineProps<{
  project: Project
}>()
</script>

<template>
  <div
    class="h-[350px] w-[400px] absolute overflow-hidden pointer-events-none flex items-center justify-center bg-green-500">
    {{ project.title }}
  </div>
</template>
