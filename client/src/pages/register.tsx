import axios from "axios";
import Head from "next/head";
import Link from 'next/link';
import { FormEvent, useState } from "react";
import InputGroup from "../components/InputGroup";
import { useRouter } from 'next/router'

export default function Register() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<any>({});

  const submitForm = async (event: FormEvent) => {
    event.preventDefault();
    try {
      await axios.post('/auth/register', {
        email, password, username
      })

      router.push('/login')
    } catch (err) {
      console.log(err);
      setErrors(err.response.data)
    }
  }
  return (
    <div className="flex">
      <Head>
        <title>Register</title>
      </Head>
      <div className="h-screen bg-cover w-36" style={{ backgroundImage: "url('/images/rocks.jpg')"}}>
      </div>
      <div className="flex flex-col justify-center pl-6 w-72">
        <h1 className="mb-2 text-lg">Sign Up</h1>
        <form onSubmit={submitForm}>
          <InputGroup className="mb-2" type='email' value={email} setValue={setEmail} placeholder='EMAIL' error={errors.email} />
          <InputGroup className="mb-2" type='text' value={username} setValue={setUsername} placeholder='USERNAME' error={errors.username} />
          <InputGroup className="mb-2" type='password' value={password} setValue={setPassword} placeholder='PASSWORD' error={errors.password} />
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