import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CommentForm from '@/app/components/CommentForm'

describe('CommentForm', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    global.fetch = vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve({}) })
  })

  it('renders the form with name and comment fields', () => {
    render(<CommentForm slug="test-post" />)

    expect(screen.getByPlaceholderText("who's writing")).toBeInTheDocument()
    expect(screen.getByPlaceholderText('markdown ok')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '[ submit ]' })).toBeInTheDocument()
  })

  it('submits the form with correct data', async () => {
    const user = userEvent.setup()
    render(<CommentForm slug="my-post" />)

    await user.type(screen.getByPlaceholderText("who's writing"), 'Alice')
    await user.type(screen.getByPlaceholderText('markdown ok'), 'Great post!')
    await user.click(screen.getByRole('button', { name: '[ submit ]' }))

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: 'my-post', author: 'Alice', content: 'Great post!' }),
      })
    })
  })

  it('shows success message after submission', async () => {
    const user = userEvent.setup()
    render(<CommentForm slug="test" />)

    await user.type(screen.getByPlaceholderText("who's writing"), 'Alice')
    await user.type(screen.getByPlaceholderText('markdown ok'), 'Nice')
    await user.click(screen.getByRole('button', { name: '[ submit ]' }))

    await waitFor(() => {
      expect(screen.getByText(/comment queued/i)).toBeInTheDocument()
    })
  })

  it('shows loading state while submitting', async () => {
    let resolveSubmit: () => void
    global.fetch = vi.fn().mockImplementation(
      () => new Promise((resolve) => { resolveSubmit = () => resolve({ ok: true }) })
    )

    const user = userEvent.setup()
    render(<CommentForm slug="test" />)

    await user.type(screen.getByPlaceholderText("who's writing"), 'Bob')
    await user.type(screen.getByPlaceholderText('markdown ok'), 'Hello')
    await user.click(screen.getByRole('button', { name: '[ submit ]' }))

    expect(screen.getByRole('button', { name: '[ submitting... ]' })).toBeDisabled()

    // Resolve the fetch
    await waitFor(() => resolveSubmit!())
  })
})
