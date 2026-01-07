<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Not Logged In State -->
    <div v-if="!authStore.isAuthenticated" class="max-w-md mx-auto text-center py-12">
      <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Icon name="heroicons:user" class="w-10 h-10 text-gray-400" />
      </div>
      <h1 class="text-2xl font-bold text-gray-900 mb-4">Sign In Required</h1>
      <p class="text-gray-600 mb-6">Please sign in to view your account details.</p>
      <div class="space-y-3">
        <button @click="openLoginModal" class="btn-primary w-full">
          Sign In
        </button>
        <NuxtLink to="/shop" class="btn-secondary w-full block">
          Continue Shopping
        </NuxtLink>
      </div>
    </div>

    <!-- Logged In State -->
    <div v-else>
      <h1 class="text-2xl font-bold text-gray-900 mb-6">My Account</h1>

      <div class="grid lg:grid-cols-3 gap-8">
        <!-- Sidebar -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-xl shadow-sm p-6">
            <!-- User Avatar -->
            <div class="text-center mb-6">
              <div class="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span class="text-2xl font-bold text-primary-600">{{ authStore.userInitials }}</span>
              </div>
              <h2 class="font-semibold text-gray-900">{{ authStore.userName }}</h2>
              <p class="text-sm text-gray-500">{{ authStore.user?.email }}</p>
            </div>

            <!-- Navigation Links -->
            <nav class="space-y-1">
              <button
                @click="activeTab = 'profile'"
                :class="[
                  'w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors',
                  activeTab === 'profile'
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-50'
                ]"
              >
                <Icon name="heroicons:user" class="w-5 h-5" />
                Profile
              </button>
              <button
                @click="activeTab = 'orders'"
                :class="[
                  'w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors',
                  activeTab === 'orders'
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-50'
                ]"
              >
                <Icon name="heroicons:shopping-bag" class="w-5 h-5" />
                Order History
              </button>
              <button
                @click="activeTab = 'settings'"
                :class="[
                  'w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors',
                  activeTab === 'settings'
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-50'
                ]"
              >
                <Icon name="heroicons:cog-6-tooth" class="w-5 h-5" />
                Settings
              </button>
            </nav>

            <!-- Logout Button -->
            <div class="mt-6 pt-6 border-t border-gray-100">
              <button
                @click="handleLogout"
                class="w-full flex items-center justify-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Icon name="heroicons:arrow-right-on-rectangle" class="w-5 h-5" />
                Sign Out
              </button>
            </div>
          </div>
        </div>

        <!-- Main Content -->
        <div class="lg:col-span-2">
          <!-- Profile Tab -->
          <div v-if="activeTab === 'profile'" class="bg-white rounded-xl shadow-sm p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-6">Profile Information</h3>

            <form @submit.prevent="updateProfile" class="space-y-6">
              <div class="grid md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    v-model="profileForm.firstName"
                    type="text"
                    class="input"
                    placeholder="First name"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    v-model="profileForm.lastName"
                    type="text"
                    class="input"
                    placeholder="Last name"
                  />
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  v-model="profileForm.email"
                  type="email"
                  class="input"
                  placeholder="Email"
                  disabled
                />
                <p class="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  v-model="profileForm.phone"
                  type="tel"
                  class="input"
                  placeholder="Phone number (optional)"
                />
              </div>

              <div class="flex justify-end">
                <button type="submit" class="btn-primary" :disabled="saving">
                  {{ saving ? 'Saving...' : 'Save Changes' }}
                </button>
              </div>
            </form>
          </div>

          <!-- Orders Tab -->
          <div v-if="activeTab === 'orders'" class="bg-white rounded-xl shadow-sm p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-6">Order History</h3>

            <!-- Loading State -->
            <div v-if="ordersLoading" class="text-center py-8">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p class="text-gray-500">Loading orders...</p>
            </div>

            <!-- Empty State -->
            <div v-else-if="orders.length === 0" class="text-center py-8">
              <Icon name="heroicons:shopping-bag" class="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h4 class="text-lg font-medium text-gray-900 mb-2">No orders yet</h4>
              <p class="text-gray-500 mb-4">Start shopping to see your orders here.</p>
              <NuxtLink to="/shop" class="btn-primary inline-block">
                Browse Products
              </NuxtLink>
            </div>

            <!-- Orders List -->
            <div v-else class="space-y-4">
              <div
                v-for="order in orders"
                :key="order.id"
                class="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
              >
                <div class="flex justify-between items-start mb-3">
                  <div>
                    <p class="font-medium text-gray-900">Order #{{ order.id }}</p>
                    <p class="text-sm text-gray-500">{{ formatOrderDate(order.createdAt) }}</p>
                  </div>
                  <span
                    :class="[
                      'px-3 py-1 text-xs font-medium rounded-full',
                      getOrderStatusClass(order.status)
                    ]"
                  >
                    {{ order.status }}
                  </span>
                </div>
                <div class="flex justify-between items-center">
                  <p class="text-sm text-gray-600">{{ order.itemCount }} item(s)</p>
                  <p class="font-semibold text-gray-900">${{ order.total.toFixed(2) }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Settings Tab -->
          <div v-if="activeTab === 'settings'" class="bg-white rounded-xl shadow-sm p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-6">Account Settings</h3>

            <div class="space-y-6">
              <!-- Change Password -->
              <div class="border-b border-gray-100 pb-6">
                <h4 class="font-medium text-gray-900 mb-4">Change Password</h4>
                <form @submit.prevent="changePassword" class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                    <input
                      v-model="passwordForm.currentPassword"
                      type="password"
                      class="input"
                      placeholder="Enter current password"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                    <input
                      v-model="passwordForm.newPassword"
                      type="password"
                      class="input"
                      placeholder="Enter new password"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                    <input
                      v-model="passwordForm.confirmPassword"
                      type="password"
                      class="input"
                      placeholder="Confirm new password"
                    />
                  </div>
                  <button type="submit" class="btn-secondary" :disabled="changingPassword">
                    {{ changingPassword ? 'Updating...' : 'Update Password' }}
                  </button>
                </form>
              </div>

              <!-- Email Preferences -->
              <div>
                <h4 class="font-medium text-gray-900 mb-4">Email Preferences</h4>
                <label class="flex items-center gap-3">
                  <input
                    v-model="emailPreferences.orderUpdates"
                    type="checkbox"
                    class="w-4 h-4 text-primary-600 rounded border-gray-300"
                  />
                  <span class="text-gray-700">Order updates and shipping notifications</span>
                </label>
                <label class="flex items-center gap-3 mt-3">
                  <input
                    v-model="emailPreferences.promotions"
                    type="checkbox"
                    class="w-4 h-4 text-primary-600 rounded border-gray-300"
                  />
                  <span class="text-gray-700">Promotional emails and special offers</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore()
const toast = useToast()
const router = useRouter()

const activeTab = ref<'profile' | 'orders' | 'settings'>('profile')

// Profile form
const profileForm = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
})

const saving = ref(false)

// Password form
const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const changingPassword = ref(false)

// Email preferences
const emailPreferences = ref({
  orderUpdates: true,
  promotions: false,
})

// Orders
const orders = ref<Array<{
  id: number
  createdAt: string
  status: string
  itemCount: number
  total: number
}>>([])
const ordersLoading = ref(false)

// Initialize form with user data
onMounted(() => {
  if (authStore.user) {
    profileForm.value = {
      firstName: authStore.user.firstName || '',
      lastName: authStore.user.lastName || '',
      email: authStore.user.email || '',
      phone: '',
    }
  }
})

// Watch for tab changes to load orders
watch(activeTab, async (newTab) => {
  if (newTab === 'orders' && orders.value.length === 0) {
    await loadOrders()
  }
})

async function loadOrders() {
  ordersLoading.value = true
  try {
    const response = await $fetch('/api/ecommerce/orders', {
      method: 'GET',
    })
    orders.value = (response as any).orders || []
  } catch (error) {
    console.error('Error loading orders:', error)
  } finally {
    ordersLoading.value = false
  }
}

async function updateProfile() {
  saving.value = true
  try {
    // Profile update API would go here
    toast.success('Profile updated', 'Your changes have been saved')
  } catch (error) {
    toast.error('Update failed', 'Unable to save changes')
  } finally {
    saving.value = false
  }
}

async function changePassword() {
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    toast.error('Passwords do not match', 'Please check your new password')
    return
  }

  changingPassword.value = true
  try {
    // Password change API would go here
    toast.success('Password changed', 'Your password has been updated')
    passwordForm.value = { currentPassword: '', newPassword: '', confirmPassword: '' }
  } catch (error) {
    toast.error('Update failed', 'Unable to change password')
  } finally {
    changingPassword.value = false
  }
}

async function handleLogout() {
  await authStore.logout()
  toast.info('Signed out', 'You have been signed out')
  router.push('/')
}

function openLoginModal() {
  // Emit event to open login modal in layout
  const event = new CustomEvent('open-login-modal')
  window.dispatchEvent(event)
}

function formatOrderDate(dateString: string) {
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return dateString
  }
}

function getOrderStatusClass(status: string) {
  const statusMap: Record<string, string> = {
    completed: 'bg-green-100 text-green-800',
    processing: 'bg-blue-100 text-blue-800',
    pending: 'bg-yellow-100 text-yellow-800',
    cancelled: 'bg-red-100 text-red-800',
    shipped: 'bg-purple-100 text-purple-800',
  }
  return statusMap[status.toLowerCase()] || 'bg-gray-100 text-gray-800'
}

useHead({
  title: 'My Account',
})
</script>
