import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-zippy-paper">
      <div className="max-w-md w-full bg-white/70 backdrop-blur-sm p-8 rounded-2xl border border-zippy-paperBorder shadow-sm">
        <span className="text-4xl font-serif font-bold text-zippy-red block mb-2">404</span>
        <h1 className="text-2xl font-serif font-bold text-zippy-maroon mb-2">
          Page Nahi Mila
        </h1>
        <p className="text-zippy-muted text-sm mb-6">
          Lagta hai aap galat table par aa gaye hain. Digital menu dekhne ke liye home par jayein.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center min-h-[44px] px-6 py-2.5 rounded-full bg-zippy-red text-white font-medium text-sm hover:bg-zippy-maroon transition-colors"
        >
          Menu Par Wapas Jayein
        </Link>
      </div>
    </main>
  );
}
