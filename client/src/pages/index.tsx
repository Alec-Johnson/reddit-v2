import Head from 'next/head'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import useSWR from 'swr'

import { Post } from '../types'

import PostCard from '../components/PostCard'

dayjs.extend(relativeTime);

export default function Home() {
  const { data: posts } = useSWR<Post[]>('/posts')

  return (
    <>
      <Head>
        <title>Reddit V2: the front page of the internet</title>
      </Head>
      <div className="container flex pt-4">
        {/* Posts feed */}
        <section className="w-160">
          {posts?.map(post => (
            <PostCard post={post} key={post.identifier} />
          ))}
        </section>
        {/* Sidebar */}
        <aside></aside>
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