import dayjs from 'dayjs';
import Link from 'next/link';
import React from 'react';
import { Comment } from '../types';

interface CommentsFeedProps {
  vote: (value: number, comment?: Comment) => Promise<void>;
  comment: Comment;
}

export default function CommentsFeed({ comment, vote }: CommentsFeedProps) {
  return (
    <article className="flex">
      {/* Vote section */}
      <aside className="flex-shrink-0 w-10 py-2 text-center rounded-l">
        {/* Upvote */}
        <div
          className="upvote"
          onClick={() => vote(1, comment)}
        >
          <i className={`icon-arrow-up ` + (comment.userVote === 1 && `text-red-500`)}></i>
        </div>
        <p className="text-xs font-bold">{comment.voteScore}</p>
        {/* Downvote */}
        <div
          className="downvote"
          onClick={() => vote(-1, comment)}
        >
          <i className={`icon-arrow-down ` + (comment.userVote === -1 && `text-blue-600`)}></i>
        </div>
      </aside>
      <div className="py-2 pr-2">
        <p className="mb-1 text-xs leading-none">
          <Link href={`/u/${comment.username}`}>
            <a className="mr-1 font-bold hover:underline">
              {comment.username}
            </a>
          </Link>
          <span className="text-gray-600">
            {`
              ${comment.voteScore}
              points •
              ${dayjs(comment.createdAt).fromNow()}
            `}
          </span>
        </p>
        <p>{comment.body}</p>
      </div>
    </article>
  );
}