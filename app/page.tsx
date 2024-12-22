import Link from 'next/link'

export default function Home() {
  let href = '/journal'

  return (
    <div className="w-screen h-screen bg-black flex justify-center items-center text-white">
      <div className="w-full max-w-[600px] mx-auto">
        <h1 className="text-6xl mb-4">The best Journaling app, period.</h1>
        <p className="text-2xl text-white/60 mb-4">
          This was an exciting project I was hoping to build for everyone to
          use!
        </p>
        <div>
          <Link href={href}>
            <button className="bg-blue-600 px-4 py-2 rounded-lg text-xl">
              Get Started!
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
