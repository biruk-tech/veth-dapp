'use client'

import { useState } from 'react'
import { useWeb3 } from '../context/Web3Context'
import { ethers } from 'ethers'
import UserRegistry from '../../backend/artifacts/contracts/User.sol/UserRegistry.json'

export default function Home() {
	const { account, isConnected, chainId } = useWeb3()
	const [username, setUsername] = useState('')
	const [isUsernameSet, setIsUsernameSet] = useState(false)

	const handleAuth = async () => {
		if (!account) return;

		try {
			const provider = new ethers.BrowserProvider(window.ethereum)
			const signer = await provider.getSigner()

			// Sign a message to verify ownership
			const message = `Sign this message to verify your username: ${username}`;
			const signature = await signer.signMessage(message);

			const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS
			if (!CONTRACT_ADDRESS) {
				throw new Error('Contract address is not defined')
			}
			const contract = new ethers.Contract(
				CONTRACT_ADDRESS,
				UserRegistry.abi,
				signer
			)

			// Call the smart contract to set the username
			const tx = await contract.registerUser(username, signature)
			await tx.wait()
			alert('Username set successfully!')
			setIsUsernameSet(true)
		} catch (error) {
			console.error('Error:', error)
			alert('Operation failed: ' + (error as any).message)
		}
	}

	return (
		<main className='min-h-screen p-8'>
			<div className='max-w-2xl mx-auto'>
				<h1 className='text-3xl font-bold mb-8'>Web3 Connection Test</h1>

				<div className='space-y-4'>
					{/* Connection Status */}
					<div className='p-4 bg-gray-100 rounded-lg'>
						<p>
							Connection Status:{' '}
							{isConnected ? '🟢 Connected' : '🔴 Disconnected'}
						</p>
					</div>

					{/* Account Info */}
					{account && (
						<div className='p-4 bg-gray-100 rounded-lg'>
							<p>Account: {account}</p>
						</div>
					)}

					{/* Network Info */}
					{chainId && (
						<div className='p-4 bg-gray-100 rounded-lg'>
							<p>Chain ID: {chainId.toString()}</p>
							<p>
								Network:{' '}
								{
									chainId === 1n
										? 'Ethereum Mainnet'
										: chainId === 5n
										? 'Goerli Testnet'
										: chainId === 11155111n
										? 'Sepolia Testnet'
										: chainId === 1337n
										? 'Local Network'
										: 'Unknown Network'
								}
							</p>
						</div>
					)}

					{/* Username Input */}
					{isConnected && !isUsernameSet && (
						<div className='p-4 bg-gray-100 rounded-lg'>
							<h2>Set Your Username</h2>
							<input
								type='text'
								value={username}
								onChange={e => setUsername(e.target.value)}
								placeholder='Enter username'
								className='border p-2 rounded w-full'
							/>
							<button
								onClick={handleAuth}
								className='bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors mt-2'
							>
								Set Username
							</button>
						</div>
					)}
				</div>
			</div>
		</main>
	)
}
