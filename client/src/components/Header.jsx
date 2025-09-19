import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <div className="m-4">
      <nav className="container mx-auto bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full border-2 px-12 py-2 shadow-lg">
        <div className="flex justify-between items-center">
          <Link to="/">
            <h1 className="text-2xl font-bold text-white">ShareWare</h1>
          </Link>
          <div className="flex space-x-10 text-xl">
            <Link to="/" className="text-white hover:text-cyan-200 transition">Home</Link>
            <Link to="/about" className="text-white hover:text-cyan-200 transition">About</Link>
            <Link to="/contact" className="text-white hover:text-cyan-200 transition">Contact</Link>
          </div>
        </div>
      </nav>
    </div>
  )
}

export default Header;
