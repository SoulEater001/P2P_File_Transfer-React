import React from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import FileSender from '../components/FileSender'


function LandingPage() {
  return (
    <>
        <Header />
        <div className ="container w-[1200px] h-[800px] m-auto mt-8 bg-purple-200 shadow-md shadow-black  " >
        <nav className=''>
              <ul className='flex flex-row justify-end space-x-2   '>
                <Link to="/">Send Files</Link>
                <Link >Received Files</Link>
                <Link>Sent </Link>
                <Link to ="/login"> Login</Link>
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
            
            <div class="action">
             
              <Link to="/receive">Recieve</Link>

            </div>
        </div>
    </>

  )
}

export default LandingPage