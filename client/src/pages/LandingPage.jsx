import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

function LandingPage() {
  return (
    <>
      <Header />
      <div className="container w-[1200px] m-auto my-8">

        {/* Hero Section */}
        <div className="p-8 text-center bg-gradient-to-r from-cyan-100 to-blue-100 rounded-xl shadow-xl">
          <h1 className="text-5xl font-extrabold text-blue-800 mb-6">
            Transfer Files Seamlessly
          </h1>
          <p className="text-xl text-blue-700 mb-8 max-w-3xl mx-auto">
            ShareWare allows you to send and receive files quickly, securely, and without restrictions. 
            Transfer directly between devices using P2P technology.
          </p>
          <div className="flex justify-center space-x-6">
            <Link
              to="/send"
              className="bg-cyan-500 text-white py-3 px-6 rounded-lg shadow hover:bg-cyan-600 transition"
            >
              Send Files
            </Link>
            <Link
              to="/receive"
              className="bg-cyan-500 text-white py-3 px-6 rounded-lg shadow hover:bg-cyan-600 transition"
            >
              Receive Files
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16 text-center">
          <h2 className="text-4xl font-bold text-blue-800 mb-10">Why Choose ShareWare?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition">
              <h3 className="text-2xl font-semibold text-blue-800 mb-4">Fast Transfers</h3>
              <p className="text-gray-600">
                Lightning-fast P2P file transfers with no delays or servers in between.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition">
              <h3 className="text-2xl font-semibold text-blue-800 mb-4">Secure Connections</h3>
              <p className="text-gray-600">
                Advanced encryption keeps your files safe and private during transfer.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition">
              <h3 className="text-2xl font-semibold text-blue-800 mb-4">No Limits</h3>
              <p className="text-gray-600">
                Transfer any file size without restrictions. No servers, no limits.
              </p>
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="mt-16 bg-cyan-50 py-12 px-6 rounded-xl">
          <h2 className="text-4xl font-bold text-blue-800 text-center mb-10">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition">
              <h3 className="text-2xl font-semibold text-blue-800 mb-4">Step 1: Connect</h3>
              <p className="text-gray-600">
                Connect with the device you want to send or receive files from.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition">
              <h3 className="text-2xl font-semibold text-blue-800 mb-4">Step 2: Transfer</h3>
              <p className="text-gray-600">
                Send files instantly via direct P2P connection, ensuring fast and efficient transfer.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition">
              <h3 className="text-2xl font-semibold text-blue-800 mb-4">Step 3: Complete</h3>
              <p className="text-gray-600">
                Receive files on your device without extra software or services.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
}

export default LandingPage;
