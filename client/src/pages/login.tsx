import axios from "axios";
import Head from "next/head";
import Link from 'next/link';
import { useRouter } from 'next/router'
import { FormEvent, useState } from "react";

import InputGroup from "../components/InputGroup";

import { useAuthDispatch, useAuthState } from "../context/auth";

export default function Login() {
  const router = useRouter();
  const dispatch = useAuthDispatch();
  const { authenticated } = useAuthState();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<any>({});

  const submitForm = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const res = await axios.post('/auth/login', {
        username, password
      })
      dispatch('LOGIN', res.data)
      router.push('/')
    } catch (err) {
      console.log(err);
      setErrors(err.response.data)
    }
  }

  if (authenticated) router.push('/')

  return (
    <div className="flex bg-white">
      <Head>
        <title>Login</title>
      </Head>
      <div className="h-screen bg-cover w-36" style={{ backgroundImage: "url('/images/rocks.jpg')"}}>
      </div>
      <div className="flex flex-col justify-center pl-6 w-72">
        <h1 className="mb-2 text-lg">Login</h1>
        <form onSubmit={submitForm}>
          <InputGroup className="mb-2" type='text' value={username} setValue={setUsername} placeholder='USERNAME' error={errors.username} />
          <InputGroup className="mb-2" type='password' value={password} setValue={setPassword} placeholder='PASSWORD' error={errors.password} />
          <button className="w-full py-2 mb-4 text-xs font-bold text-white uppercase bg-blue-500 border border-blue-500 rounded">
            Login
          </button>
        </form>
        <small>Need to create an account?
          <Link href='/register'>
            <a className="ml-1 text-blue-500 uppercase">Sign Up</a>
          </Link>
        </small>
      </div>
    </div>
  )
}