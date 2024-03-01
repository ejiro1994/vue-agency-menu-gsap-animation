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
    class="flex w-full justify-between items-center py-12 border-t border-b-[1px] cursor-pointer transition-all duration-200 hover:opacity-50 group">
    <h2
      class="text-6xl m-0 font-normal transition-all duration-[400ms] group-hover:-translate-x-[10px] flex">
      <span class="text-xs mr-3 opacity-50">({{ number }})</span>
      <span class="">{{ project.title }}</span>
    </h2>
    <p class="transition-all duration-[400ms] group-hover:translate-x-[10px]">
      Design & Development
    </p>
  </li>
</template>
