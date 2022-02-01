import axios from "axios";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import useSWR from "swr";

import Sidebar from "../../../components/Sidebar";
import { Post, Sub } from "../../../types";

export default function submit() {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')

  const router = useRouter();
  const { sub: subName } = router.query;

  const { data: sub, error } = useSWR<Sub>(subName ? `/subs/${subName}` : null);
  if (error) router.push("/");

  const handleSubmitPost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (title.trim() === '') return

    try {
      const { data: post } = await axios.post<Post>('/posts', { title: title.trim(), body: body, sub: sub.name });

      router.push(`/r/${sub.name}/${post.identifier}/${post.slug}`);
    } catch (err) {
      console.log(err);
    }
  }

  return(
   <section className="container flex pt-5">
    <Head>
      <title>Submit to /r/{sub?.name}</title>
    </Head>
    <div className="w-160">
      <div className="p-4 bg-white rounded">
        <h1 className="mb-3 text-lg">Submit a post to /r/{subName}</h1>
        <form onSubmit={handleSubmitPost}>
          <div className="relative mb-2">
            <input 
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none"
              placeholder="Title"
              maxLength={300}
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
            <div className="absolute mb-2 text-sm text-gray-500 select-none focus:border-gray-600 top-3 right-2.5">
              {/* e.g. 23/300 */}
              {title.trim().length}/300
            </div>
          </div>
          <textarea 
            className='w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-gray-600'
            value={body}
            onChange={e => setBody(e.target.value)}
            placeholder="Text (optional)"
            rows={4}
          ></textarea>
          <div className="flex justify-end">
            <button 
              className="px-3 py-1 blue button" 
              type="submit" 
              disabled={title.trim().length === 0}>Submit
            </button>
          </div>
        </form>
      </div>
    </div>
    {sub && <Sidebar sub={sub} />}
  </section>
  )    
}
export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  try {
    const cookie = req.headers.cookie;
    if (!cookie) throw new Error('Missing auth cookie');

    await axios.get('/auth/me', { headers: { cookie }});

    // No need to return props, just redirect if not logged in
    return { props: {} };
  } catch (err) {
    
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }
}