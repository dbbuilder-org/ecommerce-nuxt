<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
// App-level setup
const config = useRuntimeConfig()

// Set page title based on school
useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk
      ? `${titleChunk} - ${config.public.schoolName}`
      : config.public.schoolName
  },
})
</script>
