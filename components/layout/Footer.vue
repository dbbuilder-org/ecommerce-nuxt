<template>
  <footer class="bg-gray-900 text-gray-300 py-12">
    <div class="container mx-auto px-4">
      <div class="grid md:grid-cols-3 gap-8">
        <!-- About -->
        <div>
          <h3 class="text-white font-semibold mb-4">{{ schoolName }}</h3>
          <p class="text-gray-400 text-sm">
            Your trusted source for school uniforms, supplies, and merchandise.
          </p>
        </div>

        <!-- Quick Links -->
        <div>
          <h3 class="text-white font-semibold mb-4">Quick Links</h3>
          <ul class="space-y-2 text-sm">
            <li>
              <NuxtLink to="/shop" class="hover:text-white">Shop All</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/contact" class="hover:text-white">Contact Us</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/faq" class="hover:text-white">FAQ</NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Contact -->
        <div>
          <h3 class="text-white font-semibold mb-4">Contact</h3>
          <ul class="space-y-2 text-sm text-gray-400">
            <li class="flex items-center space-x-2">
              <Icon name="heroicons:envelope" class="w-4 h-4" />
              <span>support@schoolvision.io</span>
            </li>
            <li class="flex items-center space-x-2">
              <Icon name="heroicons:phone" class="w-4 h-4" />
              <span>(555) 123-4567</span>
            </li>
          </ul>
        </div>
      </div>

      <div class="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
        <p>&copy; {{ currentYear }} SchoolVision. All rights reserved.</p>
        <p class="mt-2">
          Secure payments powered by WorldPay.
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const schoolName = config.public.schoolName
const currentYear = new Date().getFullYear()
</script>
