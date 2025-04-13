'use client';

import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase/config';
import Link from 'next/link';
import { signOut, signInAnonymously } from 'firebase/auth';

const HomePage = () => {
  const [user, loading] = useAuthState(auth);  // Get both user and loading state

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Error signing out: ", err);
    }
  };

  if (loading) {
    // Show a loading spinner while Firebase is determining if the user is signed in
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="border-4 border-t-4 border-gray-500 border-t-transparent rounded-full w-16 h-16 animate-spin"></div>
      </div>
    );
  }

  if (user) {
    return (
      <div className=" mx-auto mt-5 p-4">
        <h2 className="text-2xl text-shadow-lg font-bold text-7xl text-center">
          C-companion
        </h2>
        <h2 className="text-2xl text-shadow-lg font-bold text-2xl mt-2 text-center">
          Welcome, {user?.email?.split('@')[0] || 'Guest'}!
        </h2>
        <div className="w-[280px] mx-auto p-4">
        <div className="flex flex-col gap-2">
          <button className="bg-[rgba(86,117,145,0.85)] text-shadow-lg shadow-lg text-white text-4xl py-2 rounded hover:bg-[rgb(68,96,123,0.85)] transition">
            Learn
          </button>
          <button className="bg-[rgb(86,116,145,0.85)] text-shadow-lg shadow-lg  text-white text-4xl py-2 rounded hover:bg-[rgb(68,96,123,0.85)] transition">
            Play
          </button>
          <button className="bg-[rgb(86,116,145,0.85)] text-shadow-lg shadow-lg  text-white text-4xl py-2 rounded hover:bg-[rgb(68,96,123,0.85)] transition">
            Profile
          </button>
          <div className="flex gap-2">
          <button className="bg-[rgb(86,116,145,0.85)] text-shadow-lg shadow-lg  w-full text-white text-2xl py-2 rounded hover:bg-[rgb(68,96,123,0.85)] transition">
              Options
            </button>
              <button className="bg-[rgb(86,116,145,0.85)] text-shadow-lg shadow-lg  w-full text-white text-2xl py-2 rounded hover:bg-[rgb(68,96,123,0.85)] transition">
              <Link href="/about">
                About
                </Link>
             </button>
          </div>

          <button onClick={handleLogout} className="bg-[rgb(205,70,70,0.85)] shadow-lg text-shadow-lg  text-white text-4xl py-2 rounded hover:bg-[rgb(179,56,56,0.85)] transition">
            Logout
          </button>
        </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-[305px] mx-auto mt-10 p-4 rounded shadow-lg bg-[rgba(86,118,145,0.85)]">
      <h1 className="text-4xl text-shadow-lg font-bold mb-6 text-center text-white">C-companion</h1>
        <div className="flex flex-col gap-4">
          {/* Row for Sign Up and Log In buttons */}
          <div className="flex gap-4 ">
            <Link href="/signup">
              <button
                className="bg-[rgb(95,165,195,0.85)] text-shadow-lg shadow-lg text-white text-xl py-2 rounded w-32 hover:bg-[rgb(116,181,209,0.85)] transition"
              >
                Sign Up
              </button>
            </Link>
            <Link href="/login">
              <button
                className="bg-[rgb(107,195,95,0.85)] text-shadow-lg shadow-lg text-white text-xl py-2 rounded w-32 hover:bg-[rgb(129,218,133,0.85)] transition"
              >
                Log In
              </button>
            </Link>
          </div>
          
          {/* Guest Log In Button */}
          <button
            onClick={async () => {
              await signInAnonymously(auth);
            }}
            className="bg-[rgb(62,83,101,0.85)] text-shadow-lg shadow-lg text-white text-xl py-2 rounded w-full hover:bg-[rgb(72,97,118,0.85))] transition"
          >
            Log In as Guest
          </button>
        </div>
    </div>
  );
};

export default HomePage;
