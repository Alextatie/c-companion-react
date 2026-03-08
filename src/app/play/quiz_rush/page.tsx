import Link from 'next/link';

function QuizRushPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen -mt-50 text-white text-center px-4 pt-30">
    <div className='text-2xl'>
    Quiz Rush
    </div>

  {/* Back button container */}
  <div className="mt-12">
  
  
  <Link href="./" className="bg-white text-shadow-lg shadow-lg w-full text-[#5d9d87] text-lg px-3 py-2 rounded hover:bg-[rgb(214,232,220)] transition flex items-center cursor-pointer">
    <span>{'<-'}</span> <span className="ml-1">Back</span>
  </Link>

  </div>
</div>
  );
}

export default QuizRushPage;



