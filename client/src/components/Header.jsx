import React from 'react'
import { Link } from 'react-router-dom'

function Header() {
  return (
    <div className="m-4">
      <nav className="container mx-auto bg-purple-500 rounded-full border-2 px-12 py-2 shadow-md">
        <div className="flex justify-between items-center">
        <Link to="/"><h1 className="text-2xl font-bold text-white">ShareWare</h1></Link>
          
          <div className="flex space-x-10 text-xl">
            <Link to="/" className="text-white hover:text-blue-200">Home</Link>
            <Link to="/about" className="text-white hover:text-blue-200">About</Link>
            <Link to="/contact" className="text-white hover:text-blue-200">Contact</Link>
          </div>
        </div>
      </nav>
    </div>
  )
}

export default Header