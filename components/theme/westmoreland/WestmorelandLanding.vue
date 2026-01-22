<template>
  <div>
    <!-- Quick Actions -->
    <section v-if="veneerConfig.features.quickActions" class="py-8 bg-white border-b">
      <div class="container mx-auto px-4">
        <div v-if="veneerConfig.content.quickActionsTitle" class="text-center mb-6">
          <h2 class="text-xl font-semibold text-gray-900">{{ veneerConfig.content.quickActionsTitle }}</h2>
          <p v-if="veneerConfig.content.quickActionsSubtitle" class="text-gray-600 text-sm mt-1">
            {{ veneerConfig.content.quickActionsSubtitle }}
          </p>
        </div>
        <div class="flex flex-wrap justify-center gap-4 md:gap-6">
          <NuxtLink
            v-for="action in veneerConfig.quickActions"
            :key="action.id"
            :to="action.path"
            :class="[
              'flex items-center gap-3 px-5 py-3 rounded-xl transition-all duration-300 group',
              action.highlight ? 'bg-[#0c85b6] text-white' : 'bg-gray-50 hover:bg-[#7EB3D7] hover:text-white'
            ]"
          >
            <div
              class="w-10 h-10 rounded-lg flex items-center justify-center transition-colors"
              :class="action.highlight ? 'bg-white/20' : 'bg-[#7EB3D7]/20 group-hover:bg-white/20'"
            >
              <svg class="w-5 h-5" :class="action.highlight ? 'text-white' : 'text-[#0c85b6] group-hover:text-white'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="getIconPath(action.icon)" />
              </svg>
            </div>
            <div>
              <span class="font-medium block">{{ action.label }}</span>
              <span class="text-xs" :class="action.highlight ? 'text-white/70' : 'text-gray-500 group-hover:text-white/70'">
                {{ action.description }}
              </span>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Shop by Department (Westmoreland-specific) -->
    <section v-if="veneerConfig.features.shopByDepartment" class="py-12 bg-gray-50">
      <div class="container mx-auto px-4">
        <div class="text-center mb-8">
          <h2 class="text-2xl font-bold text-gray-900">Shop by Department</h2>
          <p class="text-gray-600 mt-2">Browse our complete selection</p>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <NuxtLink
            v-for="department in veneerConfig.departments"
            :key="department.id"
            :to="department.path"
            class="group relative overflow-hidden rounded-xl bg-white border border-gray-100 transition-all duration-300 shadow-sm hover:shadow-lg hover:border-[#7EB3D7]"
          >
            <div class="p-5 text-center">
              <div
                class="w-14 h-14 mx-auto mb-3 rounded-xl flex items-center justify-center bg-gradient-to-br from-[#7EB3D7] to-[#5a9bc7] group-hover:scale-110 transition-transform"
              >
                <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="getIconPath(department.icon || 'shopping')" />
                </svg>
              </div>
              <h3 class="font-medium text-gray-900 text-sm">{{ department.label }}</h3>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Featured Products -->
    <section v-if="veneerConfig.features.featuredItems" class="py-12 bg-white">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between mb-8">
          <h2 class="text-2xl font-bold text-gray-900">Featured Products</h2>
          <NuxtLink
            to="/shop?category=featured-items"
            class="font-medium text-sm text-[#0c85b6] transition-colors hover:text-[#035891]"
          >
            View All Featured
            <Icon name="heroicons:arrow-right" class="ml-1 w-4 h-4 inline" />
          </NuxtLink>
        </div>

        <!-- Products slot for parent to inject -->
        <slot name="featured-products" />
      </div>
    </section>

    <!-- Pickup Locations Info -->
    <section v-if="veneerConfig.features.pickupLocations" class="py-12 bg-[#7EB3D7]/10">
      <div class="container mx-auto px-4">
        <div class="max-w-3xl mx-auto text-center">
          <Icon name="heroicons:map-pin" class="w-12 h-12 mx-auto mb-4 text-[#0c85b6]" />
          <h2 class="text-2xl font-bold text-gray-900 mb-4">Campus Pickup Available</h2>
          <p class="text-gray-600 mb-6">
            Order online and pick up at our convenient campus location. No shipping fees, fast and easy!
          </p>
          <NuxtLink
            to="/pickup-locations"
            class="inline-flex items-center px-6 py-3 bg-[#0c85b6] text-white font-semibold rounded-lg hover:bg-[#035891] transition-colors"
          >
            View Pickup Locations
            <Icon name="heroicons:arrow-right" class="ml-2 w-5 h-5" />
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Services Section -->
    <section class="py-12 bg-white">
      <div class="container mx-auto px-4">
        <div class="text-center mb-8">
          <h2 class="text-2xl font-bold text-gray-900">Student Services</h2>
          <p class="text-gray-600 mt-2">We're here to help you succeed</p>
        </div>

        <div class="grid md:grid-cols-3 gap-6">
          <!-- Textbook Rentals -->
          <div class="p-6 bg-gray-50 rounded-xl">
            <div class="w-12 h-12 rounded-lg bg-[#992222]/10 flex items-center justify-center mb-4">
              <Icon name="heroicons:book-open" class="w-6 h-6 text-[#992222]" />
            </div>
            <h3 class="font-bold text-gray-900 mb-2">Textbook Rentals</h3>
            <p class="text-gray-600 text-sm mb-4">Save money by renting textbooks instead of buying.</p>
            <NuxtLink to="/services/rentals" class="text-[#0c85b6] font-medium text-sm hover:underline">
              Learn More &rarr;
            </NuxtLink>
          </div>

          <!-- Buyback Program -->
          <div class="p-6 bg-gray-50 rounded-xl">
            <div class="w-12 h-12 rounded-lg bg-[#699864]/10 flex items-center justify-center mb-4">
              <Icon name="heroicons:currency-dollar" class="w-6 h-6 text-[#699864]" />
            </div>
            <h3 class="font-bold text-gray-900 mb-2">Buyback Program</h3>
            <p class="text-gray-600 text-sm mb-4">Sell back your books at the end of the semester.</p>
            <NuxtLink to="/services/buyback" class="text-[#0c85b6] font-medium text-sm hover:underline">
              Learn More &rarr;
            </NuxtLink>
          </div>

          <!-- Digital Downloads -->
          <div class="p-6 bg-gray-50 rounded-xl">
            <div class="w-12 h-12 rounded-lg bg-[#0c85b6]/10 flex items-center justify-center mb-4">
              <Icon name="heroicons:cloud-arrow-down" class="w-6 h-6 text-[#0c85b6]" />
            </div>
            <h3 class="font-bold text-gray-900 mb-2">Digital Downloads</h3>
            <p class="text-gray-600 text-sm mb-4">Access ebooks and digital materials instantly.</p>
            <NuxtLink to="/services/digital" class="text-[#0c85b6] font-medium text-sm hover:underline">
              Learn More &rarr;
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact / Store Info -->
    <section class="py-12 bg-gradient-to-br from-[#035891] to-[#024572]">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          <!-- Store Hours & Contact -->
          <div class="text-white">
            <h2 class="text-2xl font-bold mb-4">Visit Us</h2>
            <div class="space-y-3 text-white/80">
              <p class="flex items-start gap-2">
                <Icon name="heroicons:map-pin" class="w-5 h-5 mt-0.5 shrink-0" />
                {{ veneerConfig.contact.address }}
              </p>
              <p class="flex items-center gap-2">
                <Icon name="heroicons:clock" class="w-5 h-5 shrink-0" />
                {{ veneerConfig.contact.hours }}
              </p>
              <p class="flex items-center gap-2">
                <Icon name="heroicons:phone" class="w-5 h-5 shrink-0" />
                {{ veneerConfig.contact.phone }}
              </p>
              <p class="flex items-center gap-2">
                <Icon name="heroicons:envelope" class="w-5 h-5 shrink-0" />
                {{ veneerConfig.contact.email }}
              </p>
            </div>
          </div>

          <!-- Newsletter -->
          <div>
            <h2 class="text-2xl font-bold text-white mb-4">Stay Updated</h2>
            <p class="text-white/80 mb-4">
              Get notified about textbook buyback events, sales, and campus news.
            </p>
            <div class="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                class="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:bg-white/20 transition-colors"
              />
              <button class="px-6 py-3 bg-white text-[#035891] font-semibold rounded-lg hover:bg-gray-100 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Welcome Message -->
    <section v-if="veneerConfig.content.welcomeMessage" class="py-6 bg-[#7EB3D7]">
      <div class="container mx-auto px-4">
        <p class="text-center text-white font-medium">
          {{ veneerConfig.content.welcomeMessage }}
        </p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { westmorelandVeneerConfig, getWestmorelandIconPath as getIconPath } from '~/config/themes/westmoreland/veneer'

// Use veneer config for all data
const veneerConfig = westmorelandVeneerConfig
</script>
