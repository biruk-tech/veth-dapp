'use client'

import { useWeb3 } from '../../context/Web3Context'

import Link from 'next/link'
import styles from './navbar.module.css'

const Navbar = () => {
    const { connect, disconnect, isConnected } = useWeb3()
	return (
		<nav className={styles.navbar}>
			<div className={styles.logo}>
				<Link href='/'>MyApp</Link>
			</div>
			<div className='max-w-2xl mx-auto flex justify-between items-center'>
				<button
					onClick={isConnected ? disconnect : connect}
					className='bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors'
				>
					{isConnected ? 'Disconnect Wallet' : 'Connect Wallet'}
				</button>
			</div>
		</nav>
	)
}

export default Navbar
