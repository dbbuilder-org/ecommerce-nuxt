<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <LayoutHeader />

    <!-- Main Content -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- Footer -->
    <LayoutFooter />

    <!-- Cart Sidebar -->
    <ShopCartSidebar />
  </div>
</template>

<script setup lang="ts">
// Layout setup
</script>
