<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-900 mb-8">Dashboard</h1>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="bg-white rounded-xl shadow-sm p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Today's Orders</p>
            <p class="text-3xl font-bold text-gray-900">{{ stats.todayOrders }}</p>
          </div>
          <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <Icon name="heroicons:shopping-bag" class="w-6 h-6 text-blue-600" />
          </div>
        </div>
        <p class="text-sm text-green-600 mt-2">
          <Icon name="heroicons:arrow-trending-up" class="w-4 h-4 inline" />
          +{{ stats.todayGrowth }}% from yesterday
        </p>
      </div>

      <div class="bg-white rounded-xl shadow-sm p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Today's Revenue</p>
            <p class="text-3xl font-bold text-gray-900">{{ formatCurrency(stats.todayRevenue) }}</p>
          </div>
          <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <Icon name="heroicons:currency-dollar" class="w-6 h-6 text-green-600" />
          </div>
        </div>
        <p class="text-sm text-green-600 mt-2">
          <Icon name="heroicons:arrow-trending-up" class="w-4 h-4 inline" />
          +{{ stats.revenueGrowth }}% from yesterday
        </p>
      </div>

      <div class="bg-white rounded-xl shadow-sm p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Pending Fulfillment</p>
            <p class="text-3xl font-bold text-gray-900">{{ stats.pendingFulfillment }}</p>
          </div>
          <div class="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
            <Icon name="heroicons:clock" class="w-6 h-6 text-yellow-600" />
          </div>
        </div>
        <NuxtLink to="/admin/fulfillment" class="text-sm text-primary-600 mt-2 inline-block">
          View all →
        </NuxtLink>
      </div>

      <div class="bg-white rounded-xl shadow-sm p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Total Products</p>
            <p class="text-3xl font-bold text-gray-900">{{ stats.totalProducts }}</p>
          </div>
          <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
            <Icon name="heroicons:cube" class="w-6 h-6 text-purple-600" />
          </div>
        </div>
        <p class="text-sm text-gray-500 mt-2">
          {{ stats.lowStockProducts }} low stock items
        </p>
      </div>
    </div>

    <!-- Recent Orders & Quick Actions -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Recent Orders -->
      <div class="lg:col-span-2 bg-white rounded-xl shadow-sm">
        <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 class="text-lg font-semibold text-gray-900">Recent Orders</h2>
          <NuxtLink to="/admin/orders" class="text-sm text-primary-600 hover:text-primary-700">
            View all
          </NuxtLink>
        </div>
        <div class="divide-y divide-gray-200">
          <div v-if="recentOrders.length === 0" class="p-6 text-center text-gray-500">
            No recent orders
          </div>
          <div
            v-for="order in recentOrders"
            :key="order.id"
            class="px-6 py-4 flex items-center justify-between hover:bg-gray-50"
          >
            <div class="flex items-center space-x-4">
              <div class="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <Icon name="heroicons:shopping-bag" class="w-5 h-5 text-gray-500" />
              </div>
              <div>
                <p class="font-medium text-gray-900">{{ order.customerName }}</p>
                <p class="text-sm text-gray-500">{{ order.itemCount }} items • {{ formatCurrency(order.total) }}</p>
              </div>
            </div>
            <div class="text-right">
              <span
                :class="[
                  'inline-flex px-2 py-1 text-xs font-medium rounded-full',
                  getStatusClasses(order.status)
                ]"
              >
                {{ order.status }}
              </span>
              <p class="text-xs text-gray-500 mt-1">{{ formatDate(order.createdAt) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="bg-white rounded-xl shadow-sm">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900">Quick Actions</h2>
        </div>
        <div class="p-4 space-y-3">
          <NuxtLink
            to="/admin/fulfillment"
            class="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div class="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Icon name="heroicons:truck" class="w-5 h-5 text-yellow-600" />
            </div>
            <div class="ml-3">
              <p class="font-medium text-gray-900">Process Fulfillments</p>
              <p class="text-sm text-gray-500">{{ stats.pendingFulfillment }} pending</p>
            </div>
            <Icon name="heroicons:chevron-right" class="w-5 h-5 text-gray-400 ml-auto" />
          </NuxtLink>

          <NuxtLink
            to="/admin/orders"
            class="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Icon name="heroicons:clipboard-document-list" class="w-5 h-5 text-blue-600" />
            </div>
            <div class="ml-3">
              <p class="font-medium text-gray-900">View All Orders</p>
              <p class="text-sm text-gray-500">Manage orders</p>
            </div>
            <Icon name="heroicons:chevron-right" class="w-5 h-5 text-gray-400 ml-auto" />
          </NuxtLink>

          <NuxtLink
            to="/shop"
            class="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Icon name="heroicons:eye" class="w-5 h-5 text-green-600" />
            </div>
            <div class="ml-3">
              <p class="font-medium text-gray-900">View Store</p>
              <p class="text-sm text-gray-500">See customer view</p>
            </div>
            <Icon name="heroicons:chevron-right" class="w-5 h-5 text-gray-400 ml-auto" />
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatCurrency } from '~/utils/currency'

// Define page meta
definePageMeta({
  layout: 'admin',
  middleware: ['admin'],
})

useHead({
  title: 'Admin Dashboard',
})

// Mock stats data (in production, fetch from API)
const stats = ref({
  todayOrders: 24,
  todayGrowth: 12,
  todayRevenue: 3450.00,
  revenueGrowth: 8,
  pendingFulfillment: 7,
  totalProducts: 156,
  lowStockProducts: 4,
})

// Mock recent orders (in production, fetch from API)
const recentOrders = ref([
  {
    id: 1,
    customerName: 'John Smith',
    itemCount: 3,
    total: 125.00,
    status: 'Pending',
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    customerName: 'Jane Doe',
    itemCount: 1,
    total: 45.00,
    status: 'Fulfilled',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 3,
    customerName: 'Mike Johnson',
    itemCount: 5,
    total: 280.00,
    status: 'Processing',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
])

function getStatusClasses(status: string) {
  switch (status.toLowerCase()) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'processing':
      return 'bg-blue-100 text-blue-800'
    case 'fulfilled':
      return 'bg-green-100 text-green-800'
    case 'cancelled':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}
</script>
