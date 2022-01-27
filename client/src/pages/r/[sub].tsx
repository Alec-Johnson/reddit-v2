import { useRouter } from "next/router";
import useSWR from "swr";
import PostCard from "../../components/PostCard";

export default function Sub(){
  const router = useRouter();

  const subName = router.query.sub;

  // https://swr.vercel.app/docs/conditional-fetching
  const { data: sub, error } = useSWR(subName ? `/subs/${subName}` : null);

  if (error) router.push('/')

  return (
    <div className="container flex pt-5">
      <section className="w-160">
      {!sub && <div>Loading...</div>}
      {(sub && sub.posts.length === 0) && <div>No posts yet.</div>}
      {(sub && sub.posts.length > 0) && sub.posts.map(post => (
         <PostCard key={post.identifier} post={post} />
      ))}
      </section>
    </div>
  )

}