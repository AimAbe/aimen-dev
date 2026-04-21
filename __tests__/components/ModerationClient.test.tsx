import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ModerationClient from '@/app/components/ModerationClient'

describe('ModerationClient', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    global.fetch = vi.fn().mockResolvedValue({ ok: true })
  })

  const mockComments = [
    { id: 1, author: 'Alice', content: 'Pending 1', postSlug: 'post-1', createdAt: '2025-01-01' },
    { id: 2, author: 'Bob', content: 'Pending 2', postSlug: 'post-2', createdAt: '2025-01-02' },
  ]

  it('renders pending comments', () => {
    render(<ModerationClient initialComments={mockComments} />)

    expect(screen.getByText('Pending 1')).toBeInTheDocument()
    expect(screen.getByText('Pending 2')).toBeInTheDocument()
    expect(screen.getByText('post-1')).toBeInTheDocument()
    expect(screen.getByText('post-2')).toBeInTheDocument()
  })

  it('shows empty state when no comments', () => {
    render(<ModerationClient initialComments={[]} />)

    expect(screen.getByText('No pending comments.')).toBeInTheDocument()
  })

  it('approves a comment and removes it from the list', async () => {
    const user = userEvent.setup()
    render(<ModerationClient initialComments={mockComments} />)

    const approveButtons = screen.getAllByRole('button', { name: 'Approve' })
    await user.click(approveButtons[0])

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/comments/1', { method: 'PATCH' })
    })

    await waitFor(() => {
      expect(screen.queryByText('Pending 1')).not.toBeInTheDocument()
      expect(screen.getByText('Pending 2')).toBeInTheDocument()
    })
  })

  it('deletes a comment and removes it from the list', async () => {
    const user = userEvent.setup()
    render(<ModerationClient initialComments={mockComments} />)

    const deleteButtons = screen.getAllByRole('button', { name: 'Delete' })
    await user.click(deleteButtons[0])

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/comments/1', { method: 'DELETE' })
    })

    await waitFor(() => {
      expect(screen.queryByText('Pending 1')).not.toBeInTheDocument()
    })
  })

  it('shows empty state after all comments are moderated', async () => {
    const user = userEvent.setup()
    render(<ModerationClient initialComments={[mockComments[0]]} />)

    const approveButton = screen.getByRole('button', { name: 'Approve' })
    await user.click(approveButton)

    await waitFor(() => {
      expect(screen.getByText('No pending comments.')).toBeInTheDocument()
    })
  })
})
