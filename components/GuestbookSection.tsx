'use client';

import React, { useState } from 'react';
import { MessageSquare, Pin, Send, Trash2, CheckCircle2 } from 'lucide-react';

interface CommentItem {
  id: string;
  authorName: string;
  authorAvatar?: string | null;
  message: string;
  isPinned: boolean;
  createdAt: string | Date;
}

interface GuestbookSectionProps {
  profileId: string;
  initialComments: CommentItem[];
  isOwner?: boolean;
  accentColor?: string;
}

export default function GuestbookSection({
  profileId,
  initialComments = [],
  isOwner = false,
  accentColor = '#00f0ff',
}: GuestbookSectionProps) {
  const [comments, setComments] = useState<CommentItem[]>(initialComments);
  const [authorName, setAuthorName] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ text: string; error?: boolean } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !message.trim()) return;

    setSubmitting(true);
    setStatusMsg(null);

    try {
      const res = await fetch('/api/guestbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profileId,
          authorName: authorName.trim(),
          message: message.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setStatusMsg({ text: data.error || 'Failed to post message', error: true });
      } else {
        setComments([data.comment, ...comments]);
        setMessage('');
        setStatusMsg({ text: 'Message posted successfully!' });
        setTimeout(() => setStatusMsg(null), 3000);
      }
    } catch (err) {
      setStatusMsg({ text: 'Network error. Please try again.', error: true });
    } finally {
      setSubmitting(false);
    }
  };

  const handlePin = async (commentId: string, currentPin: boolean) => {
    try {
      const res = await fetch('/api/guestbook', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commentId, isPinned: !currentPin }),
      });
      if (res.ok) {
        setComments(
          comments.map((c) => (c.id === commentId ? { ...c, isPinned: !currentPin } : c))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    try {
      const res = await fetch(`/api/guestbook?id=${commentId}`, { method: 'DELETE' });
      if (res.ok) {
        setComments(comments.filter((c) => c.id !== commentId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4" style={{ color: accentColor }} />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Guestbook</h3>
        </div>
        <span className="text-xs text-zinc-400">{comments.length} messages</span>
      </div>

      {/* Input form */}
      <form
        onSubmit={handleSubmit}
        className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-2.5"
      >
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Your name / alias"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            maxLength={30}
            required
            className="w-1/3 px-3 py-2 text-xs rounded-xl bg-black/40 border border-white/10 text-white placeholder:text-zinc-500 focus:outline-none focus:border-cyan-400 transition-colors"
          />
          <input
            type="text"
            placeholder="Leave a message or sign this profile..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={250}
            required
            className="flex-1 px-3 py-2 text-xs rounded-xl bg-black/40 border border-white/10 text-white placeholder:text-zinc-500 focus:outline-none focus:border-cyan-400 transition-colors"
          />
          <button
            type="submit"
            disabled={submitting}
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-black flex items-center justify-center gap-1.5 transition-transform hover:scale-105 disabled:opacity-50"
            style={{ background: accentColor }}
          >
            <Send className="w-3.5 h-3.5" />
            <span>Sign</span>
          </button>
        </div>

        {statusMsg && (
          <p
            className={`text-[11px] ${
              statusMsg.error ? 'text-rose-400' : 'text-emerald-400'
            } flex items-center gap-1`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            {statusMsg.text}
          </p>
        )}
      </form>

      {/* Comments List */}
      <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
        {comments.length === 0 ? (
          <div className="text-center py-6 text-xs text-zinc-500 italic">
            No guestbook messages yet. Be the first to leave one!
          </div>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className={`p-3 rounded-xl border text-xs transition-all relative ${
                comment.isPinned
                  ? 'bg-purple-950/20 border-purple-500/40 shadow-sm'
                  : 'bg-white/5 border-white/5 hover:border-white/10'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white">{comment.authorName}</span>
                  {comment.isPinned && (
                    <span className="flex items-center gap-0.5 text-[10px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 font-semibold border border-purple-500/30">
                      <Pin className="w-2.5 h-2.5" />
                      Pinned
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-zinc-400">
                    {new Date(comment.createdAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>

                  {isOwner && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handlePin(comment.id, comment.isPinned)}
                        title={comment.isPinned ? 'Unpin' : 'Pin to top'}
                        className="p-1 text-zinc-400 hover:text-purple-400"
                      >
                        <Pin className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleDelete(comment.id)}
                        title="Delete comment"
                        className="p-1 text-zinc-400 hover:text-rose-400"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <p className="text-zinc-300 break-words leading-relaxed">{comment.message}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
