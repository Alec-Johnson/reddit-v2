import axios from 'axios'
import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

import { Post } from '../types'

dayjs.extend(relativeTime);

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([])

  useEffect(() => {
    axios.get('/posts')
    .then(res => setPosts(res.data))
    .catch(err => console.log(err))
  }, [])

  return (
    <div className='p-12'>
      <Head>
        <title>Reddit V2: the front page of the internet</title>
      </Head>
      <div className="container flex pt-4">
        {/* Posts feed */}
        <div className="w-160">
          {posts.map(post => (
            <article key={post.identifier} className='flex mb-4 bg-white rounded'>
              {/* Vote Section */}
              <div className="w-10 text-center bg-gray-200 rounded-l">
                <p>V</p>
              </div>
              {/* Post data section */}
              <div className="w-full p-2">
                <div className="flex items-center">
                  <Link href={`/r/${post.subName}`}>
                    <a className='flex items-center cursor-pointer'>
                      <img src='https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y' className='w-6 h-6 mr-1 rounded-full' alt={`${post.username} profile image`} />
                      <span className='text-xs font-bold cursor-pointer hover:underline'>
                        r/{post.subName}
                      </span>
                    </a>
                  </Link>
                  <p className="text-xs text-gray-600">
                    <span className="mx-1 text-gray-500">•</span>
                    Posted by 
                    <Link href={`/u/${post.username}`}>
                      <a className='mx-1 hover:underline'>
                        u/{post.username}
                      </a>
                    </Link>
                    <Link href={post.url}>
                      <a className='mx-1 hover:underline'>
                        {dayjs(post.createdAt).fromNow()}
                      </a>
                    </Link>
                  </p>
                </div>
                <Link href={post.url} passHref>
                  <a className="my-1 text-lg font-medium">{post.title}</a>
                </Link>
                {post.body && 
                  <p className='my-1 text-sm'>{post.body}</p>
                }
                <div className="flex">
                  <Link href={post.url}>
                    <a>
                      <div className="px-1 py-1 mr-2 text-xs text-gray-400 rounded cursor-pointer hover:bg-gray-200">
                        <i className="mr-1 fas fa-comment-alt fa-xs"></i>
                        <span className='font-bold'>20 Comments</span>
                      </div>
                      
                    </a>
                  </Link>
                  <div className="px-1 py-1 mr-2 text-xs text-gray-400 rounded cursor-pointer hover:bg-gray-200">
                        <i className="mr-1 fas fa-share fa-xs"></i>
                        <span className='font-bold'>Share</span>
                      </div>
                      <div className="px-1 py-1 mr-2 text-xs text-gray-400 rounded cursor-pointer hover:bg-gray-200">
                        <i className="mr-1 fas fa-bookmark fa-xs"></i>
                        <span className='font-bold'>Save</span>
                      </div>
                </div>
              </div>
            </article>
          ))}
        </div>
        {/* Sidebar */}
      </div>
    </div>
  )
}

// export const getServerSideProps = async () => {
//   try {
//     const res = await axios.get('/posts')

//     return { props: { posts: res.data } }
//   } catch (err) {
//     return { props: { error: 'Something went wrong' } }
//   }
// }