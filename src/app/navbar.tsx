// components/Navbar.tsx

'use client'; // Ensure this is a client-side component

import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase/config'; // Firebase config
import Link from 'next/link'; // Link component for navigation
import { FaHome, FaSignInAlt, FaUserAlt, FaSignOutAlt } from 'react-icons/fa'; // Icons

const Navbar = () => {
  const [user, loading] = useAuthState(auth); // Firebase hook to track user state

  if (loading) {
    return <div>Loading...</div>; // Optional loading state
  }

  return (
    <nav className="">
      <div className="flex justify-between items-center max-w-7xl mx-auto m-2">
        <div className="flex items-center gap-6">
          {/* Home Button */}
          <Link href="/" className="text-white flex items-center gap-2 hover:text-gray-400">
            <FaHome /> Home
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
