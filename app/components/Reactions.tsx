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
      .then(r => r.json())
      .then(setReactions)
  }, [postId])

  const handleReact = async (emoji: string) => {
    if (loading) return
    setLoading(true)

    const res = await fetch('/api/reactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId, emoji })
    })

    const updated = await res.json()
    setReactions(updated)
    setReacted(prev => [...prev, emoji])
    setLoading(false)
  }

  const getCount = (emoji: string) =>
    reactions.find(r => r.emoji === emoji)?._count ?? 0

  return (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', margin: '40px 0' }}>
      {EMOJIS.map(emoji => (
        <button
          key={emoji}
          onClick={() => handleReact(emoji)}
          disabled={reacted.includes(emoji)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 14px',
            background: reacted.includes(emoji) ? 'rgba(200,255,87,0.1)' : '#13131a',
            border: `1px solid ${reacted.includes(emoji) ? '#c8ff57' : '#1e1e2a'}`,
            borderRadius: '999px',
            cursor: reacted.includes(emoji) ? 'default' : 'pointer',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '13px',
            color: reacted.includes(emoji) ? '#c8ff57' : '#6b6880',
            transition: 'all 0.15s ease'
          }}
        >
          <span>{emoji}</span>
          {getCount(emoji) > 0 && (
            <span style={{ fontSize: '11px' }}>{getCount(emoji)}</span>
          )}
        </button>
      ))}
    </div>
  )
}