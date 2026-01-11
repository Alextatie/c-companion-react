'use client';

import Link from 'next/link';
import { auth } from '../firebase/config';
import { useAuthState } from 'react-firebase-hooks/auth';

function ProfilePage() {
  const [user, loading] = useAuthState(auth);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen -mt-50 text-white text-center px-4 pt-30">
    <div>
    [TBD]
    </div>
    <div>
    Name:     [{user?.email?.split('@')[0] || 'Guest'}]
    </div>
    <div>
    Progress: [---/18]
    </div>

  {/* Back button container */}
  <div className="mt-12">
  
  
  <Link href="/" className="bg-[rgb(255,255,255,0.65)] text-shadow-lg shadow-lg w-full text-[rgb(86,116,145,0.85)]
  text-lg px-3 py-2 rounded hover:bg-[rgb(255,255,255)] transition flex items-center">
    <span>←</span> <span>Back</span>
  </Link>

  </div>
</div>
  );
}

export default ProfilePage;
