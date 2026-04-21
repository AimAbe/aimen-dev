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
      // reaction failed silently — counts stay unchanged
    } finally {
      setLoading(false)
    }
  }

  const getCount = (emoji: string) =>
    reactions.find(r => r.emoji === emoji)?._count ?? 0

  return (
    <div className="flex gap-2 flex-wrap my-10">
      {EMOJIS.map(emoji => {
        const active = reacted.includes(emoji)
        return (
          <button
            key={emoji}
            onClick={() => handleReact(emoji)}
            disabled={active}
            className={`flex items-center gap-1.5 px-3.5 py-2 border rounded-full font-mono text-[13px] transition-all duration-150 ${
              active
                ? 'bg-accent-muted border-accent text-accent cursor-default'
                : 'bg-bg-card border-border text-text-muted cursor-pointer hover:border-accent hover:text-accent'
            }`}
          >
            <span>{emoji}</span>
            {getCount(emoji) > 0 && (
              <span className="text-[11px]">{getCount(emoji)}</span>
            )}
          </button>
        )
      })}
    </div>
  )
}