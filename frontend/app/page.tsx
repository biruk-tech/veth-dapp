'use client'

import { useWeb3 } from '../context/Web3Context'

export default function Home() {
	const { connect, disconnect, account, isConnected, chainId } = useWeb3()

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
									// Alternative approach that works with v6
									// --> in tsconfig.json file "target": instead of "ES2020" use "ES2017"
									// chainId === BigInt(1) ? 'Ethereum Mainnet' :
									// chainId === BigInt(5) ? 'Goerli Testnet' :
									// chainId === BigInt(11155111) ? 'Sepolia Testnet' :
									// chainId === BigInt(1337) ? 'Local Network' :
									// 'Unknown Network'
								}
							</p>
						</div>
					)}

					{/* Connect/Disconnect Button */}
					<button
						onClick={isConnected ? disconnect : connect}
						className='bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors'
					>
						{isConnected ? 'Disconnect Wallet' : 'Connect Wallet'}
					</button>
				</div>
			</div>
		</main>
	)
}
