import Link from 'next/link';
import React, { FormEvent, useState } from 'react';

import axios from 'axios';
import { KeyedMutator } from 'swr';

import { Comment } from '../types';

interface CommentInputProps {
  authenticated: boolean;
  mutate: KeyedMutator<Comment[]>;
  slug: string; // post.slug
  identifier: string; // post.identifier
  username: string; // user.username
}

export default function CommentInput({ authenticated, username, mutate, identifier, slug}: CommentInputProps) {
  const [newComment, setNewComment] = useState('')

  const submitComment = async (event: FormEvent) => {
    event.preventDefault()
    if (newComment.trim() === '') return

    try {
      await axios.post(`/posts/${identifier}/${slug}/comments`, {
        body: newComment,
      })
      
      setNewComment('')
      mutate()
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <aside className="pl-10 pr-6 mb-4">
      {authenticated ? (
        <>
          <p className="mb-1 text-xs">
            Comment as{' '}
            <Link href={`/u/${username}`}>
              <a className="font-semibold text-blue-500">
                {username}
              </a>
            </Link>
          </p>
          <form onSubmit={submitComment}>
            <textarea
              className="w-full p-3 text-sm border border-gray-300 rounded focus:outline-none focus:border-gray-600"
              onChange={(e) => setNewComment(e.target.value)}
              value={newComment}
              placeholder='Let us know what you think...'
            ></textarea>
            <div className="flex justify-end">
              <button
                className="px-3 py-1 blue button"
                disabled={newComment.trim() === ''}
              >
                Comment
              </button>
            </div>
          </form>
        </>
      ) : (
        <div className="flex items-center justify-between px-2 py-4 border border-gray-200 rounded">
          <p className="font-semibold text-gray-400">
            Log in or sign up to leave a comment
          </p>
          <div>
            <Link href="/login">
              <a className="px-4 py-1 mr-4 hollow blue button">
                Login
              </a>
            </Link>
            <Link href="/register">
              <a className="px-4 py-1 blue button">Sign Up</a>
            </Link>
          </div>
        </div>
      )}
    </aside>
  )
}
