import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useToastStore } from '~/stores/toast'

describe('Toast Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('initial state', () => {
    it('starts with empty toasts array', () => {
      const store = useToastStore()

      expect(store.toasts).toEqual([])
      expect(store.nextId).toBe(1)
    })
  })

  describe('addToast', () => {
    it('adds a toast with default values', () => {
      const store = useToastStore()

      const id = store.addToast({ title: 'Test Toast' })

      expect(id).toBe(1)
      expect(store.toasts.length).toBe(1)
      expect(store.toasts[0]).toMatchObject({
        id: 1,
        type: 'success',
        title: 'Test Toast',
        duration: 4000,
        showActions: false,
        autoClose: true,
      })
    })

    it('adds a toast with custom values', () => {
      const store = useToastStore()

      store.addToast({
        type: 'error',
        title: 'Error Title',
        message: 'Error message',
        duration: 5000,
        showActions: true,
        autoClose: false,
      })

      expect(store.toasts[0]).toMatchObject({
        type: 'error',
        title: 'Error Title',
        message: 'Error message',
        duration: 5000,
        showActions: true,
        autoClose: false,
      })
    })

    it('increments nextId for each toast', () => {
      const store = useToastStore()

      const id1 = store.addToast({ title: 'Toast 1' })
      const id2 = store.addToast({ title: 'Toast 2' })
      const id3 = store.addToast({ title: 'Toast 3' })

      expect(id1).toBe(1)
      expect(id2).toBe(2)
      expect(id3).toBe(3)
      expect(store.nextId).toBe(4)
    })

    it('limits toasts to maximum of 5', () => {
      const store = useToastStore()

      for (let i = 1; i <= 7; i++) {
        store.addToast({ title: `Toast ${i}`, autoClose: false })
      }

      expect(store.toasts.length).toBe(5)
      // Should have toasts 3-7 (oldest ones removed)
      expect(store.toasts[0]?.title).toBe('Toast 3')
      expect(store.toasts[4]?.title).toBe('Toast 7')
    })

    it('auto-removes toast after duration when autoClose is true', () => {
      const store = useToastStore()

      store.addToast({ title: 'Auto Close Toast', duration: 3000 })

      expect(store.toasts.length).toBe(1)

      vi.advanceTimersByTime(3000)

      expect(store.toasts.length).toBe(0)
    })

    it('does not auto-remove when autoClose is false', () => {
      const store = useToastStore()

      store.addToast({ title: 'Persistent Toast', duration: 3000, autoClose: false })

      vi.advanceTimersByTime(5000)

      expect(store.toasts.length).toBe(1)
    })
  })

  describe('removeToast', () => {
    it('removes toast by id', () => {
      const store = useToastStore()

      store.addToast({ title: 'Toast 1', autoClose: false })
      store.addToast({ title: 'Toast 2', autoClose: false })
      store.addToast({ title: 'Toast 3', autoClose: false })

      store.removeToast(2)

      expect(store.toasts.length).toBe(2)
      expect(store.toasts.map(t => t.title)).toEqual(['Toast 1', 'Toast 3'])
    })

    it('does nothing if id not found', () => {
      const store = useToastStore()

      store.addToast({ title: 'Toast 1', autoClose: false })

      store.removeToast(999)

      expect(store.toasts.length).toBe(1)
    })
  })

  describe('clearAllToasts', () => {
    it('removes all toasts', () => {
      const store = useToastStore()

      store.addToast({ title: 'Toast 1', autoClose: false })
      store.addToast({ title: 'Toast 2', autoClose: false })
      store.addToast({ title: 'Toast 3', autoClose: false })

      store.clearAllToasts()

      expect(store.toasts).toEqual([])
    })
  })

  describe('convenience methods', () => {
    it('success() creates success toast', () => {
      const store = useToastStore()

      store.success('Success!', 'Operation completed')

      expect(store.toasts[0]).toMatchObject({
        type: 'success',
        title: 'Success!',
        message: 'Operation completed',
      })
    })

    it('error() creates error toast', () => {
      const store = useToastStore()

      store.error('Error!', 'Something went wrong')

      expect(store.toasts[0]).toMatchObject({
        type: 'error',
        title: 'Error!',
        message: 'Something went wrong',
      })
    })

    it('info() creates info toast', () => {
      const store = useToastStore()

      store.info('Info', 'For your information')

      expect(store.toasts[0]).toMatchObject({
        type: 'info',
        title: 'Info',
        message: 'For your information',
      })
    })

    it('warning() creates warning toast', () => {
      const store = useToastStore()

      store.warning('Warning!', 'Please be careful')

      expect(store.toasts[0]).toMatchObject({
        type: 'warning',
        title: 'Warning!',
        message: 'Please be careful',
      })
    })

    it('convenience methods accept additional options', () => {
      const store = useToastStore()

      store.success('Success!', 'Done', { duration: 10000, showActions: true })

      expect(store.toasts[0]).toMatchObject({
        duration: 10000,
        showActions: true,
      })
    })

    it('convenience methods return toast id', () => {
      const store = useToastStore()

      const id = store.success('Success!')

      expect(id).toBe(1)
    })
  })
})
