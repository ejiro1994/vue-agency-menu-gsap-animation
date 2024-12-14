<script setup lang="ts">
import { computed, defineProps } from 'vue'
import type { Project } from '../../types/Project'

const { index } = defineProps<{
  project: Project
  index: number
}>()

const number = computed(() => `${index + 1}`)
</script>

<template>
  <li
    class="flex w-full flex-col sm:flex-row justify-between items-start sm:items-center py-6 sm:py-12 border-t border-b-[1px] cursor-pointer transition-all duration-200 hover:opacity-50 group">
    <h2
      class="text-3xl sm:text-4xl md:text-6xl m-0 font-normal transition-all duration-[400ms] group-hover:-translate-x-[10px] flex items-center">
      <span class="text-xs mr-2 sm:mr-3 opacity-50">({{ number }})</span>
      <span class="">{{ project.title }}</span>
    </h2>
    <p class="mt-2 sm:mt-0 text-sm sm:text-base transition-all duration-[400ms] group-hover:translate-x-[10px]">
      Design & Development
    </p>
  </li>
</template>
