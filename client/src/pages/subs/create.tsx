import axios from 'axios';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function create() {
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const [errors, setErrors] = useState<Partial<any>>({});
  const router = useRouter();

  const submitForm = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await axios.post('/subs', { name, title, description })
      router.push(`/r/${res.data.name}`);
    } catch (err) {
      setErrors(err.response.data);
    }
  }

  return ( 
    <div className='flex bg-white dark:bg-slate-600'>
      <Head>
        <title>Create a new community</title>
      </Head>
      <div className="h-screen bg-center bg-cover w-36"
      style={{ backgroundImage: "url('/images/rocks.jpg')"}}>
      </div>
      <div className="flex flex-col justify-center pl-6">
        <div className="w-96">
          <h1 className="mb-2 text-lg font-medium">Create a community</h1>
          <hr />
          <form onSubmit={submitForm}>
            <div className="my-6">
              <p className="font-medium">Name</p>
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-300">Community names including capitalization cannot be changed.</p>
              <input 
                type="text" className={"w-full p-3 border border-gray-200 rounded hover:border-gray-500" + (errors.name ? " border-red-500" : "")}
                value={name}
                onChange={e => setName(e.target.value)} />
              <small className="font-medium text-red-600">{errors.name}</small>
            </div>
             
            <div className="my-6">
              <p className="font-medium">Title</p>
              <p className="mb-2 text-xs text-gray-50 dark:text-gray-300">Community title that represents the topic and can change at any time.</p>
              <input type="text" className={"w-full p-3 border border-gray-200 rounded hover:border-gray-500" + (errors.title ? " border-red-500" : "")}
                value={title}
                onChange={e => setTitle(e.target.value)} />
              <small className="font-medium text-red-600">{errors.title}</small>
            </div>

            <div className="my-6">
              <p className="font-medium">Description</p>
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-300">This is how users will come to understand your community.</p>
              <textarea 
                className="w-full p-3 border border-gray-200 rounded hover:border-gray-500"
                value={description}
                onChange={e => setDescription(e.target.value)} />
            </div>

            <div className="flex justify-end">
              <button className="px-4 py-1 text-sm font-medium capitalize blue button">Create Community</button>
            </div>
          </form>
        </div>
      </div>
    </div>
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