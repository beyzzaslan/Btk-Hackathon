import Navbar from "../components/Navbar"

function Home() {
  return (
    <div className="bg-black min-h-screen text-white">

      <Navbar />

      <div className="flex flex-col items-center justify-center text-center mt-32 px-4">

        <h1 className="text-6xl font-bold mb-6">
          Detect Scam Products Instantly
        </h1>

        <p className="text-zinc-400 max-w-2xl mb-8">
          AI-powered product trust analysis for safer online shopping experiences.
        </p>

        <button className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-xl text-lg font-semibold">
          Start Analysis
        </button>

      </div>

    </div>
  )
}

export default Home