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
              action.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:text-white'
            ]"
            :style="{ backgroundColor: '#f9fafb' }"
            @mouseenter="(e: MouseEvent) => !action.disabled && ((e.currentTarget as HTMLElement).style.backgroundColor = veneerConfig.colors.primary)"
            @mouseleave="(e: MouseEvent) => (e.currentTarget as HTMLElement).style.backgroundColor = '#f9fafb'"
          >
            <div
              class="w-10 h-10 rounded-lg flex items-center justify-center group-hover:bg-white/20 transition-colors"
              :style="{ backgroundColor: veneerConfig.colors.accent + '1a' }"
            >
              <svg class="w-5 h-5" :style="{ color: veneerConfig.colors.accent }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="getIconPath(action.icon)" />
              </svg>
            </div>
            <div>
              <span class="font-medium block">{{ action.label }}</span>
              <span class="text-xs text-gray-500 group-hover:text-white/70">{{ action.description }}</span>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Shop by Grade (Windermere-specific) -->
    <section v-if="veneerConfig.features.shopByGrade" class="py-12 bg-gray-50">
      <div class="container mx-auto px-4">
        <div class="text-center mb-8">
          <h2 class="text-2xl font-bold text-gray-900">Shop by Grade</h2>
          <p class="text-gray-600 mt-2">Find everything your student needs</p>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
          <NuxtLink
            v-for="grade in veneerConfig.grades"
            :key="grade.value"
            :to="`/shop?grade=${grade.value}`"
            class="group relative overflow-hidden rounded-xl bg-white border-2 border-transparent transition-all duration-300 shadow-sm hover:shadow-lg"
            :style="{ '--hover-border': veneerConfig.colors.accent }"
            @mouseenter="(e: MouseEvent) => (e.currentTarget as HTMLElement).style.borderColor = veneerConfig.colors.accent"
            @mouseleave="(e: MouseEvent) => (e.currentTarget as HTMLElement).style.borderColor = 'transparent'"
          >
            <div class="p-6 text-center">
              <div
                class="w-16 h-16 mx-auto mb-4 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform"
                :style="{ background: `linear-gradient(to bottom right, ${veneerConfig.colors.primary}, ${veneerConfig.colors.primaryDark})` }"
              >
                <Icon name="heroicons:academic-cap" class="w-8 h-8" :style="{ color: veneerConfig.colors.accent }" />
              </div>
              <h3 class="font-semibold text-gray-900">{{ grade.label }}</h3>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Featured Collections -->
    <section v-if="veneerConfig.features.shopByCollection" class="py-12 bg-white">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h2 class="text-2xl font-bold text-gray-900">{{ veneerConfig.content.collectionsTitle }}</h2>
            <p class="text-gray-600 mt-1">{{ veneerConfig.content.collectionsSubtitle }}</p>
          </div>
          <NuxtLink
            to="/shop"
            class="hidden md:flex items-center font-medium transition-colors"
            :style="{ color: veneerConfig.colors.primary }"
          >
            View All
            <Icon name="heroicons:arrow-right" class="ml-1 w-4 h-4" />
          </NuxtLink>
        </div>

        <div class="grid md:grid-cols-3 gap-6">
          <template v-for="collection in veneerConfig.collections" :key="collection.id">
            <!-- External link -->
            <a
              v-if="collection.type === 'external'"
              :href="veneerConfig.contact.website"
              target="_blank"
              rel="noopener noreferrer"
              class="group relative overflow-hidden rounded-2xl aspect-[4/3]"
            >
              <div
                class="absolute inset-0"
                :style="{ background: `linear-gradient(to bottom right, ${veneerConfig.colors.primary}, ${veneerConfig.colors.primaryDark})` }"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div class="absolute inset-0 p-6 flex flex-col justify-end">
                <div class="mb-2">
                  <Icon
                    :name="getCollectionIcon(collection.icon)"
                    class="w-10 h-10 mb-3 group-hover:scale-110 transition-transform"
                    :style="{ color: veneerConfig.colors.accent }"
                  />
                </div>
                <h3 class="text-xl font-bold text-white">{{ collection.label }}</h3>
                <p class="text-white/80 text-sm mt-1">{{ collection.description }}</p>
              </div>
            </a>
            <!-- Internal link -->
            <NuxtLink
              v-else
              :to="collection.type === 'dropdown' ? '/shop' : `/shop?collection=${collection.id}`"
              class="group relative overflow-hidden rounded-2xl aspect-[4/3]"
            >
              <div
                class="absolute inset-0"
                :style="{ background: `linear-gradient(to bottom right, ${veneerConfig.colors.primary}, ${veneerConfig.colors.primaryDark})` }"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div class="absolute inset-0 p-6 flex flex-col justify-end">
                <div class="mb-2">
                  <Icon
                    :name="getCollectionIcon(collection.icon)"
                    class="w-10 h-10 mb-3 group-hover:scale-110 transition-transform"
                    :style="{ color: veneerConfig.colors.accent }"
                  />
                </div>
                <h3 class="text-xl font-bold text-white">{{ collection.label }}</h3>
                <p class="text-white/80 text-sm mt-1">{{ collection.description }}</p>
                <div
                  class="mt-3 flex items-center text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                  :style="{ color: veneerConfig.colors.accent }"
                >
                  <span>Shop Collection</span>
                  <Icon name="heroicons:arrow-right" class="w-4 h-4 ml-1" />
                </div>
              </div>
            </NuxtLink>
          </template>
        </div>
      </div>
    </section>

    <!-- Featured Products -->
    <section v-if="veneerConfig.features.featuredItems" class="py-12 bg-gray-50">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between mb-8">
          <h2 class="text-2xl font-bold text-gray-900">Featured Products</h2>
          <NuxtLink
            to="/shop?category=featured-items"
            class="font-medium text-sm transition-colors"
            :style="{ color: veneerConfig.colors.primary }"
          >
            View All Featured
            <Icon name="heroicons:arrow-right" class="ml-1 w-4 h-4 inline" />
          </NuxtLink>
        </div>

        <!-- Products slot for parent to inject -->
        <slot name="featured-products" />
      </div>
    </section>

    <!-- Brand Strip -->
    <section
      v-if="veneerConfig.content.brandStrip"
      class="py-4"
      :style="{ backgroundColor: veneerConfig.colors.primaryDark }"
    >
      <div class="container mx-auto px-4">
        <p class="text-center text-white/80 text-sm font-medium tracking-wide">
          {{ veneerConfig.content.brandStrip }}
        </p>
      </div>
    </section>

    <!-- Newsletter / CTA -->
    <section
      class="py-16"
      :style="{ background: `linear-gradient(to bottom right, ${veneerConfig.colors.primary}, ${veneerConfig.colors.primaryDark})` }"
    >
      <div class="container mx-auto px-4 text-center">
        <Icon name="heroicons:envelope" class="w-12 h-12 mx-auto mb-4" :style="{ color: veneerConfig.colors.accent }" />
        <h2 class="text-2xl md:text-3xl font-bold text-white mb-4">
          Stay Updated
        </h2>
        <p class="text-white/80 mb-8 max-w-xl mx-auto">
          Get notified about new products, special offers, and school events.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            class="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:bg-white/20 transition-colors"
            :style="{ '--focus-border': veneerConfig.colors.accent }"
          />
          <button
            class="px-6 py-3 font-semibold rounded-lg transition-colors"
            :style="{
              backgroundColor: veneerConfig.colors.accent,
              color: veneerConfig.colors.primary
            }"
          >
            Subscribe
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { windermereVeneerConfig, getIconPath } from '~/config/themes/windermere/veneer'

// Use veneer config for all data
const veneerConfig = windermereVeneerConfig

// Map collection icon names to heroicons
function getCollectionIcon(iconName: string): string {
  const iconMap: Record<string, string> = {
    book: 'heroicons:book-open',
    'book-open': 'heroicons:book-open',
    sun: 'heroicons:sun',
    bolt: 'heroicons:bolt',
    moon: 'heroicons:moon',
    heart: 'heroicons:heart',
    'external-link': 'heroicons:arrow-top-right-on-square',
    'shopping-bag': 'heroicons:shopping-bag',
    user: 'heroicons:user',
  }
  return iconMap[iconName] || 'heroicons:squares-2x2'
}
</script>
