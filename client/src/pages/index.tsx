import { useContext, useEffect, useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

import useSWR from 'swr'
import useSWRInfinite from 'swr/infinite'

import { Post, Sub } from '../types'
import PostCard from '../components/PostCard'
import { AuthContext } from '../context/auth-context'

export default function Home() {
  const [observedPost, setObservedPost] = useState(null)
  const { data: topSubs } = useSWR<Sub[]>('/misc/top-subs')

  const { authenticated } = useContext(AuthContext)

  const {
    data,
    error,
    size: page,
    setSize: setPage,
    isValidating,
    mutate
  } = useSWRInfinite<Post[]>((index) => `/posts?page=${index}`, {
    revalidateAll: true
  })

  const isInitialLoading = !data && !error
  const posts: Post[] = data ? [].concat(...data) : []

  useEffect(() => {
    if (!posts || posts.length === 0) return

    const id = posts[posts.length - 1].identifier

    if (id !== observedPost) {
      setObservedPost(id)
      observeElement(document.getElementById(id))
    }
  }, [posts])

  const observeElement = (element: HTMLElement) => {
    if (!element) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting === true) {
          console.log('Reached bottom of post')
          setPage(page + 1)
          observer.unobserve(element)
        }
      },
      { threshold: 1 }
    )
    observer.observe(element)
  }
  return (
    <>
      <Head>
        <title>Reddit V2: the front page of the internet</title>
      </Head>
      <div className="container flex pt-4">
        {/* Posts feed */}
        <section className="w-full px-4 md:w-160 md:p-0">
          {isInitialLoading && <p className="text-lg text-center">Loading..</p>}
          {posts && posts.map(post => (
            <PostCard post={post} key={post.identifier} mutate={mutate} />
          ))}
          {isValidating && posts.length > 0 && (
            <p className="text-lg text-center">Loading More..</p>
          )}
        </section>
        {/* Sidebar */}
        <aside className='hidden ml-6 md:block w-80'>
          <div className="bg-white rounded">
            <header className="p-4 border-b-2">
              <h2 className="text-lg font-semibold text-center">
                Top Communities
              </h2>
            </header>
            <section>
              {topSubs?.map((sub) => (
                <article key={sub.name} className="flex items-center px-4 py-2 text-xs border-b">
                  <div className='mr-2 cursor-pointer'>
                    <Link href={`/r/${sub.name}`}>
                      <a>
                        <Image src={sub.imageUrl} alt="Sub" width={24} height={24}  className="rounded-full"/>
                      </a>
                    </Link>
                  </div>
                  <Link href={`/r/${sub.name}`}>
                    <a className="font-bold hover:cursor-pointer">/r/{sub.name}</a>
                  </Link>
                  <p className="ml-auto text-sm">{sub.postCount}</p>
                </article>
              ))}
            </section>
            {authenticated && 
              <aside className="p-4 border-t-2">
                <Link href="/subs/create">
                  <a className="w-full px-2 py-1 blue button">
                    Create Community
                  </a>
                </Link>
              </aside>
            }
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