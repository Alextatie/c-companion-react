'use client';

import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase/config'; // Your Firebase config path
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const Dashboard = () => {
  const [user, loading] = useAuthState(auth); // Get user info from Firebase
  const router = useRouter();
  const [isUserReady, setIsUserReady] = useState(false); // Track if the user authentication status is ready

  // Ensure the page only renders if the user is signed in
  useEffect(() => {
    if (loading) return; // Don't proceed until loading is complete

    if (!user) {
      router.push('/'); // Redirect to login if not signed in
    } else {
      setIsUserReady(true); // Set user as ready to render the content if signed in
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    try {
      await signOut(auth); // Sign out the user
      router.push('/'); // Redirect to login page after sign out
    } catch (err) {
      console.error('Error signing out: ', err);
    }
  };

  // Display a loading message until the user is confirmed to be signed in
  if (loading || !isUserReady) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="border-4 border-t-4 border-gray-500 border-t-transparent rounded-full w-16 h-16 animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-sm mx-auto mt-10 p-4 border rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Welcome, {user ? user.email : 'Guest'}
      </h2>

      <div className="flex flex-col gap-4">
        {/* Vertical Layout for Buttons */}
        <button className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
          Learn
        </button>
        <button className="bg-green-600 text-white py-2 rounded hover:bg-green-700 transition">
          Play
        </button>

        {/* Options and About on the Same Row */}
        <div className="flex gap-4">
          <button className="bg-yellow-600 text-white py-2 rounded w-24 hover:bg-yellow-700 transition">
            Options
          </button>
          <button className="bg-purple-600 text-white py-2 rounded w-24 hover:bg-purple-700 transition">
            About
          </button>
        </div>

        {/* Profile Button */}
        <button className="bg-teal-600 text-white py-2 rounded hover:bg-teal-700 transition">
          Profile
        </button>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
