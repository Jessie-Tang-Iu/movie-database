import Link from "next/link";


export default function Home() {

  let linkStyles = "text-cyan-600 underline hover:text-cyan-300";

  return (
    <main>
      <h1 className="text-3xl"><strong>Welcome to Movie Database</strong></h1>
      <br />
      <h2>Please Login with your account </h2>
    </main>
  );
}
