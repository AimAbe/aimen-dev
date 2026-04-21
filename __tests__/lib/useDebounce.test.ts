import { describe, it, expect, vi, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useDebounce } from '@/lib/useDebounce'

describe('useDebounce', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('hello', 300))
    expect(result.current).toBe('hello')
  })

  it('debounces value updates', () => {
    vi.useFakeTimers()

    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'hello', delay: 300 } }
    )

    // Update value
    rerender({ value: 'world', delay: 300 })

    // Value should not have changed yet
    expect(result.current).toBe('hello')

    // Fast forward time
    act(() => {
      vi.advanceTimersByTime(300)
    })

    // Now it should be updated
    expect(result.current).toBe('world')

    vi.useRealTimers()
  })

  it('resets timer on rapid changes', () => {
    vi.useFakeTimers()

    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'a', delay: 300 } }
    )

    rerender({ value: 'ab', delay: 300 })
    act(() => { vi.advanceTimersByTime(100) })

    rerender({ value: 'abc', delay: 300 })
    act(() => { vi.advanceTimersByTime(100) })

    // Still the initial value because timer keeps resetting
    expect(result.current).toBe('a')

    // Advance past 300ms from last change
    act(() => { vi.advanceTimersByTime(200) })

    expect(result.current).toBe('abc')

    vi.useRealTimers()
  })
})
