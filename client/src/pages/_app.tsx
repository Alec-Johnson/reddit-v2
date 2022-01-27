import { AppProps } from "next/dist/shared/lib/router/router";
import axios from 'axios'
import { useRouter } from "next/router";
import { SWRConfig } from 'swr'

import { AuthProvider } from '../context/auth'

import Navbar from '../components/Navbar'

import "../styles/tailwind.css";
import "../styles/icon.css";

axios.defaults.baseURL = 'http://localhost:5000/api'
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
			<AuthProvider>
				{!isAuthRoute && <Navbar />}
				<main className={isAuthRoute ? '' : 'pt-12'}>
					<Component {...pageProps} />
				</main>
			</AuthProvider>
	</SWRConfig>
	)
}

export default MyApp;
