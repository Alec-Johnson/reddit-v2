import { AppProps } from "next/app";
import { useRouter } from "next/router";

import axios from 'axios'
import { SWRConfig } from 'swr'
import { ThemeProvider } from "next-themes";

import { AuthContextProvider } from "../context/auth-context";
import Navbar from '../components/Navbar'

import "../styles/tailwind.css";
import "../styles/icon.css";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_SERVER_BASE_URL + '/api'
axios.defaults.withCredentials = true

const fetcher = async (url: string) => {
	try {
		const res = await axios.get(url)
		return res.data
	} catch (err) {
		throw err.response.data
	}
}

function MyApp({ Component, pageProps }: AppProps) {
	const { pathname } = useRouter()
	const authRoutes = ['/login', '/register']
	const isAuthRoute = authRoutes.includes(pathname)
	
	return (
		<SWRConfig value={{ 
			fetcher,
			dedupingInterval: 10000,
		}}>
			<AuthContextProvider>
				<ThemeProvider attribute="class" disableTransitionOnChange>
				{!isAuthRoute && <Navbar />}
				<main className={isAuthRoute ? '' : 'pt-12'}>
					<Component {...pageProps} />
				</main>
				</ThemeProvider>
			</AuthContextProvider>
		</SWRConfig>
	)
}

export default MyApp;
