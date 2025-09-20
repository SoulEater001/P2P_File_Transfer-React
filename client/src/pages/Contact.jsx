import React from 'react';
import Header from '../components/Header';

function Contact() {
  return (
    <>
      <Header />
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-cyan-800 text-center mb-8">Contact Us</h1>
        <p className="text-gray-700 text-center mb-12">
          Thank you for your interest in ShareWare! We’re here to help and answer any questions you might have.
          Feel free to reach out to us using the form below or through our support channels.
        </p>

        {/* Contact Form */}
        <div className="bg-white p-8 rounded-lg shadow-md">
          <form className="flex flex-col space-y-4" netlify onSubmit={(e) => {
            e.preventDefault();
            alert('Message sent successfully!');
          }}>
            <div>
              <label className="block text-gray-700 font-semibold mb-2" htmlFor="name">
                Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="Your Name"
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2" htmlFor="message">
                Message
              </label>
              <textarea
                id="message"
                rows="5"
                placeholder="Your message..."
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              ></textarea>
            </div>
            <button
              type="submit"
              className="bg-cyan-500 text-white font-semibold py-2 px-6 rounded-md hover:bg-cyan-700 transition-colors"
            >
              Send Message
            </button>
          </form>
        </div>

        {/* Support Info */}
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-semibold text-cyan-700 mb-4">Other Ways to Reach Us</h2>
          <p className="text-gray-700 mb-2">Email: dshivam698@gmail.com</p>
          <p className="text-gray-700 mb-2">Phone: +91 8839651800</p>
          <p className="text-gray-700 mb-2">Phone: +91 8827677790</p>
          <p className="text-gray-700 mb-4">Address: Raipur, Chhatisgarh</p>
          <div className="flex justify-center space-x-6 mt-4">
            <a href="#" className="text-cyan-500 hover:text-cyan-700">Twitter</a>
            <a href="#" className="text-cyan-500 hover:text-cyan-700">LinkedIn</a>
            <a href="https://github.com/SoulEater001/P2P_File_Transfer-React" className="text-cyan-500 hover:text-cyan-700">GitHub</a>
          </div>
        </div>
      </div>
    </>
  );
}

export default Contact;
