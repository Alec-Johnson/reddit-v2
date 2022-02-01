import axios from "axios";
import dayjs from "dayjs";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { ChangeEvent, createRef } from "react";

import useSWR from "swr";

import CommentCard from "../../components/CommentCard";
import PostCard from "../../components/PostCard";
import { Comment, Post, User as IUser } from "../../types";

export default function User() {
  const router = useRouter()
  const username = router.query.username

  const fileUploadRef = createRef<HTMLInputElement>();

  const { data, error, mutate } = useSWR<any>(username ? `/users/${username}` : null)
  if (error) router.push("/")

  if (data) console.log(data);

  const openFileUpload = (type: string) => {
    // if (!ownSub) return
    fileUploadRef.current.name = type
    fileUploadRef.current.click()
  }

  const uploadImage = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files[0]

    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', fileUploadRef.current.name)

    try {
      await axios.post<IUser>(`/users/${username}/image`, formData, {
        headers: {'Content-Type': 'multipart/form-data'}
      })
      mutate()
    } catch (err) {
      console.log(err);
    }
  }
  
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
                <input type="file" hidden ref={fileUploadRef} onChange={uploadImage} />
                <Image 
                  src={data.author.imageUrl} 
                  alt={`${data.author.username} profile`} 
                  height={64} width={64} 
                  className='border-2 border-white rounded-full' 
                  onClick={() => openFileUpload('profileImage')}
                />
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
