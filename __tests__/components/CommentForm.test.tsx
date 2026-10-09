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

    expect(screen.getByPlaceholderText('Name')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Your comment')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument()
  })

  it('submits the form with correct data', async () => {
    const user = userEvent.setup()
    render(<CommentForm slug="my-post" />)

    await user.type(screen.getByPlaceholderText('Name'), 'Alice')
    await user.type(screen.getByPlaceholderText('Your comment'), 'Great post!')
    await user.click(screen.getByRole('button', { name: 'Submit' }))

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

    await user.type(screen.getByPlaceholderText('Name'), 'Alice')
    await user.type(screen.getByPlaceholderText('Your comment'), 'Nice')
    await user.click(screen.getByRole('button', { name: 'Submit' }))

    await waitFor(() => {
      expect(screen.getByText(/comment submitted/i)).toBeInTheDocument()
    })
  })

  it('shows loading state while submitting', async () => {
    let resolveSubmit: () => void
    global.fetch = vi.fn().mockImplementation(
      () => new Promise((resolve) => { resolveSubmit = () => resolve({ ok: true }) })
    )

    const user = userEvent.setup()
    render(<CommentForm slug="test" />)

    await user.type(screen.getByPlaceholderText('Name'), 'Bob')
    await user.type(screen.getByPlaceholderText('Your comment'), 'Hello')
    await user.click(screen.getByRole('button', { name: 'Submit' }))

    expect(screen.getByRole('button', { name: 'Submitting...' })).toBeDisabled()

    // Resolve the fetch
    await waitFor(() => resolveSubmit!())
  })
})
