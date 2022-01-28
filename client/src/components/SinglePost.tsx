import Link from "next/link";
import { Comment, Post } from "../types";
import ActionButton from "./ActionButton";

import dayjs from 'dayjs';

interface SinglePostProps {
  vote: (value: number) => Promise<void>;
  post: Post;
}

export default function SinglePost({ post, vote }: SinglePostProps) {
  return (
    <article className="flex">
    {/* Vote section */}
      <aside className="flex-shrink-0 w-10 py-2 text-center rounded-l">
        {/* Upvote */}
        <div
          className="upvote"
          onClick={() => vote(1)}
        >
          <i className={`icon-arrow-up ` + (post.userVote === 1 && `text-red-500`)}></i>
        </div>
        <p className="text-xs font-bold">{post.voteScore}</p>
        {/* Downvote */}
        <div
          className="downvote"
          onClick={() => vote(-1)}
        >
          <i className={`icon-arrow-down ` + (post.userVote === -1 && `text-blue-600`)}></i>
        </div>
      </aside>
      <div className="py-2 pr-2">
        <div className="flex items-center">
          <p className="text-xs text-gray-500">
            Posted by
            <Link href={`/u/${post.username}`}>
              <a className="mx-1 hover:underline">
                /u/{post.username}
              </a>
            </Link>
            <Link href={post.url}>
              <a className="mx-1 hover:underline">
                {dayjs(post.createdAt).fromNow()}
              </a>
            </Link>
          </p>
        </div>
        {/* Post title */}
        <h1 className="my-1 text-xl font-medium">{post.title}</h1>
        {/* Post body */}
        <p className="my-3 text-sm">{post.body}</p>
        {/* Actions */}
        <div className="flex">
          <Link href={post.url}>
            <a>
              <ActionButton>
                <i className="mr-1 fas fa-comment-alt fa-xs"></i>
                <span className="font-bold">
                  {post.commentCount} Comments
                </span>
              </ActionButton>
            </a>
          </Link>
          <ActionButton>
            <i className="mr-1 fas fa-share fa-xs"></i>
            <span className="font-bold">Share</span>
          </ActionButton>
          <ActionButton>
            <i className="mr-1 fas fa-bookmark fa-xs"></i>
            <span className="font-bold">Save</span>
          </ActionButton>
        </div>
      </div>
    </article>
  )
}
