import { handleLogout } from "@/app/actions/handle-auth";
import { auth } from "@/app/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-24">
      <h1 className="text-4xl font-bold">Dashboard</h1>
      <p className="text-2xl font-semibold">Welcome, {session?.user?.name}</p>

      <Link href="/payments">
        <button className="btn btn-primary border">Payments</button>
      </Link>
      {session?.user?.email && (
        // logout button
        <div className="flex flex-col items-center justify-center min-h-screen">
          <form action={handleLogout}>
            <button className="border px-2 py-1 pointer rouded" type="submit">
              Sign out
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
