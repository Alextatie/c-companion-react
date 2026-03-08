'use client';

import Link from 'next/link';
import { auth } from '../firebase/config';
import { useAuthState } from 'react-firebase-hooks/auth';

function ProfilePage() {
  const [user, loading] = useAuthState(auth);
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="border-4 border-t-4 border-white border-t-transparent rounded-full w-16 h-16 animate-spin"></div>
      </div>
    );
  }
  if (user && !user.isAnonymous) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen -mt-50 text-white text-center px-4 pt-30">
      <div>
      [WIP]
      </div>
      <div>
      Name:     [{user?.email?.split('@')[0] || 'Guest'}]
      </div>
      <div>
      Progress: [---/18]
      </div>

    {/* Back button container */}
    <div className="mt-12">
    
    
    <Link href="/" className="bg-white text-shadow-lg shadow-lg w-full text-[#5d9d87] text-lg px-3 py-2 rounded hover:bg-[rgb(214,232,220)] transition flex items-center cursor-pointer">
      <span>{'<-'}</span> <span className="ml-1">Back</span>
    </Link>

    </div>
  </div>
    );
  }
  else{
    return (
      <div className="flex flex-col items-center justify-center min-h-screen -mt-50 text-white text-center px-4 pt-30">
      <div>
      [WIP]
      </div>
      <div>
      Sign up to create a profile.
      </div>

    {/* Back button container */}
    <div className="mt-12">
    
    
    <Link href="/" className="bg-white text-shadow-lg shadow-lg w-full text-[#5d9d87] text-lg px-3 py-2 rounded hover:bg-[rgb(214,232,220)] transition flex items-center cursor-pointer">
      <span>{'<-'}</span> <span className="ml-1">Back</span>
    </Link>

    </div>
  </div>
    );
  }
}

export default ProfilePage;



