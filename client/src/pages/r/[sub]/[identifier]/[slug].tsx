import { useContext, useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Image from 'next/image'

import useSWR from 'swr'
import axios from 'axios'

import { AuthContext } from '../../../../context/auth-context'
import Sidebar from '../../../../components/Sidebar'
import SinglePost from '../../../../components/SinglePost'
import CommentsFeed from '../../../../components/CommentsFeed'
import CommentInput from '../../../../components/CommentInput'
import { Post, Comment } from '../../../../types'

export default function PostPage() {
  // Local state
  const [description, setDescription] = useState('')
  // Global state
  const { authenticated, user } = useContext(AuthContext)
  // Utils
  const router = useRouter()
  const { identifier, sub, slug } = router.query

  const { data: post, error, mutate: mutatePost } = useSWR<Post>(
    (identifier && slug) ? `/posts/${identifier}/${slug}` : null
  )

  const { data: comments, mutate: mutateComment } = useSWR<Comment[]>(
    (identifier && slug) ? `/posts/${identifier}/${slug}/comments` : null
  )

  if (error) router.push('/')

  useEffect(() => {
    if (!post) return
    let desc = post.body || post.title
    desc = desc.substring(0, 158).concat('..') // {Description}..
    setDescription(desc)
  }, [post])

  const vote = async (value: number, comment?: Comment) => {
    // If not logged in go to login
    if (!authenticated) router.push('/login')

    // If existing vote on comment or post is the same, reset vote
    if (
      (!comment && value === post.userVote) ||
      (comment && comment.userVote === value)
    ) { value = 0 }

    try {
      // If comment is undefined, commentIdentifier will be null and vote will be cast on post
      await axios.post('/misc/vote', {
        identifier,
        slug,
        commentIdentifier: comment?.identifier,
        value,
      })

      if (!comment) { mutatePost() } else { mutateComment() }
    } catch (err) {
      console.log(err)
    }
  }
  
  return (
    <>
      <Head>
        <title>{post?.title}</title>
        <meta name="description" content={description} />
        <meta property="og:description" content={description} />
        <meta property="og:title" content={post?.title} />
        <meta property="twitter:description" content={description} />
        <meta property="twitter:title" content={post?.title} />
      </Head>
      <Link href={`/r/${sub}`}>
        <a>
          {post && (
          <div className="flex items-center w-full h-20 p-8 bg-blue-500">
            <div className="container flex">
              <div className="w-8 h-8 mr-2 overflow-hidden rounded-full">
                <Image
                  src={post.sub.imageUrl}
                  height={32}                    
                  width={32}
                />
              </div>
              <p className="text-xl font-semibold text-white">/r/{sub}</p>
            </div>
          </div>
          )}
        </a>
      </Link>
      <div className="container flex pt-5 ">
        {/* Post */}
        <div className="w-160">
          <section className="bg-white rounded dark:bg-slate-600">
            {post && (
              <>
                <SinglePost vote={vote} post={post} />
                <CommentInput mutate={mutateComment} username={user?.username} authenticated={authenticated} identifier={post.identifier} slug={post.slug}  />
                <hr />
                {comments?.map((comment) => (
                  <CommentsFeed vote={vote} comment={comment} key={comment.identifier} />
                ))}
              </>
            )}
          </section>
        </div>
        {/* Sidebar */}
        {post && <Sidebar sub={post.sub} />}
      </div>
    </>
  )
}