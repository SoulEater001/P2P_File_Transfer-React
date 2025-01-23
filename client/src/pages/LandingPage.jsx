import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';

function LandingPage() {
  return (
    <>
      <Header />
      <div className="container w-[1200px] h-[640px] m-auto my-8 bg-purple-200 shadow-md shadow-black">
        <nav className="flex flex-row justify-between pt-2 px-4 text-violet-900">
          <ul className="text-xl">
            <li>ShareWare Peer 2 Peer File Transfer</li>
          </ul>
          <ul className="flex flex-row justify-end space-x-4 text-xl">
            <li className="hover:text-white">
              <Link to="/send">Send Files</Link>
            </li>
            <li className="hover:text-white">
              <Link to="/receive">Received Files</Link>
            </li>
            <li className="hover:text-white">
              <Link to="/sent">Sent</Link>
            </li>
            <li className="hover:text-white">
              <Link to="/login">Login</Link>
            </li>
          </ul>
        </nav>

        {/* Hero Section */}
        <div className="p-4 text-center">
          <h1 className="text-4xl text-purple-800 font-bold mb-4">
            A seamless way to transfer your files without any limits!
          </h1>
          <p className="text-xl text-purple-600 mb-8">
            ShareWare allows you to send and receive files quickly, securely, and without restrictions. With our peer-to-peer (P2P) technology, you can transfer files directly between devices, ensuring a fast and efficient experience.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/send"
              className="bg-purple-500 text-white py-2 px-4 rounded-md hover:bg-purple-700"
            >
              Send Files
            </Link>
            <Link
              to="/receive"
              className="bg-purple-500 text-white py-2 px-4 rounded-md hover:bg-purple-700"
            >
              Receive Files
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-12 px-4 text-center">
          <h2 className="text-3xl text-purple-800 font-bold mb-6">Why Choose ShareWare?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl text-purple-800 font-semibold mb-4">Fast Transfers</h3>
              <p className="text-gray-600">
                ShareWare leverages the power of peer-to-peer technology, ensuring lightning-fast file transfers without any delays.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl text-purple-800 font-semibold mb-4">Secure Connections</h3>
              <p className="text-gray-600">
                Your data is safe with ShareWare. We use advanced encryption to ensure that your files remain private and secure during transit.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl text-purple-800 font-semibold mb-4">No Limits</h3>
              <p className="text-gray-600">
                Unlike other file transfer services, ShareWare imposes no file size limits. Transfer any file, anytime, without restrictions.
              </p>
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="mt-12 px-4 text-center bg-purple-100 py-8">
          <h2 className="text-3xl text-purple-800 font-bold mb-6">How It Works</h2>
          <p className="text-xl text-purple-600 mb-8">
            ShareWare utilizes WebRTC and WebSocket for seamless peer-to-peer file transfers. Here's how it works:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl text-purple-800 font-semibold mb-4">Step 1: Connect</h3>
              <p className="text-gray-600">
                Connect with the device you want to send or receive files from using our intuitive interface.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl text-purple-800 font-semibold mb-4">Step 2: Transfer</h3>
              <p className="text-gray-600">
                Send files instantly via direct peer-to-peer connection, ensuring fast and efficient transfer.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl text-purple-800 font-semibold mb-4">Step 3: Complete</h3>
              <p className="text-gray-600">
                Receive files on your device without the need for any additional software or services. It’s that simple!
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* <Footer /> */}
    </>
  );
}

export default LandingPage;