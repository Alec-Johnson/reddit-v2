import { useContext, useEffect, useState } from "react";
import Link from "next/link"
import Image from "next/image";
import { useRouter } from "next/router";

import axios from "axios";

import ThemeChanger from "./ThemeChanger";
import RedditLogo from '../images/reddit.svg'
import { AuthContext } from "../context/auth-context";
import { Sub } from "../types";

export default function Navbar(){
  const [name, setName] = useState('')
  const [subs, setSubs] = useState<Sub[]>([])
  const [timer, setTimer] = useState(null);

  const { authenticated, loading, dispatch } = useContext(AuthContext)

  const router = useRouter()

  const handleLogout = () => {
    axios.get("/auth/logout")
      .then(() => {
        dispatch({ type: 'LOGOUT' })
        window.location.reload()
      })
      .catch(
        err => {throw new Error(`Logout failed, ${err}`)}
      )
  }

  useEffect(() => {
    if (name.trim() === '') {
      setSubs([])
      return
    }

    handleSearchSubs()
  }, [name]);
  

  const handleSearchSubs = async () => {
    clearTimeout(timer)
    setTimer(setTimeout(async () => {
      try {
        const { data } = await axios.get(`/subs/search/${name}`)
        setSubs(data)
        console.log(data);
        
      } catch (err) {
        throw new Error(`Search failed, ${err}`)
      }
    }, 300))
  }

  const goToSub = (sub: string) => {
    router.push(`/r/${sub}`)
    // Clear search bar after sub is selected
    setName('')
  }

  return (
    <nav className="fixed inset-x-0 top-0 z-10 flex items-center justify-between h-12 px-5 bg-white">
      {/* Logo and title */}
      <header className="flex items-center">
        <Link href='/'>
          <a><RedditLogo className='w-8 h-8 mr-2' /></a>
        </Link>
        <h1 className='hidden text-2xl font-semibold lg:block'>
          <Link href='/'>reddit v2</Link>
        </h1>
        <ThemeChanger />
      </header>
      {/* Search input */}
      <div className="max-w-full px-4 w-60 sm:w-80 lg:w-160">
        <div className="relative flex items-center bg-gray-100 border rounded hover:border-blue-500 hover:bg-white">
          <i className='pl-4 pr-3 text-gray-500 fas fa-search'/>
          <input type="text" className='py-1 pr-3 bg-transparent rounded w-160 focus:outline-none' placeholder='Search' value={name} onChange={e => setName(e.target.value)} />
        <div className="absolute left-0 right-0 bg-white top-full" >
          {subs?.map(sub => (
            <div className="flex items-center px-4 py-3 cursor-pointer hover:bg-gray-200" key={sub.name} onClick={() => goToSub(sub.name)}>
              <Image src={sub.imageUrl} alt='Sub' height={32} width={32} className='rounded-full' />
              <div className="ml-4 text-sm">
                <p className="font-medium">{sub.name}</p>
                <p className="text-gray-600">{sub.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      </div>
     
      {/* Auth buttons */}
      <div className="flex">
        {!loading && authenticated ? (
          <button className="w-20 py-1 mr-4 leading-5 sm:block lg:w-32 empty blue button" onClick={handleLogout}>
            Logout
          </button>
        ): (
          <>
            <Link href='/login'>
              <a className="w-20 py-1 mr-4 leading-5  sm:block lg:w-32 empty blue button">Login</a>
            </Link>
            <Link href='/register'>
              <a className="w-20 py-1 leading-5  sm:block lg:w-32 blue button">Sign Up</a>
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}