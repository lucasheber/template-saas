import { handleAuth } from "@/app/actions/handle-auth";
import { auth } from "@/app/lib/auth";
import { redirect } from "next/navigation";

export default async function Login() {
  // redirect to the home page if the user is already authenticated
  const sessionn = await auth();
  if (sessionn && sessionn.user) {
    redirect("/dash");
  }
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-24">
      <h1 className="text-4xl font-bold">Login Page</h1>

      <form
        action={handleAuth}
        className="flex flex-col items-center justify-center min-h-screen"
      >
        <button className="border px-2 py-1 pointer" type="submit">
          Signin with Google
        </button>
      </form>
    </div>
  );
}
