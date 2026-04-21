import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Reactions from '@/app/components/Reactions'

describe('Reactions', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    global.fetch = vi.fn()
  })

  it('renders all 5 emoji buttons', async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce({
      json: () => Promise.resolve([]),
    } as any)

    render(<Reactions postId={1} />)

    await waitFor(() => {
      expect(screen.getByText('❤️')).toBeInTheDocument()
      expect(screen.getByText('🔥')).toBeInTheDocument()
      expect(screen.getByText('🤔')).toBeInTheDocument()
      expect(screen.getByText('👏')).toBeInTheDocument()
      expect(screen.getByText('💡')).toBeInTheDocument()
    })
  })

  it('displays reaction counts', async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce({
      json: () => Promise.resolve([
        { emoji: '❤️', _count: 3 },
        { emoji: '🔥', _count: 1 },
      ]),
    } as any)

    render(<Reactions postId={1} />)

    await waitFor(() => {
      expect(screen.getByText('3')).toBeInTheDocument()
      expect(screen.getByText('1')).toBeInTheDocument()
    })
  })

  it('sends reaction on click and disables button', async () => {
    const user = userEvent.setup()

    // Initial load
    vi.mocked(global.fetch).mockResolvedValueOnce({
      json: () => Promise.resolve([]),
    } as any)

    // POST reaction response
    vi.mocked(global.fetch).mockResolvedValueOnce({
      json: () => Promise.resolve([{ emoji: '❤️', _count: 1 }]),
    } as any)

    render(<Reactions postId={42} />)

    await waitFor(() => {
      expect(screen.getByText('❤️')).toBeInTheDocument()
    })

    // Click the heart button
    const heartButton = screen.getByText('❤️').closest('button')!
    await user.click(heartButton)

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/reactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId: 42, emoji: '❤️' }),
      })
    })

    // Button should be disabled after reacting
    await waitFor(() => {
      expect(heartButton).toBeDisabled()
    })
  })

  it('fetches reactions on mount', async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce({
      json: () => Promise.resolve([]),
    } as any)

    render(<Reactions postId={5} />)

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/reactions?postId=5')
    })
  })
})
