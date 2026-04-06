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
              className="flex h-[52px] items-center justify-center rounded bg-[rgb(86,117,145)] text-center text-4xl leading-none text-shadow-lg shadow-lg text-white transition hover:bg-[rgb(68,96,123)]"
              style={{ fontSize: '36px' }}
            >
              Code Fixer
            </Link>

            {/* Play */}
            <Link
              href="play/time_attack"
              className="flex h-[52px] items-center justify-center rounded bg-[rgb(86,116,145)] text-center leading-none text-shadow-lg shadow-lg text-white transition hover:bg-[rgb(68,96,123)]"
              style={{ fontSize: '33px' }}
            >
              Time Attack
            </Link>

            {/* Profile */}
            <Link
              href="play/leaderboards"
              className="flex h-[52px] items-center justify-center rounded bg-[rgb(86,116,145)] text-center text-3xl leading-none text-shadow-lg shadow-lg text-white transition hover:bg-[rgb(68,96,123)]"
              style={{ fontSize: '30px' }}
            >
              Leaderboards
            </Link>

          </div>
        </div>

  {/* Back button container */}
  <div className="mt-12">
  
  
  <Link href="./Home" className="bg-white text-shadow-lg shadow-lg w-full text-[#5d9d87] text-lg px-3 py-2 rounded hover:bg-[rgb(214,232,220)] transition flex items-center cursor-pointer">
    <span>{'<-'}</span> <span className="ml-1">Back</span>
  </Link>

  </div>
</div>
  );
}

export default PlayPage;



