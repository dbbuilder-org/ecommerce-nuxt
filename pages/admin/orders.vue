<template>
  <div>
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Orders</h1>
        <p class="text-gray-500 mt-1">View and manage all orders</p>
      </div>
      <div class="flex items-center gap-3">
        <button
          @click="exportOrders"
          class="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Icon name="heroicons:arrow-down-tray" class="w-5 h-5 mr-2" />
          Export
        </button>
        <button
          @click="refreshOrders"
          class="flex items-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          <Icon name="heroicons:arrow-path" :class="['w-5 h-5 mr-2', { 'animate-spin': isLoading }]" />
          Refresh
        </button>
      </div>
    </div>

    <!-- Filters & Search -->
    <div class="bg-white rounded-xl shadow-sm p-4 mb-6">
      <div class="flex flex-wrap items-center gap-4">
        <div class="flex-1 min-w-[250px]">
          <div class="relative">
            <Icon name="heroicons:magnifying-glass" class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search orders..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
        <select
          v-model="statusFilter"
          class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="fulfilled">Fulfilled</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <select
          v-model="dateFilter"
          class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
        >
          <option value="all">All Time</option>
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>
      </div>
    </div>

    <!-- Stats Summary -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div class="bg-white rounded-lg p-4 shadow-sm">
        <p class="text-sm text-gray-500">Total Orders</p>
        <p class="text-2xl font-bold text-gray-900">{{ orders.length }}</p>
      </div>
      <div class="bg-white rounded-lg p-4 shadow-sm">
        <p class="text-sm text-gray-500">Pending</p>
        <p class="text-2xl font-bold text-yellow-600">{{ pendingCount }}</p>
      </div>
      <div class="bg-white rounded-lg p-4 shadow-sm">
        <p class="text-sm text-gray-500">Fulfilled</p>
        <p class="text-2xl font-bold text-green-600">{{ fulfilledCount }}</p>
      </div>
      <div class="bg-white rounded-lg p-4 shadow-sm">
        <p class="text-sm text-gray-500">Total Revenue</p>
        <p class="text-2xl font-bold text-primary-600">{{ formatCurrency(totalRevenue) }}</p>
      </div>
    </div>

    <!-- Orders Table -->
    <div class="bg-white rounded-xl shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Items
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="isLoading">
              <td colspan="7" class="px-6 py-12 text-center">
                <Icon name="heroicons:arrow-path" class="w-8 h-8 text-primary-500 animate-spin mx-auto" />
                <p class="text-gray-500 mt-2">Loading orders...</p>
              </td>
            </tr>
            <tr v-else-if="filteredOrders.length === 0">
              <td colspan="7" class="px-6 py-12 text-center">
                <Icon name="heroicons:inbox" class="w-12 h-12 text-gray-300 mx-auto" />
                <p class="text-gray-500 mt-2">No orders found</p>
              </td>
            </tr>
            <tr
              v-for="order in paginatedOrders"
              :key="order.id"
              class="hover:bg-gray-50 transition-colors"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <span class="font-mono text-sm">{{ order.orderReference }}</span>
                  <span
                    :class="[
                      'ml-2 inline-flex px-2 py-0.5 text-xs rounded-full',
                      order.deliveryMethod === 'pickup' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                    ]"
                  >
                    {{ order.deliveryMethod === 'pickup' ? 'Pickup' : 'Ship' }}
                  </span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ order.customerName }}</div>
                <div class="text-sm text-gray-500">{{ order.email }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ order.itemCount }} items
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ formatCurrency(order.total) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="[
                    'inline-flex px-2 py-1 text-xs font-medium rounded-full',
                    getStatusClasses(order.status)
                  ]"
                >
                  {{ order.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(order.createdAt) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  @click="viewOrderDetails(order)"
                  class="text-primary-600 hover:text-primary-900"
                >
                  View
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
        <div class="text-sm text-gray-500">
          Showing {{ startIndex + 1 }} to {{ Math.min(endIndex, filteredOrders.length) }} of {{ filteredOrders.length }} orders
        </div>
        <div class="flex items-center gap-2">
          <button
            @click="currentPage--"
            :disabled="currentPage === 1"
            class="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span class="text-sm text-gray-600">
            Page {{ currentPage }} of {{ totalPages }}
          </span>
          <button
            @click="currentPage++"
            :disabled="currentPage >= totalPages"
            class="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>

    <!-- Order Details Modal -->
    <UiModal v-model:open="showOrderModal" :title="`Order ${selectedOrder?.orderReference}`" size="lg">
      <div v-if="selectedOrder" class="space-y-6">
        <!-- Customer Info -->
        <div class="bg-gray-50 rounded-lg p-4">
          <h3 class="font-medium text-gray-900 mb-3">Customer Information</h3>
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span class="text-gray-500">Name:</span>
              <span class="ml-2 font-medium">{{ selectedOrder.customerName }}</span>
            </div>
            <div>
              <span class="text-gray-500">Email:</span>
              <span class="ml-2">{{ selectedOrder.email }}</span>
            </div>
            <div v-if="selectedOrder.phone">
              <span class="text-gray-500">Phone:</span>
              <span class="ml-2">{{ selectedOrder.phone }}</span>
            </div>
          </div>
        </div>

        <!-- Delivery Info -->
        <div class="bg-gray-50 rounded-lg p-4">
          <h3 class="font-medium text-gray-900 mb-3">
            {{ selectedOrder.deliveryMethod === 'pickup' ? 'Pickup Location' : 'Shipping Address' }}
          </h3>
          <p class="text-sm text-gray-600">
            {{ selectedOrder.deliveryMethod === 'pickup'
              ? selectedOrder.pickupLocation?.address
              : selectedOrder.shippingAddress?.address }}
          </p>
        </div>

        <!-- Order Items -->
        <div>
          <h3 class="font-medium text-gray-900 mb-3">Order Items</h3>
          <div class="border rounded-lg divide-y">
            <div
              v-for="item in selectedOrder.items"
              :key="item.id"
              class="p-3 flex items-center justify-between"
            >
              <div>
                <p class="font-medium">{{ item.name }}</p>
                <p class="text-sm text-gray-500">Qty: {{ item.quantity }}</p>
              </div>
              <p class="font-medium">{{ formatCurrency(item.price * item.quantity) }}</p>
            </div>
          </div>
        </div>

        <!-- Order Total -->
        <div class="border-t pt-4 flex justify-between items-center">
          <span class="text-lg font-medium">Total</span>
          <span class="text-xl font-bold text-primary-600">{{ formatCurrency(selectedOrder.total) }}</span>
        </div>

        <!-- Actions -->
        <div class="flex justify-end gap-3 pt-4 border-t">
          <UiButton variant="outline" @click="showOrderModal = false">
            Close
          </UiButton>
          <UiButton
            v-if="selectedOrder.status !== 'Fulfilled'"
            variant="primary"
            @click="goToFulfillment"
          >
            Process Fulfillment
          </UiButton>
        </div>
      </div>
    </UiModal>
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
  title: 'Orders - Admin',
})

const router = useRouter()
const toast = useToast()

// State
const isLoading = ref(false)
const searchQuery = ref('')
const statusFilter = ref('all')
const dateFilter = ref('all')
const currentPage = ref(1)
const perPage = 10
const showOrderModal = ref(false)
const selectedOrder = ref<any>(null)

// Mock orders data
const orders = ref([
  {
    id: 1,
    orderReference: 'ORD-2024-001',
    customerName: 'John Smith',
    email: 'john.smith@example.com',
    phone: '(555) 123-4567',
    itemCount: 3,
    total: 125.00,
    status: 'Pending',
    deliveryMethod: 'pickup',
    pickupLocation: { address: '145 Pavilion Lane, Youngwood, PA 15697' },
    items: [
      { id: 1, name: 'Textbook - Biology 101', quantity: 1, price: 75.00 },
      { id: 2, name: 'Notebook Pack', quantity: 2, price: 25.00 },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    orderReference: 'ORD-2024-002',
    customerName: 'Jane Doe',
    email: 'jane.doe@example.com',
    phone: null,
    itemCount: 1,
    total: 45.00,
    status: 'Processing',
    deliveryMethod: 'shipping',
    shippingAddress: { address: '123 Main St, Pittsburgh, PA 15213' },
    items: [
      { id: 3, name: 'College Hoodie', quantity: 1, price: 45.00 },
    ],
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 3,
    orderReference: 'ORD-2024-003',
    customerName: 'Mike Johnson',
    email: 'mike.johnson@example.com',
    phone: '(555) 987-6543',
    itemCount: 5,
    total: 280.00,
    status: 'Fulfilled',
    deliveryMethod: 'pickup',
    pickupLocation: { address: '301 Donner Avenue, Greensburg, PA 15601' },
    items: [
      { id: 4, name: 'Calculator - Scientific', quantity: 1, price: 120.00 },
      { id: 5, name: 'Art Supplies Kit', quantity: 1, price: 80.00 },
      { id: 6, name: 'Pencils 12-pack', quantity: 3, price: 26.67 },
    ],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 4,
    orderReference: 'ORD-2024-004',
    customerName: 'Sarah Wilson',
    email: 'sarah.wilson@example.com',
    phone: '(555) 555-5555',
    itemCount: 2,
    total: 89.99,
    status: 'Fulfilled',
    deliveryMethod: 'shipping',
    shippingAddress: { address: '456 Oak Ave, Latrobe, PA 15650' },
    items: [
      { id: 7, name: 'Lab Coat', quantity: 1, price: 49.99 },
      { id: 8, name: 'Safety Goggles', quantity: 2, price: 20.00 },
    ],
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
])

// Computed
const filteredOrders = computed(() => {
  return orders.value.filter((order) => {
    // Search filter
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      const matchesSearch =
        order.orderReference.toLowerCase().includes(query) ||
        order.customerName.toLowerCase().includes(query) ||
        order.email.toLowerCase().includes(query)
      if (!matchesSearch) return false
    }

    // Status filter
    if (statusFilter.value !== 'all' && order.status.toLowerCase() !== statusFilter.value) {
      return false
    }

    // Date filter
    if (dateFilter.value !== 'all') {
      const orderDate = new Date(order.createdAt)
      const now = new Date()
      if (dateFilter.value === 'today') {
        if (orderDate.toDateString() !== now.toDateString()) return false
      } else if (dateFilter.value === 'week') {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        if (orderDate < weekAgo) return false
      } else if (dateFilter.value === 'month') {
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        if (orderDate < monthAgo) return false
      }
    }

    return true
  })
})

const pendingCount = computed(() => orders.value.filter(o => o.status === 'Pending').length)
const fulfilledCount = computed(() => orders.value.filter(o => o.status === 'Fulfilled').length)
const totalRevenue = computed(() => orders.value.reduce((sum, o) => sum + o.total, 0))

const totalPages = computed(() => Math.ceil(filteredOrders.value.length / perPage))
const startIndex = computed(() => (currentPage.value - 1) * perPage)
const endIndex = computed(() => startIndex.value + perPage)
const paginatedOrders = computed(() => filteredOrders.value.slice(startIndex.value, endIndex.value))

// Methods
function refreshOrders() {
  isLoading.value = true
  setTimeout(() => {
    isLoading.value = false
    toast.success('Refreshed', 'Orders have been refreshed')
  }, 1000)
}

function exportOrders() {
  toast.info('Export Started', 'Your orders export is being prepared...')
}

function viewOrderDetails(order: any) {
  selectedOrder.value = order
  showOrderModal.value = true
}

function goToFulfillment() {
  showOrderModal.value = false
  router.push('/admin/fulfillment')
}

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
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(dateString))
}

// Reset pagination when filters change
watch([searchQuery, statusFilter, dateFilter], () => {
  currentPage.value = 1
})
</script>
