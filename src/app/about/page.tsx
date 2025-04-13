import Link from 'next/link';
import { FaGithub, FaLinkedin } from 'react-icons/fa';

function AboutPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen -mt-50 text-white text-center px-4 pt-30">
  <h1 className="text-4xl font-bold mb-4 max-w-lg">
    <span className="text-shadow-lg">Created by</span>{' '}
    <span className="drop-shadow-[1px_2px_2px_rgba(0,0,0,0.3)] bg-[linear-gradient(135deg,rgb(130,255,182),rgb(40,223,195))] bg-clip-text text-transparent">
      Alex Tatievsky
    </span>{' '}
    <span className="text-shadow-lg">for a software engineering college project.</span>
  </h1>
  <div className="flex gap-6">
    <a
      href="https://github.com/Alextatie"
      target="_blank"
      rel="noopener noreferrer"
      className="hover:text-[rgb(147,255,207)] transition drop-shadow-lg"
    >
      <FaGithub size={28} />
    </a>
    <a
      href="https://www.linkedin.com/in/alex-tatievsky/"
      target="_blank"
      rel="noopener noreferrer"
      className="transition hover:text-[rgb(147,255,207)] transition drop-shadow-lg"
    >
      <FaLinkedin size={28} />
    </a>
  </div>

  {/* Back button container */}
  <div className="mt-12">
  <button className="bg-[rgb(255,255,255,0.65)] text-shadow-lg shadow-lg w-full text-[rgb(86,116,145,0.85)] text-lg px-3 py-2 rounded hover:bg-[rgb(255,255,255)] transition flex items-center">
  <Link href="/" className="flex items-center gap-3"> {/* Added flex and gap-2 */}
    <span>←</span> <span>Back</span>
  </Link>
</button>
  </div>
</div>
  );
}

export default AboutPage;
