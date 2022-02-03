import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

import useSWR from 'swr'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { Post, Sub } from '../types'
import PostCard from '../components/PostCard'

dayjs.extend(relativeTime);

export default function Home() {
  const { data: posts } = useSWR<Post[]>('/posts')
  const { data: topSubs } = useSWR('/misc/top-subs')

  return (
    <>
      <Head>
        <title>Reddit V2: the front page of the internet</title>
      </Head>
      <div className="container flex pt-4">
        {/* Posts feed */}
        <section className="w-160">
          {posts && posts.map(post => (
            <PostCard post={post} key={post.identifier} />
          ))}
        </section>
        {/* Sidebar */}
        <aside className='ml-6 w-80'>
          <div className="bg-white rounded">
            <header className="p-4 border-b-2">
              <h2 className="text-lg font-semibold text-center">
                Top Communities
              </h2>
            </header>
            <section>
              {topSubs?.map((sub: Sub) => (
                <article key={sub.name} className="flex items-center px-4 py-2 text-xs border-b">
                  <div className='mr-2 cursor-pointer'>
                    <Link href={`/r/${sub.name}`}>
                      <Image src={sub.imageUrl} alt="Sub" width={24} height={24}  className="rounded-full"/>
                    </Link>
                  </div>
                  <Link href={`/r/${sub.name}`}>
                    <a className="font-bold hover:cursor-pointer">/r/{sub.name}</a>
                  </Link>
                  <p className="ml-auto text-sm">{sub.postCount}</p>
                </article>
              ))}
            </section>
          </div>
        </aside>
      </div>
    </>
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