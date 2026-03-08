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
    return (
      <div className="fixed inset-0 z-[999] flex items-center justify-center">
        <div className="border-4 border-t-4 border-white border-t-transparent rounded-full w-16 h-16 animate-spin"></div>
      </div>
    );
  }

  return (
    <nav className="fixed top-0 left-0 w-full bg-transparent px-5 py-5 drop-shadow-lg z-50">
  <div className="flex justify-start items-center">
    <Link
      href="/"
      className="text-[rgb(86,116,145)] hover:text-[rgb(68,96,123)] transition"
    >
      <FaHome size={34} />
    </Link>
  </div>
</nav>

  

  );
};

export default Navbar;


