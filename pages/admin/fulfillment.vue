<template>
  <div>
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Fulfillment</h1>
        <p class="text-gray-500 mt-1">Manage order fulfillment and pickup notifications</p>
      </div>
      <button
        @click="refreshOrders"
        class="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <Icon name="heroicons:arrow-path" :class="['w-5 h-5 mr-2', { 'animate-spin': isLoading }]" />
        Refresh
      </button>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-xl shadow-sm p-4 mb-6">
      <div class="flex flex-wrap items-center gap-4">
        <div class="flex-1 min-w-[200px]">
          <div class="relative">
            <Icon name="heroicons:magnifying-glass" class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search by order ID, customer name, or email..."
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
          <option value="ready">Ready for Pickup</option>
          <option value="fulfilled">Fulfilled</option>
        </select>
        <select
          v-model="deliveryFilter"
          class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
        >
          <option value="all">All Delivery Types</option>
          <option value="pickup">Pickup</option>
          <option value="shipping">Shipping</option>
        </select>
      </div>
    </div>

    <!-- Orders Table -->
    <div class="bg-white rounded-xl shadow-sm overflow-hidden">
      <!-- Loading State -->
      <div v-if="isLoading" class="p-8 text-center">
        <Icon name="heroicons:arrow-path" class="w-8 h-8 text-primary-500 animate-spin mx-auto" />
        <p class="text-gray-500 mt-2">Loading orders...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredOrders.length === 0" class="p-8 text-center">
        <Icon name="heroicons:inbox" class="w-12 h-12 text-gray-300 mx-auto" />
        <p class="text-gray-500 mt-2">No orders found</p>
      </div>

      <!-- Orders List -->
      <div v-else class="divide-y divide-gray-200">
        <div
          v-for="order in filteredOrders"
          :key="order.id"
          class="p-6 hover:bg-gray-50 transition-colors"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <!-- Order Header -->
              <div class="flex items-center gap-3 mb-3">
                <span class="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                  #{{ order.orderReference }}
                </span>
                <span
                  :class="[
                    'inline-flex px-2 py-1 text-xs font-medium rounded-full',
                    getStatusClasses(order.status)
                  ]"
                >
                  {{ order.status }}
                </span>
                <span
                  :class="[
                    'inline-flex px-2 py-1 text-xs font-medium rounded-full',
                    order.deliveryMethod === 'pickup' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                  ]"
                >
                  <Icon
                    :name="order.deliveryMethod === 'pickup' ? 'heroicons:building-storefront' : 'heroicons:truck'"
                    class="w-3 h-3 mr-1"
                  />
                  {{ order.deliveryMethod === 'pickup' ? 'Pickup' : 'Shipping' }}
                </span>
              </div>

              <!-- Customer Info -->
              <div class="flex items-center gap-6 text-sm">
                <div class="flex items-center">
                  <Icon name="heroicons:user" class="w-4 h-4 text-gray-400 mr-1" />
                  <span class="font-medium">{{ order.customerName }}</span>
                </div>
                <div class="flex items-center text-gray-500">
                  <Icon name="heroicons:envelope" class="w-4 h-4 mr-1" />
                  {{ order.email }}
                </div>
                <div v-if="order.phone" class="flex items-center text-gray-500">
                  <Icon name="heroicons:phone" class="w-4 h-4 mr-1" />
                  {{ order.phone }}
                </div>
              </div>

              <!-- Pickup/Shipping Details -->
              <div v-if="order.deliveryMethod === 'pickup' && order.pickupLocation" class="mt-3 p-3 bg-purple-50 rounded-lg text-sm">
                <div class="flex items-start">
                  <Icon name="heroicons:map-pin" class="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                  <div class="ml-2">
                    <p class="font-medium text-purple-800">{{ order.pickupLocation.name }}</p>
                    <p class="text-purple-600">{{ order.pickupLocation.address }}</p>
                  </div>
                </div>
              </div>

              <div v-if="order.deliveryMethod === 'shipping' && order.shippingAddress" class="mt-3 p-3 bg-blue-50 rounded-lg text-sm">
                <div class="flex items-start">
                  <Icon name="heroicons:truck" class="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div class="ml-2">
                    <p class="font-medium text-blue-800">{{ order.shippingAddress.name }}</p>
                    <p class="text-blue-600">{{ order.shippingAddress.address }}</p>
                    <p v-if="order.shippingMethod" class="text-blue-500 mt-1">
                      {{ order.shippingMethod }} • {{ order.trackingNumber || 'No tracking yet' }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Order Items -->
              <div class="mt-3">
                <p class="text-sm text-gray-500">
                  {{ order.itemCount }} {{ order.itemCount === 1 ? 'item' : 'items' }} •
                  {{ formatCurrency(order.total) }}
                </p>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex flex-col gap-2 ml-6">
              <button
                v-if="order.status === 'Pending'"
                @click="markAsProcessing(order)"
                class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
              >
                Start Processing
              </button>
              <button
                v-if="order.status === 'Processing' && order.deliveryMethod === 'pickup'"
                @click="markReadyForPickup(order)"
                class="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm"
              >
                Ready for Pickup
              </button>
              <button
                v-if="order.status === 'Processing' && order.deliveryMethod === 'shipping'"
                @click="openShippingModal(order)"
                class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
              >
                Add Tracking
              </button>
              <button
                v-if="order.status === 'Ready for Pickup' || (order.status === 'Processing' && order.deliveryMethod === 'shipping')"
                @click="markAsFulfilled(order)"
                class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
              >
                Mark Fulfilled
              </button>
              <button
                @click="sendNotification(order)"
                class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                <Icon name="heroicons:envelope" class="w-4 h-4 inline mr-1" />
                Send Notification
              </button>
            </div>
          </div>

          <!-- Timestamp -->
          <div class="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500">
            Created: {{ formatDate(order.createdAt) }}
            <span v-if="order.updatedAt"> • Last updated: {{ formatDate(order.updatedAt) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Shipping Modal -->
    <UiModal :show="showShippingModal" title="Add Shipping Details" @close="showShippingModal = false">
      <div class="space-y-4">
        <UiFormInput
          v-model="shippingForm.carrier"
          label="Carrier"
          placeholder="USPS, UPS, FedEx..."
        />
        <UiFormInput
          v-model="shippingForm.trackingNumber"
          label="Tracking Number"
          placeholder="Enter tracking number"
        />
        <div class="flex justify-end gap-3 pt-4">
          <UiButton variant="outline" @click="showShippingModal = false">
            Cancel
          </UiButton>
          <UiButton variant="primary" @click="saveShippingDetails">
            Save & Notify Customer
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
  title: 'Fulfillment - Admin',
})

const toast = useToast()

// State
const isLoading = ref(false)
const searchQuery = ref('')
const statusFilter = ref('all')
const deliveryFilter = ref('all')
const showShippingModal = ref(false)
const selectedOrder = ref<any>(null)
const shippingForm = ref({
  carrier: '',
  trackingNumber: '',
})

// Mock orders data (in production, fetch from API)
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
    pickupLocation: {
      name: 'Main Campus Bookstore',
      address: '145 Pavilion Lane, Youngwood, PA 15697',
    },
    createdAt: new Date().toISOString(),
    updatedAt: null,
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
    shippingAddress: {
      name: 'Jane Doe',
      address: '123 Main St, Pittsburgh, PA 15213',
    },
    shippingMethod: 'USPS Priority',
    trackingNumber: null,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 1800000).toISOString(),
  },
  {
    id: 3,
    orderReference: 'ORD-2024-003',
    customerName: 'Mike Johnson',
    email: 'mike.johnson@example.com',
    phone: '(555) 987-6543',
    itemCount: 5,
    total: 280.00,
    status: 'Ready for Pickup',
    deliveryMethod: 'pickup',
    pickupLocation: {
      name: 'Downtown Education Center',
      address: '301 Donner Avenue, Greensburg, PA 15601',
    },
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
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
    if (statusFilter.value !== 'all') {
      const statusMap: Record<string, string[]> = {
        pending: ['Pending'],
        processing: ['Processing'],
        ready: ['Ready for Pickup'],
        fulfilled: ['Fulfilled'],
      }
      if (!statusMap[statusFilter.value]?.includes(order.status)) return false
    }

    // Delivery filter
    if (deliveryFilter.value !== 'all' && order.deliveryMethod !== deliveryFilter.value) {
      return false
    }

    return true
  })
})

// Methods
function refreshOrders() {
  isLoading.value = true
  // In production, fetch from API
  setTimeout(() => {
    isLoading.value = false
    toast.success('Refreshed', 'Orders have been refreshed')
  }, 1000)
}

function markAsProcessing(order: any) {
  order.status = 'Processing'
  order.updatedAt = new Date().toISOString()
  toast.success('Status Updated', `Order ${order.orderReference} is now being processed`)
}

function markReadyForPickup(order: any) {
  order.status = 'Ready for Pickup'
  order.updatedAt = new Date().toISOString()
  toast.success('Ready for Pickup', `Customer will be notified that order ${order.orderReference} is ready`)
}

function markAsFulfilled(order: any) {
  order.status = 'Fulfilled'
  order.updatedAt = new Date().toISOString()
  toast.success('Order Fulfilled', `Order ${order.orderReference} has been marked as fulfilled`)
}

function openShippingModal(order: any) {
  selectedOrder.value = order
  shippingForm.value = {
    carrier: order.shippingMethod || '',
    trackingNumber: order.trackingNumber || '',
  }
  showShippingModal.value = true
}

function saveShippingDetails() {
  if (selectedOrder.value) {
    selectedOrder.value.shippingMethod = shippingForm.value.carrier
    selectedOrder.value.trackingNumber = shippingForm.value.trackingNumber
    selectedOrder.value.updatedAt = new Date().toISOString()
    toast.success('Shipping Updated', 'Customer will receive tracking notification')
  }
  showShippingModal.value = false
}

function sendNotification(order: any) {
  toast.info('Notification Sent', `Email sent to ${order.email}`)
}

function getStatusClasses(status: string) {
  switch (status.toLowerCase()) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'processing':
      return 'bg-blue-100 text-blue-800'
    case 'ready for pickup':
      return 'bg-purple-100 text-purple-800'
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
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}
</script>
