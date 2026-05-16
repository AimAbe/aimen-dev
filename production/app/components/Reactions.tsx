'use client'
import { useState, useEffect } from 'react'

const EMOJIS = ['❤️', '🔥', '🤔', '👏', '💡']

type ReactionCount = {
  emoji: string
  _count: number
}

export default function Reactions({ postId }: { postId: number }) {
  const [reactions, setReactions] = useState<ReactionCount[]>([])
  const [reacted, setReacted] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch(`/api/reactions?postId=${postId}`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(setReactions)
      .catch(() => {})
  }, [postId])

  const handleReact = async (emoji: string) => {
    if (loading) return
    setLoading(true)
    try {
      const res = await fetch('/api/reactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, emoji })
      })
      if (!res.ok) throw new Error()
      const updated = await res.json()
      setReactions(updated)
      setReacted(prev => [...prev, emoji])
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }

  const getCount = (emoji: string) =>
    reactions.find(r => r.emoji === emoji)?._count ?? 0

  return (
    <div className="reactions">
      {EMOJIS.map(emoji => {
        const active = reacted.includes(emoji)
        const count = getCount(emoji)
        return (
          <button
            key={emoji}
            onClick={() => handleReact(emoji)}
            disabled={active}
            className={`reaction ${active ? 'is-on' : ''}`}
            aria-label={`react with ${emoji}`}
          >
            <span>{emoji}</span>
            {count > 0 && <span className="count">{count}</span>}
          </button>
        )
      })}
    </div>
  )
}
