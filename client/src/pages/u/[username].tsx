import dayjs from "dayjs";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";

import useSWR from "swr";

import CommentCard from "../../components/CommentCard";
import PostCard from "../../components/PostCard";
import { Comment, Post } from "../../types";

export default function User() {
  const router = useRouter()
  const username = router.query.username

  const { data, error } = useSWR<any>(username ? `/users/${username}` : null)
  if (error) router.push("/")

  if (data) console.log(data);
  
  return ( 
    <>
      <Head>
        <title>{data?.author.username}</title>
      </Head>
      {data && (
        <div className="container flex pt-5">
          <div className="w-160">
            {data.submissions.map((submission: Post | Comment) => {
              if (submission.type === 'Post') {
                return <PostCard key={submission.identifier} post={submission as Post} />
              } else {
                return <CommentCard key={submission.identifier} comment={submission as Comment} />
              }
            })}
          </div>
          <header className="ml-6 w-80">
            <div className="bg-white rounded">
              <div className="flex justify-center p-3 mx-auto overflow-hidden bg-blue-500 rounded-t">
                <Image src='https://www.gravatar.com/avatar/00000000000000000000000000000000' alt={`${data.author.username} profile`} height={64} width={64} className='border-2 border-white rounded-full' />
              </div>
              <div className="p-3 text-center">
                <h1 className='mb-4 text-xl text-center'>{data.author.username}</h1>
                <hr />
                <p className='mt-3'>Joined {dayjs(data.author.createdAt).format('MMM YYYY')}</p>
              </div>
            </div>
          </header>
        </div>
      )}
    </>
  )
}
