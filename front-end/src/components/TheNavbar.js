import { Disclosure } from '@headlessui/react';
import { React } from 'react';
import { FaSignOutAlt } from 'react-icons/fa';
// import { BellIcon, MenuIcon, XIcon } from '@heroicons/react/outline'
import { HiMenu, HiX } from 'react-icons/hi';
import { Link } from 'react-router-dom';

const TheNavbar = () => {
  const user={emai:"ilyass",displayName:"ilyass"}
  return (
    <Disclosure as="nav">
      {({ open }) => (
        <>
          <div className="px-2 sm:px-6 lg:px-2 bg-garynav ">
            <div className="relative flex items-center justify-between h-16 bg-garynav ">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden bg-garynav">
                {/* Mobile menu button*/}
                <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <HiX className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <HiMenu className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start bg-garynav ">
                <div className="flex-shrink-0 flex items-center bg-garynav">
                  <Link to="/">
                    <img
                      className="block lg:hidden w-10 h-15 m-2 "
                      src="/img/logowhite.png"
                      alt="Disin"
                    />
                  </Link>
                  <Link to="/">
                    <img
                      className="hidden lg:block w-15 h-10 m-2"
                      src="/img/logowhite.png"
                      alt="Disin"
                    />
                  </Link>
                </div>
                <div className="hidden sm:block sm:ml-6">
                  <div className="flex space-x-4">
                    <Link
                      to="/"
                      className="px-3  py-4 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                    >
                      Home
                    </Link>
                    
                    <Link
                      to="/departments"
                      className="px-3 py-4 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                    >
                      Departments
                    </Link>
                    <Link
                      to="/contact"
                      className="px-3 py-4 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                    >
                      Contact
                    </Link>
                    <Link
                      to="/login"
                      className="px-3 py-4 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                    >
                      Get Appointment
                    </Link>
                    {!user?.email ? (
                      <>
                        <Link
                          to="/login"
                          className="px-3 py-4 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                        >
                          Login
                        </Link>
                        
                      </>
                    ) : (
                      ''
                    )}
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 block sm:flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                
                <div className="ml-3 relative">
                  <div>
                    <div className="bg-gray-800 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                        
                        <img
            src="/img/logo2.png" // Replace with your logo path
            alt="Company Logo"
            className="w-15 h-10"
          />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-garynav">
              <Link
                to="/"
                className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                Home
              </Link>
              
              <Link
                to="/departments"
                className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                All Departments
              </Link>
              <Link
                to="/contact"
                className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                Contact
              </Link>
              <Link
                to="/login"
                className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                Get Appointment
              </Link>
              {!user?.email ? (
                <>
                  <Link
                    to="/login"
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    Login
                  </Link>
                  
                </>
              ) : (
                ''
              )}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default TheNavbar;
