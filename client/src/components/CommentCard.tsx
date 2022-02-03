import Link from 'next/link';
import React from 'react';

import { Comment } from '../types';

export default function CommentCard({ comment }: { comment: Comment }) {
  return (
    <article key={comment.identifier} className='flex my-4 bg-white rounded'>
      <div className="flex-shrink-0 w-10 py-4 text-center bg-gray-200 rounded-l">
        <i className="text-gray-500 fas fa-comment-alt fa-xs"></i>
      </div>
      <section className="w-full p-2">
        <p className="mb-2 text-xs text-gray-500">
          {comment.username}
          <span> commented on </span>
          <Link href={comment.post.url}>
            <a className="font-semibold text-blue-500 cursor-pointer hover:underline">
              {comment.post.title}
            </a>
          </Link>
          <span className="mx-1">•</span>
          <Link href={`/r/${comment.post.subName}`}>
            <a className="text-black cursor-pointer hover:underline">
              /r/{comment.post.subName}
            </a>
          </Link>
        </p>
        <hr />
        <p>{comment.body}</p>
      </section>
    </article>
  )
}