function LessonPage() {
  return (
    <div className="min-h-screen text-white px-4 pt-30 pb-10">
      <h1 className="text-5xl text-shadow-lg font-bold mb-8 text-center">Basics</h1>

      <div className="max-w-4xl mx-auto bg-[linear-gradient(180deg,#3ec49c,#3b9fb3)] rounded-xl p-8 md:p-12 shadow-lg">
        <h2 className="text-5xl font-light mb-4 text-center">What is C?</h2>

        <p className="text-xl leading-relaxed mb-4">
          <span className="text-[rgb(0,255,127)]">C</span> is a general-purpose programming language created by
          Dennis Ritchie at Bell Laboratories in <span className="text-[rgb(0,255,127)]">1972</span>.
        </p>

        <p className="text-xl leading-relaxed mb-10">
          It is a very popular language, despite being old. The main reason for its popularity is because it is a
          fundamental language in the field of computer science.
        </p>

        <h2 className="text-5xl font-light mb-6 text-center">Why learn C?</h2>

        <p className="text-xl leading-relaxed mb-3">
          - It is one of the most popular programming languages in the world.
        </p>

        <p className="text-xl leading-relaxed mb-3">
          - If you know <span className="text-[rgb(0,255,127)]">C</span>, you will have no problem learning other
          popular languages such as <span className="text-[rgb(0,255,127)]">Java, Python, C++, C#</span>, since the
          syntax is often similar.
        </p>

        <p className="text-xl leading-relaxed">
          - <span className="text-[rgb(0,255,127)]">C</span> is very fast compared to languages like Java and Python.
        </p>
      </div>
    </div>
  );
}

export default LessonPage;
