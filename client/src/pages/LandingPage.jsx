import React from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import FileSender from '../components/FileSender'
import Footer from '../components/Footer'




function LandingPage() {
  return (
    <>
        <Header />
        <div className ="container w-[1200px] h-[640px] m-auto my-8 bg-purple-200 shadow-md shadow-black  " >
        <nav className='flex flex-row justify-between pt-2 px-4 text-violet-900 ' >
              <ul className='text-xl'>
                <li> ShareWare Peer 2 Peer File Transfer</li>
              </ul>
              <ul className='flex flex-row justify-end space-x-4 text-xl '>
                <li className='hover:text-white'>
                  <Link to="/">Send Files</Link>
                </li>
                <li className='hover:text-white'>
                  <Link to ="/receive">Received Files</Link>
                </li>
                <li className='hover:text-white'>
                  <Link to="/sent">Sent</Link>
                </li>
                <li className='hover:text-white'>
                  <Link to ="/login"> Login</Link>
                </li>
              </ul>
            </nav>
            <div  className='p-4 '>
              
                {/* <p>A peer-to-peer (P2P) file transfer system using WebRTC and WebSocket involves a seamless method for directly transferring files between browsers without intermediaries. WebRTC (Web Real-Time Communication) is utilized for establishing real-time peer-to-peer connections, allowing efficient data transfer through its RTCDataChannel API. WebSocket, a protocol that enables full-duplex communication over a single TCP connection, plays a crucial role in the signaling phase of the process. During signaling, peers exchange necessary metadata and connection details through WebSocket to establish the connection.</p> */}
                <p className='text-4xl text-center text-purple-800 '>
                  A seamless way to  trasnfer your files without any Limits!!!
                </p>
            </div>
          
            <div>
              <FileSender/>
            </div>
        </div>
        <Footer/>
    </>

  )
}

export default LandingPage