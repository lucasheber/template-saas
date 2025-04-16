import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-24">
      <h1 className="text-4xl font-bold">Landing Page</h1>

      <Link href="/login">
        <button className="btn btn-primary border-1 mt-4 p-2 rounded-2xl">Login</button>
      </Link>
    </div>
  );
}
