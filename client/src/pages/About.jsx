import React from 'react';
import Header from '../components/Header';

function About() {
  return (
    <>
      <Header />
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Page Title */}
        <h1 className="text-4xl font-bold text-cyan-800 text-center mb-8">About ShareWare</h1>

        {/* What We Do */}
        <section className="mb-12 text-center">
          <h2 className="text-2xl font-semibold text-cyan-700 mb-4">What We Do</h2>
          <p className="text-gray-700 text-lg">
            ShareWare is a peer-to-peer file transfer platform that allows you to send and receive files quickly, securely, and without limits. 
            We leverage modern WebRTC and WebSocket technologies to connect devices directly, ensuring fast, private, and efficient file transfers.
          </p>
        </section>

        {/* Our Mission */}
        <section className="mb-12 text-center bg-cyan-50 rounded-lg p-8 shadow-md">
          <h2 className="text-2xl font-semibold text-cyan-700 mb-4">Our Mission</h2>
          <p className="text-gray-700 text-lg">
            Our mission is to provide a seamless and secure file-sharing experience for everyone. We aim to eliminate the frustration of file size limits, slow transfers, and complex software.
          </p>
        </section>

        {/* Why Choose ShareWare */}
        <section className="text-center">
          <h2 className="text-2xl font-semibold text-cyan-700 mb-6">Why Choose ShareWare?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold text-cyan-800 mb-2">Fast Transfers</h3>
              <p className="text-gray-700">
                Direct P2P connections ensure lightning-fast file transfers without delays.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold text-cyan-800 mb-2">Secure & Private</h3>
              <p className="text-gray-700">
                Files are encrypted and transferred directly between devices, keeping your data private and secure.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold text-cyan-800 mb-2">No Limits</h3>
              <p className="text-gray-700">
                Send files of any size, anytime, without restrictions or subscriptions.
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default About;
