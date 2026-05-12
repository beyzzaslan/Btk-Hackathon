function Navbar() {
  return (
    <nav className="w-full flex justify-between items-center px-8 py-4 bg-zinc-950 border-b border-zinc-800">

      <h1 className="text-2xl font-bold text-white">
        TrustLens AI
      </h1>

      <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white">
        Analyze
      </button>

    </nav>
  )
}

export default Navbar