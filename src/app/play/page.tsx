import Link from 'next/link';

function PlayPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen -mt-40 text-white text-center px-4 pt-30">

      {/* Title */}
      <div className="text-5xl text-shadow-lg font-bold mb-5">
    Select a game
    </div>
    <div className="w-[280px] mx-auto p-4">
          <div className="flex flex-col gap-2">

            {/* Learn */}
            <Link
              href="play/code_fixer"
              className="bg-[rgb(86,117,145)] text-shadow-lg shadow-lg text-white text-4xl py-2 rounded text-center hover:bg-[rgb(68,96,123)] transition"
            >
              Code Fixer
            </Link>

            {/* Play */}
            <Link
              href="play/quiz_rush"
              className="bg-[rgb(86,116,145)] text-shadow-lg shadow-lg text-white text-4xl py-2 rounded text-center hover:bg-[rgb(68,96,123)] transition"
            >
              Quiz Rush
            </Link>

            {/* Profile */}
            <Link
              href="play/leaderboards"
              className="bg-[rgb(86,116,145)] text-shadow-lg shadow-lg text-white text-4xl py-2 rounded text-center hover:bg-[rgb(68,96,123)] transition"
            >
              Leaderboards
            </Link>

          </div>
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

export default PlayPage;

