import Head from "next/head";
import Link from 'next/link';

export default function Register() {
  return (
    <div className="flex">
      <Head>
        <title>Register</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="w-40 h-screen bg-cover" style={{ backgroundImage: "url('/images/rocks.jpg')"}}>

      </div>
      <div className="flex flex-col justify-center pl-6 w-70">
        <h1 className="mb-2 text-lg">Sign Up</h1>
        <form>
          <div className="mb-2">
            <input className="w-full px-3 py-2 bg-gray-100 border border-gray-400 rounded" type='email' placeholder="Email" />
          </div>
          <div className="mb-2">
            <input className="w-full px-3 py-2 bg-gray-100 border border-gray-400 rounded" type='text' placeholder="Username" />
          </div>
          <div className="mb-2">
            <input className="w-full px-3 py-2 bg-gray-100 border border-gray-400 rounded" type='password' placeholder="Password" />
          </div>
          <button className="w-full py-2 mb-4 text-xs font-bold text-white uppercase bg-blue-500 border border-blue-500 rounded">
            Sign Up
          </button>
        </form>
        <small>Already have an account?
          <Link href='/login'>
            <a className="ml-1 text-blue-500 uppercase">Log In</a>
          </Link>
        </small>
      </div>
    </div>
  )
}
