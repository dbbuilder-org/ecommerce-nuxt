<template>
  <footer class="bg-gray-900 text-gray-300 py-12">
    <div class="container mx-auto px-4">
      <div class="grid md:grid-cols-3 gap-8">
        <!-- About -->
        <div>
          <h3 class="text-white font-semibold mb-4">{{ schoolName }}</h3>
          <p class="text-gray-400 text-sm">
            {{ footerDescription }}
          </p>
          <p v-if="address" class="text-gray-500 text-xs mt-3">
            {{ address }}
          </p>
        </div>

        <!-- Quick Links -->
        <div>
          <h3 class="text-white font-semibold mb-4">Quick Links</h3>
          <ul class="space-y-2 text-sm">
            <li>
              <NuxtLink to="/shop" class="hover:text-white">Shop All</NuxtLink>
            </li>
            <li v-if="schoolWebsite">
              <a :href="schoolWebsite" target="_blank" rel="noopener noreferrer" class="hover:text-white">
                School Website
              </a>
            </li>
            <li v-if="parentPortal">
              <a :href="parentPortal" target="_blank" rel="noopener noreferrer" class="hover:text-white">
                Parent Portal
              </a>
            </li>
          </ul>
        </div>

        <!-- Contact -->
        <div>
          <h3 class="text-white font-semibold mb-4">Contact</h3>
          <ul class="space-y-2 text-sm text-gray-400">
            <li class="flex items-center space-x-2">
              <Icon name="heroicons:envelope" class="w-4 h-4" />
              <a :href="`mailto:${contactEmail}`" class="hover:text-white">{{ contactEmail }}</a>
            </li>
            <li class="flex items-center space-x-2">
              <Icon name="heroicons:phone" class="w-4 h-4" />
              <a :href="`tel:${contactPhone.replace(/\D/g, '')}`" class="hover:text-white">{{ contactPhone }}</a>
            </li>
          </ul>
        </div>
      </div>

      <div class="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
        <p>&copy; {{ currentYear }} {{ copyrightName }}. All rights reserved.</p>
        <p class="mt-2">
          Secure payments powered by WorldPay.
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { windermereVeneerConfig } from '~/config/themes/windermere/veneer'
import { westmorelandVeneerConfig } from '~/config/themes/westmoreland/veneer'

const config = useRuntimeConfig()
const { theme } = useTheme()

const currentYear = new Date().getFullYear()

// Get veneer config based on current theme
const veneerConfig = computed(() => {
  const themeId = theme.value?.id || config.public.defaultTheme || 'westmoreland'
  if (themeId === 'windermere') {
    return windermereVeneerConfig
  }
  return westmorelandVeneerConfig
})

// Dynamic footer content from veneer config or env vars
const schoolName = computed(() =>
  config.public.schoolName || veneerConfig.value.displayName || 'SchoolVision Store'
)

const footerDescription = computed(() =>
  config.public.footerDescription ||
  (veneerConfig.value.content as any)?.footer?.description ||
  'Your trusted source for school uniforms, supplies, and merchandise.'
)

const address = computed(() =>
  config.public.footerAddress ||
  veneerConfig.value.contact?.address ||
  ''
)

const contactEmail = computed(() =>
  config.public.contactEmail ||
  veneerConfig.value.contact?.email ||
  'support@schoolvision.io'
)

const contactPhone = computed(() =>
  config.public.contactPhone ||
  veneerConfig.value.contact?.phone ||
  '(555) 123-4567'
)

const schoolWebsite = computed(() =>
  config.public.schoolWebsite ||
  (veneerConfig.value.contact as any)?.website ||
  (veneerConfig.value as any).links?.schoolWebsite ||
  ''
)

const parentPortal = computed(() =>
  config.public.parentPortal ||
  (veneerConfig.value as any).links?.parentPortal ||
  ''
)

const copyrightName = computed(() =>
  config.public.copyrightName ||
  veneerConfig.value.displayName ||
  'SchoolVision'
)
</script>
