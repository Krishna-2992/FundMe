import './App.css'
import { useEffect, useState } from 'react'
import { contractAddress, contractABI } from './constants'
const { ethers } = require('ethers')

function App() {
    const [state, setState] = useState({
        provider: null,
        signer: null,
        contract: null,
    })
    const [fundedAmount, setFundedAmount] = useState([])
    const [balance, setBalance] = useState()
    const [fundMeOwner, setFundMeOwner] = useState()

    useEffect(() => {
        const funders = async () => {
            try {
                if (state.signer) {
                    const funderss = await getFunders()
                    console.log(funderss)
                    funderss.map(async (funder) => {
                        setFundedAmount([])
                        const fundedAmount =
                            await state.contract.getFundedAmount(funder)
                        console.log(
                            `${funder} funded ${ethers.utils.formatEther(
                                fundedAmount
                            )} ETH`
                        )
                        setFundedAmount((prev) => [
                            ...prev,
                            [funder, ethers.utils.formatEther(fundedAmount)],
                        ])
                    })
                    setFundMeBalance()
                    setOwner()
                } else {
                    console.log('connect the wallet first')
                }
            } catch (error) {
                console.log(error.code)
            }
        }
        funders()
    }, [state])

    console.log('funded Amount', fundedAmount)

    const connectWallet = async () => {
        try {
            if (window.ethereum !== 'undefined') {
                const accounts = await window.ethereum.request({
                    method: 'eth_requestAccounts',
                })

                const provider = new ethers.providers.Web3Provider(
                    window.ethereum
                )
                const signer = provider.getSigner()
                const contract = new ethers.Contract(
                    contractAddress,
                    contractABI,
                    signer
                )
                setState({ provider, signer, contract })
                console.log('connected accounts', accounts)
                document.getElementById('connect_button').innerHTML =
                    'connected'
            } else {
                alert('Please install metamask')
            }
        } catch (error) {
            console.log(error.code)
        }
    }

    const fund = async () => {
        try {
            if (state.signer) {
                const amount = document.querySelector('#fund_amount').value
                console.log(amount)
                console.log(state.contract)
                const response = await state.contract.fund({
                    value: ethers.utils.parseEther(amount),
                })
                console.log('response', response)
                document.querySelector('#fund_amount').value = ''
            } else {
                console.log('connect the wallet first')
            }
        } catch (error) {
            console.log(error.code)
        }
    }

    const withdraw = async () => {
        try {
            if (state.signer) {
                console.log(state.contract)
                const response = await state.contract.withdraw()
                console.log('response', response)
            } else {
                console.log('connect the wallet first')
            }
        } catch (error) {
            console.log(error.code)
        }
    }

    const setOwner = async () => {
        try {
            if (state.signer) {
                const response = await state.contract.getOwner()
                console.log('owner is:::', response)
                setFundMeOwner(response)
            } else {
                console.log('connect the wallet first')
            }
        } catch (error) {
            console.log(error.code)
        }
    }

    const getFunders = async () => {
        try {
            if (state.signer) {
                const funders = await state.contract.getFunders()
                console.log('funders are: ', funders)
                return funders
            } else {
                console.log('connect the wallet first')
            }
        } catch (error) {
            console.log(error.code)
        }
    }

    const getFunderAmount = async () => {
        try {
            if (state.signer) {
                const funders = await getFunders()
                console.log(funders)
                funders.map(async (funder) => {
                    const fundedAmount = await state.contract.getFundedAmount(
                        funder
                    )
                    console.log(
                        `${funder} funded ${ethers.utils.formatEther(
                            fundedAmount
                        )} ETH`
                    )
                })
            } else {
                console.log('connect the wallet first')
            }
        } catch (error) {
            console.log(error.code)
        }
    }

    const setFundMeBalance = async () => {
        try {
            const response = await state.provider.getBalance(contractAddress)
            console.log('balance', ethers.utils.formatEther(response))
            setBalance(ethers.utils.formatEther(response))
        } catch (error) {
            console.log(error.code)
        }
    }

    return (
        <div className='container h-screen w-screen text-white'>
            <div className='flex align-center justify-between'>
                <div className='text-4xl font-bold self-center m-8'>
                    Krishna's Funding Dapp
                </div>
                <button
                    onClick={connectWallet}
                    id='connect_button'
                    className='m-8 p-4 text-2xl '
                >
                    Connect Wallet
                </button>
            </div>
            {
                state.contract?
                <div>
                    <div className='text-xl font-semibold mx-8'>
                <div className=''>
                    Total Funds:{' '}
                    <span className='text-3xl font-bold'>{balance}</span> ETH
                </div>
                <div className=''>
                    Owner:{' '}
                    <span className='text-2xl font-bold'>{fundMeOwner}</span>
                </div>
            </div>
            <div className='flex flex-row justify-center m-8'>
                <input type='text' placeholder='0.1' id='fund_amount' className='rounded-md mx-8 p-2 text-xl text-black'/>
                <button onClick={fund} className='text-2xl px-4 py-2 rounded-md bg-gradient-to-r from-green-400 to-blue-500 hover:from-pink-500 hover:to-yellow-500'>Fund</button>
            </div>
            <div className='flex w-full justify-center'>
            <button onClick={withdraw} className='flex flex-col items-center w-1/3  m-8 px-4'>
                <div className='text-2xl'>Withdraw</div>
                <div className='text-red-600'>only for owner</div>
            </button>
            </div>
            <table className='min-w-full'>
                <thead>
                    <tr>
                        <th className='py-2 px-4 border-b-2 border-gray-200'>
                            Funder
                        </th>
                        <th className='py-2 px-4 border-b border-gray-200'>
                            value
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {fundedAmount.map((fund) => {
                        return (
                            <tr key={Math.random()}>
                                <th className='py-2 px-4 border-b border-gray-200'>
                                    {fund[0]}
                                </th>
                                <th className='py-2 px-4 border-b border-gray-200'>
                                    {fund[1]}
                                </th>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
                </div>: 
                <div className='flex justify-center h-1/2 items-center'>
                    <div className='text-4xl'>please connect wallet first</div></div>
            }
        </div>
    )
}

export default App
