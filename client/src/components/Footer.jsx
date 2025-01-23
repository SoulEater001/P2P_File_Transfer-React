import React from 'react'
import { Link } from 'react-router-dom';
function Footer() {
    return (
        <footer className="flex w-full flex-row flex-wrap items-center justify-center gap-y-6 gap-x-12  py-6 text-center md:justify-between fixed bg-purple-500 text-white">
          <Link color="blue-gray" className="font-normal px-4">
            &copy; 2024 all rights reserved
          </Link>
          <ul className="flex flex-wrap items-center gap-y-2 gap-x-8 px-10 ">
            <li>
              <Link
                to="/about"
                color="blue-gray"
                className="font-normal transition-colors hover:text-blue-500 focus:text-blue-500"
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                to="*"
                color="blue-gray"
                className="font-normal transition-colors hover:text-blue-500 focus:text-blue-500"
              >
                License
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                color="blue-gray"
                className="font-normal transition-colors hover:text-blue-500 focus:text-blue-500"
              >
                Contact Us
              </Link>
            </li>
          </ul>
        </footer>
      );
}

export default Footer


