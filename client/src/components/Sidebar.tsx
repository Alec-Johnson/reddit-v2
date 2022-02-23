import { useContext } from "react";
import Link from "next/link";

import dayjs from "dayjs";

import { AuthContext } from "../context/auth-context";
import { Sub } from "../types";

export default function Sidebar({ sub }: {sub: Sub}) {
  const { authenticated } =  useContext(AuthContext);
  
  return <aside className='ml-6 w-80'>
    <div className="bg-white rounded dark:bg-slate-500">
      <div className="p-3 bg-blue-500 rounded-t dark:bg-blue-700">
        <h3 className="text-lg font-semibold text-center text-white dark:text-gray-300">
          About Community
        </h3>
      </div>
      <div className="p-3 dark:text-gray-300">
        <p className="mb-3 text-md dark:text-gray-200">{sub.description}</p>
        <div className="flex mb-3 text-sm font-medium ">
          <div className="w-1/2">
            <p>5.2k</p>
            <p>members</p>
          </div>
          <div className="w-1/2">
            <p>110</p>
            <p>online</p>
          </div>
        </div>
        <p className="my-3">
          <i className="mr-2 fas fa-birthday-cake"></i>
          Created {dayjs(sub.createdAt).format('D MMM YYYY')}
        </p>
        {authenticated && (
          <Link href={`/r/${sub.name}/submit`}>
            <a className="w-full py-1 text-sm blue button">Create post</a>
          </Link>
        )}
      </div>
    </div>
  </aside>;
}
