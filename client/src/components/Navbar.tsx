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
    <nav className="fixed inset-x-0 top-0 z-10 flex items-center justify-between h-12 px-5 bg-white dark:bg-slate-600">
      {/* Logo and title */}
      <header className="relative flex items-center">
        <Link href='/'>
          <a><RedditLogo className='w-8 h-8 mr-2' /></a>
        </Link>
        <h1 className='hidden text-xl font-semibold lg:text-2xl sm:block dark:text-gray-300 whitespace-nowrap'>
          <Link href='/'>reddit v2</Link>
        </h1>
        <div className="hidden ml-4 sm:block">
          <ThemeChanger />
        </div>
      </header>
      {/* Search input */}
      <div className="px-4 w-140">
        <div className="relative flex items-center bg-gray-100 border rounded dark:border-gray-500 dark:bg-gray-700 dark:hover:border-blue-500 hover:border-blue-500 hover:bg-white">
          <i className='pl-4 pr-3 text-gray-500 fas fa-search'/>
          <input type="text" className='py-1 pr-3 bg-transparent rounded w-160 focus:outline-none' placeholder='Search' value={name} onChange={e => setName(e.target.value)} />
        <div className="absolute left-0 right-0 bg-white dark:bg-slate-500 top-full" >
          {subs?.map(sub => (
            <div className="flex items-center px-4 py-3 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700" key={sub.name} onClick={() => goToSub(sub.name)}>
              <Image src={sub.imageUrl} alt='Sub' height={32} width={32} className='rounded-full' />
              <div className="ml-4 text-sm">
                <p className="font-medium dark:text-gray-700">{sub.name}</p>
                <p className="text-gray-600 dark:text-gray-300">{sub.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      </div>
     
      {/* Auth buttons */}
      <div className="relative hidden sm:flex">
        {!loading && authenticated ? (
          <button className="w-20 py-1 mr-4 leading-5 sm:block lg:w-32 empty blue button" onClick={handleLogout}>
            Logout
          </button>
        ): (
          <>
            <Link href='/login'>
              <a className="w-20 py-1 mr-4 leading-5 sm:block lg:w-32 empty blue button">Login</a>
            </Link>
            <Link href='/register'>
              <a className="w-20 py-1 leading-5 sm:block lg:w-32 blue button">Sign Up</a>
            </Link>
          </>
        )}
      </div>
      {/* Mobile Dropdown */}
      <div className="sm:hidden">
        <div className="group ">
          <button className="flex items-center w-full px-4 py-4 focus:outline-none">
            <i className="fa-solid fa-user"></i>
          </button>
          <div className="absolute right-0 z-10 hidden h-auto group-hover:block">
            <div className="flex px-2 py-4 bg-gray-400 rounded-md shadow-lg">
              <div className="flex flex-col items-center w-28">
                {!loading && authenticated ? (
                  <button className="w-20 py-1 leading-5 sm:block empty blue button" onClick={handleLogout}>
                    Logout
                  </button>
                ): (
                  <>
                    <Link href='/login'>
                      <a className="w-20 py-1 leading-5 sm:block empty blue button">Login</a>
                    </Link>
                    <Link href='/register'>
                      <a className="w-20 py-1 mt-2 leading-5 sm:block blue button">Sign Up</a>
                    </Link>
                  </>
                )}
                <div className="mt-2">
                  <ThemeChanger />
                </div>
              </div>
            </div>
          </div>
        </div> 
      </div>
      
    </nav>
  )
}