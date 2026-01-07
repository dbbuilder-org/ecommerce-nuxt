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

    <!-- Toast Notifications -->
    <UiToastManager />
  </div>
</template>

<script setup lang="ts">
// Layout setup - ToastManager provides global notifications
</script>
