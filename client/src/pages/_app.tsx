import { AppProps } from "next/dist/shared/lib/router/router";
import axios from 'axios'
import { useRouter } from "next/router";

import { AuthProvider } from '../context/auth'

import Navbar from '../components/Navbar'

import "../styles/tailwind.css";
import "../styles/icon.css";

axios.defaults.baseURL = 'http://localhost:5000/api'
axios.defaults.withCredentials = true

function MyApp({ Component, pageProps }: AppProps) {
	const { pathname } = useRouter()
	const authRoutes = ['/login', '/register']
	const isAuthRoute = authRoutes.includes(pathname)
	
	return (
	<AuthProvider>
		{!isAuthRoute && <Navbar />}
		<Component {...pageProps} />
	</AuthProvider>
	)
}

export default MyApp;
