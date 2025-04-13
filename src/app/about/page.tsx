import { FaGithub, FaLinkedin } from 'react-icons/fa';

function AboutPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen -mt-50 text-white text-center px-4">
      <h1 className="text-4xl font-bold text-shadow-lg mb-4 max-w-lg">
        Created by <span className="">Alex Tatievsky</span> for a software engineering college project.
      </h1>
      <div className="flex gap-6">
        <a
          href="https://github.com/yourusername"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-300 transition"
        >
          <FaGithub size={28} />
        </a>
        <a
          href="https://linkedin.com/in/yourusername"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-300 transition"
        >
          <FaLinkedin size={28} />
        </a>
      </div>
    </div>
  )
}

export default AboutPage
