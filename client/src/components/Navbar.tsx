import Link from "next/link"
import RedditLogo from '../images/reddit.svg'
import { useAuthState, useAuthDispatch } from "../context/auth";
import axios from "axios";

const Navbar = () => {
  const { authenticated, loading } = useAuthState()
  const disptach = useAuthDispatch()

  const handleLogout = () => {
    axios.get("/auth/logout")
      .then(() => {
        disptach('LOGOUT')
        window.location.reload()
      })
      .catch(err => console.log(err))
  }

  return (
    <nav className="fixed inset-x-0 top-0 z-10 flex items-center justify-center h-12 px-5 bg-white">
      {/* Logo and title */}
      <header className="flex items-center">
        <Link href='/'>
          <a><RedditLogo className='w-8 h-8 mr-2' /></a>
        </Link>
        <h1 className='text-2xl font-semibold'>
          <Link href='/'>reddit v2</Link>
        </h1>
      </header>
      {/* Search input */}
      <div className="flex items-center mx-auto bg-gray-100 border rounded hover:border-blue-500 hover:bg-white">
        <i className='pl-4 pr-3 text-gray-500 fas fa-search'/>
        <input type="text" className='py-1 pr-3 bg-transparent rounded w-160 focus:outline-none' placeholder='Search'/>
      </div>
      {/* Auth buttons */}
      <div className="flex">
        {!loading && authenticated ? (
          <button className="w-32 py-1 mr-4 leading-5 empty blue button" onClick={handleLogout}>
            Logout
          </button>
        ): (
          <>
            <Link href='/login'>
              <a className="w-32 py-1 mr-4 leading-5 empty blue button">Login</a>
            </Link>
            <Link href='/register'>
              <a className="w-32 py-1 leading-5 blue button">Sign Up</a>
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar