// Auth store using Pinia
// Manages user authentication state

import { defineStore } from 'pinia'

export interface User {
  id: number
  email: string
  name: string
  firstName?: string
  lastName?: string
  role?: string
  walletId?: number
  avatar?: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  loginRedirectUrl: string | null
  sessionToken: string | null
}

// API Response Types
interface LoginResponse {
  success: boolean
  message?: string
  user?: User
  token?: string
}

interface RegisterResponse {
  success: boolean
  message?: string
  user?: User
  token?: string
}

interface SessionResponse {
  authenticated: boolean
  user?: User
}

interface PasswordResponse {
  success: boolean
  message?: string
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    loginRedirectUrl: null,
    sessionToken: null,
  }),

  getters: {
    userName: (state) => state.user?.name || state.user?.email || 'Guest',
    userInitials: (state) => {
      if (!state.user?.name) return 'G'
      const parts = state.user.name.split(' ')
      if (parts.length >= 2 && parts[0] && parts[1]) {
        const firstInitial = parts[0][0] || ''
        const lastInitial = parts[1][0] || ''
        return `${firstInitial}${lastInitial}`.toUpperCase()
      }
      return state.user.name.substring(0, 2).toUpperCase()
    },
    userRole: (state) => state.user?.role || 'guest',
    isAdmin: (state) => state.user?.role === 'admin',
    isStaff: (state) => ['admin', 'staff'].includes(state.user?.role || ''),
  },

  actions: {
    setUser(user: User | null) {
      this.user = user
      this.isAuthenticated = !!user
    },

    setLoading(loading: boolean) {
      this.isLoading = loading
    },

    setLoginRedirect(url: string | null) {
      this.loginRedirectUrl = url
    },

    setSessionToken(token: string | null) {
      this.sessionToken = token
    },

    async login(email: string, password: string): Promise<{ success: boolean; message?: string }> {
      this.isLoading = true

      try {
        const response = await $fetch<LoginResponse>('/api/auth/login', {
          method: 'POST',
          body: { email, password },
        })

        if (response.success && response.user) {
          this.setUser(response.user)
          this.setSessionToken(response.token || null)
          return { success: true }
        } else {
          return { success: false, message: response.message || 'Login failed' }
        }
      } catch (error: any) {
        console.error('Login error:', error)
        return {
          success: false,
          message: error.data?.message || error.message || 'An error occurred during login',
        }
      } finally {
        this.isLoading = false
      }
    },

    async register(data: {
      email: string
      password: string
      firstName: string
      lastName: string
    }): Promise<{ success: boolean; message?: string }> {
      this.isLoading = true

      try {
        const response = await $fetch<RegisterResponse>('/api/auth/register', {
          method: 'POST',
          body: data,
        })

        if (response.success) {
          // Auto-login after registration if user is returned
          if (response.user) {
            this.setUser(response.user)
            this.setSessionToken(response.token || null)
          }
          return { success: true, message: response.message }
        } else {
          return { success: false, message: response.message || 'Registration failed' }
        }
      } catch (error: any) {
        console.error('Registration error:', error)
        return {
          success: false,
          message: error.data?.message || error.message || 'An error occurred during registration',
        }
      } finally {
        this.isLoading = false
      }
    },

    async logout(): Promise<void> {
      try {
        await $fetch('/api/auth/logout', { method: 'POST' })
      } catch (error) {
        console.error('Logout error:', error)
      } finally {
        this.user = null
        this.isAuthenticated = false
        this.sessionToken = null
        this.loginRedirectUrl = null
      }
    },

    async checkSession(): Promise<boolean> {
      try {
        const response = await $fetch<SessionResponse>('/api/auth/session')
        if (response.authenticated && response.user) {
          this.setUser(response.user)
          return true
        }
        this.setUser(null)
        return false
      } catch (error) {
        this.setUser(null)
        return false
      }
    },

    async forgotPassword(email: string): Promise<{ success: boolean; message?: string }> {
      try {
        const response = await $fetch<PasswordResponse>('/api/auth/forgot-password', {
          method: 'POST',
          body: { email },
        })
        return { success: response.success, message: response.message }
      } catch (error: any) {
        return {
          success: false,
          message: error.data?.message || 'Failed to send reset email',
        }
      }
    },

    async resetPassword(
      token: string,
      password: string
    ): Promise<{ success: boolean; message?: string }> {
      try {
        const response = await $fetch<PasswordResponse>('/api/auth/reset-password', {
          method: 'POST',
          body: { token, password },
        })
        return { success: response.success, message: response.message }
      } catch (error: any) {
        return {
          success: false,
          message: error.data?.message || 'Failed to reset password',
        }
      }
    },
  },

  // Persist auth state
  persist: {
    pick: ['user', 'isAuthenticated', 'sessionToken'],
  },
})
