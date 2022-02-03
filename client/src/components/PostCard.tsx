import Link from 'next/link';
import Image from 'next/image';

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import axios from 'axios';

import ActionButton from './ActionButton';
import { Post } from '../types';

dayjs.extend(relativeTime);

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const { identifier, slug, title, body, subName, createdAt, voteScore, userVote, sub, commentCount, url, username } = post;

  const handleVote = async (value: number) => {
    try {
      await axios.post('/misc/vote', {
        identifier,
        slug,
        value
      });
    } catch(err) {
      throw new Error(`Vote failed, ${err}`);
    }
  }
  
  return (
    <article key={identifier} className='flex mb-4 bg-white rounded'>
      {/* Vote Section */}
      <aside className="w-10 py-3 text-center bg-gray-200 rounded-l">
        {/* Upvote */}
        <div className="upvote" onClick={() => handleVote(1)}>
          <i className={`icon-arrow-up ` + (userVote === 1 && `text-red-500`)}></i>
        </div>
        <p className='text-xs font-bold'>{voteScore}</p>
        {/* Downvote */}
        <div className="downvote" onClick={() => handleVote(-1)}>
          <i className={`icon-arrow-down ` + (userVote === -1 && `text-blue-600`)}></i>
        </div>
      </aside>
      {/* Post data section */}
      <section className="w-full p-2">
        <header className="flex items-center">
          <Link href={`/r/${subName}`}>
            <a className='flex items-center cursor-pointer'>
              {sub &&
                <Image src={sub.imageUrl} placeholder='empty' height={24} width={24} className='rounded-full ' alt={`${username} profile image`} />
              }
              <span className='ml-1 text-xs font-bold cursor-pointer hover:underline'>
                r/{subName}
              </span>
            </a>
          </Link>
          <p className="text-xs text-gray-600">
            <span className="mx-1">•</span>
            Posted by 
            <Link href={`/u/${username}`}>
              <a className='mx-1 hover:underline'>
                u/{username}
              </a>
            </Link>
            <Link href={url}>
              <a className='mx-1 hover:underline'>
                {dayjs(createdAt).fromNow()}
              </a>
            </Link>
          </p>
        </header>
        <Link href={url} passHref>
          <a className="my-1 text-lg font-medium">{title}</a>
        </Link>
        {body && 
          <p className='my-1 text-sm'>{body}</p>
        }
        <footer className="flex">
          <Link href={url}>
            <a>
              <ActionButton>
                <i className="mr-1 fas fa-comment-alt fa-xs"></i>
                <span className='font-bold'>{commentCount} Comments</span>
              </ActionButton>
            </a>
          </Link>
          <ActionButton>
            <i className="mr-1 fas fa-share fa-xs"></i>
            <span className='font-bold'>Share</span>
          </ActionButton>
          <ActionButton>
            <i className="mr-1 fas fa-bookmark fa-xs"></i>
            <span className='font-bold'>Save</span>
          </ActionButton>
        </footer>
      </section>
    </article>
  );
}
