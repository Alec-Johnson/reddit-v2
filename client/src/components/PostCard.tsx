import Link from 'next/link';

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { Post } from '../types';
import axios from 'axios';

dayjs.extend(relativeTime);

const ActionButton = ({ children}) => {
  return <div className='px-1 py-1 mr-2 text-xs text-gray-400 rounded cursor-pointer hover:bg-gray-200'>
    {children}
  </div>
}

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post: { identifier, slug, title, body, subName, createdAt, voteScore, userVote, commentCount, url, username } }: PostCardProps) {
  const handleVote = async (value) => {
    try {
      const res = await axios.post('/misc/vote', {
        identifier,
        slug,
        value
      })
      console.log(res.data)
    } catch(err) {
      console.log(err);
    }
  }
  
  return (
    <article key={identifier} className='flex mb-4 bg-white rounded'>
    {/* Vote Section */}
    <aside className="w-10 py-3 text-center bg-gray-200 rounded-l">
      {/* Upvote */}
      <div className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-red-500" onClick={() => handleVote(1)}>
        <i className={`icon-arrow-up ` + (userVote === 1 && `text-red-500`)}></i>
      </div>
      <p className='text-xs font-bold'>{voteScore}</p>
      {/* Downvote */}
      <div className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-blue-600" onClick={() => handleVote(-1)}>
      <i className={`icon-arrow-down ` + (userVote === -1 && `text-blue-600`)}></i>
      </div>
    </aside>
    {/* Post data section */}
    <section className="w-full p-2">
      <header className="flex items-center">
        <Link href={`/r/${subName}`}>
          <a className='flex items-center cursor-pointer'>
            <img src='https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y' className='w-6 h-6 mr-1 rounded-full' alt={`${username} profile image`} />
            <span className='text-xs font-bold cursor-pointer hover:underline'>
              r/{subName}
            </span>
          </a>
        </Link>
        <p className="text-xs text-gray-600">
          <span className="mx-1 text-gray-500">•</span>
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
