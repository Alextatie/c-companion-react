import Link from 'next/link';

function LeaderboardsPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen -mt-50 text-white text-center px-4 pt-30">
    <div className='text-2xl'>
    Leaderboards
    </div>

  {/* Back button container */}
  <div className="mt-12">
  
  
  <Link href="./" className="bg-[rgb(255,255,255)] text-shadow-lg shadow-lg w-full text-[rgb(86,116,145)]
  text-lg px-3 py-2 rounded hover:bg-[rgb(255,255,255)] transition flex items-center">
    <span>←</span> <span>Back</span>
  </Link>

  </div>
</div>
  );
}

export default LeaderboardsPage;


