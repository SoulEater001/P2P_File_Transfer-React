import React from 'react';
import { Link } from 'react-router-dom';
import { FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="bg-cyan-700 text-white mt-12">
      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Left side: Brand & Copyright */}
        <div className="text-center md:text-left">
          <h2 className="text-xl font-bold mb-1">ShareWare</h2>
          <p className="text-sm">&copy; 2024 ShareWare. All rights reserved.</p>
        </div>

        {/* Center: Quick Links */}
        <ul className="flex flex-wrap justify-center gap-6 text-sm">
          <li>
            <Link
              to="/about"
              className="hover:text-cyan-300 transition-colors"
            >
              About Us
            </Link>
          </li>
          <li>
            <Link
              to="/contact"
              className="hover:text-cyan-300 transition-colors"
            >
              Contact
            </Link>
          </li>
          <li>
            <Link
              to="/terms"
              className="hover:text-cyan-300 transition-colors"
            >
              Terms &amp; Conditions
            </Link>
          </li>
          <li>
            <Link
              to="/privacy"
              className="hover:text-cyan-300 transition-colors"
            >
              Privacy Policy
            </Link>
          </li>
        </ul>

        {/* Right side: Social Icons */}
        <div className="flex gap-4 text-xl">
          <a href="https://github.com/SoulEater001/P2P_File_Transfer-React" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-300 transition-colors">
            <FaGithub />
          </a>
          <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-300 transition-colors">
            <FaTwitter />
          </a>
          <a href="https://linkedin.com/" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-300 transition-colors">
            <FaLinkedin />
          </a>
        </div>
      </div>

      {/* Bottom: Small disclaimer */}
      <div className="bg-cyan-800 text-center text-xs py-2">
        <p>Files are securely transferred via P2P technology. Use responsibly.</p>
      </div>
    </footer>
  );
}

export default Footer;
