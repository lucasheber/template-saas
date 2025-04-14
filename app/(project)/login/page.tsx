import { handleAuth } from "@/app/actions/handle-auth";

export default function Login() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-24">
      <h1 className="text-4xl font-bold">Login Page</h1>

      <form action={handleAuth} className="flex flex-col items-center justify-center min-h-screen">
        <button className="border px-2 py-1 pointer" type="submit">Signin with Google</button>
      </form>
    </div>
  );
}
