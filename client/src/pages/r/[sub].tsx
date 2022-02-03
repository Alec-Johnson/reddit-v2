import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { ChangeEvent, createRef, Fragment, useContext, useEffect, useState } from "react";

import axios from "axios";
import useSWR from "swr";

import { AuthContext } from "../../context/auth-context";

import PostCard from "../../components/PostCard";
import Sidebar from "../../components/Sidebar";
import { Post, Sub as ISub } from "../../types";


export default function Sub(){
  // Local state
  const [ownSub, setOwnSub] = useState(false);
  // Global state
  const { authenticated, user } = useContext(AuthContext);
  // Utils
  const router = useRouter();
  const fileUploadRef = createRef<HTMLInputElement>();

  const subName = router.query.sub;

  // https://swr.vercel.app/docs/conditional-fetching
  const { data: sub, error, mutate} = useSWR<ISub>(subName ? `/subs/${subName}` : null);
  
  useEffect(() => {
    if (!sub) return
    setOwnSub(authenticated && user.username === sub.username)
    console.log(sub);
    
  }, [sub])

  const openFileUpload = (type: string) => {
    if (!ownSub) return
    fileUploadRef.current.name = type
    fileUploadRef.current.click()
  }

  const uploadImage = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files[0]

    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', fileUploadRef.current.name)

    try {
      await axios.post<ISub>(`/subs/${sub.name}/image`, formData, {
        headers: {'Content-Type': 'multipart/form-data'}
      })
      mutate()
    } catch (err) {
      throw new Error(`Upload failed, ${err}`);
    }
  }
  
  if (error) router.push('/')

  let postsMarkup: JSX.Element[] | JSX.Element;
  if (!sub) {
    postsMarkup = <p>Loading...</p>
  } else if (sub.posts.length === 0) {
    postsMarkup = <p>Nothing has been submitted yet</p>
  } else {
    postsMarkup = sub.posts.map((post: Post) => (
      <PostCard key={post.identifier} post={post} />
    ))
  }

  return (
    <div>
      <Head>
        <title>{sub?.title}</title>
      </Head>
      {sub && (
        <Fragment>
          <input type='file' hidden ref={fileUploadRef} onChange={uploadImage} />
          {/* Sub info & images */}
          <header>
            {/* Banner image */}
            <div className={`bg-blue-500 ${ownSub && 'cursor-pointer'}`}>
              {sub.bannerUrl ? (
                <div className="relative w-full h-56">
                  <Image 
                    src={sub.bannerUrl}
                    alt='Sub banner'
                    onClick={() => openFileUpload('banner')}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
              ) : (
                <div className="h-20 bg-blue-500"></div>
              )}
            </div>
            {/* Sub meta data */}
            <div className="h-20 bg-white">
              <div className="container relative flex" style={{ top: -15 }}>
                <Image 
                  src={sub.imageUrl}
                  alt='Sub image'
                  className={`absolute rounded-full ${ownSub && 'cursor-pointer'}`}
                  onClick={() => openFileUpload('image')}
                  width={80}
                  height={80}
                />
                <div className="pt-5 pl-8"> 
                  <div className="flex items-center">
                    <h1 className='mb-1 text-3xl font-bold'>{sub.title}</h1>
                  </div>
                  <p className="text-sm font-bold text-gray-500">/r/{sub.name}</p>
                </div>
              </div>
            </div>
          </header>
          {/* Posts & Sidebar */}
          <div className="container flex pt-5">
            <section className="w-160">
              {postsMarkup}
            </section>
            <Sidebar sub={sub} />
          </div>
        </Fragment> 
      )}
    </div>
  )

}