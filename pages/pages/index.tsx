import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-black via-gray-900 to-red-900 text-white">
      <h1 className="text-5xl font-bold mb-6">Lucifer Tipp</h1>
      <p className="max-w-xl text-center text-lg mb-10">
        A fény, ami elvezet a győztes tippekhez.  
        Itt nem csak sportfogadásról van szó – itt a manipuláció művészete,  
        ahol az előny mindig a tiéd lehet.  
        <br /><br />
        Csatlakozz, és fedezd fel, amit mások soha nem látnak meg időben!
      </p>

      <div className="flex space-x-6">
        <Link href="/register">
          <button className="px-6 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-lg font-semibold shadow-lg">
            Regisztráció
          </button>
        </Link>
        <Link href="/login">
          <button className="px-6 py-3 rounded-2xl bg-gray-700 hover:bg-gray-800 text-lg font-semibold shadow-lg">
            Bejelentkezés
          </button>
        </Link>
      </div>

      <p className="mt-10 text-sm opacity-70">
        Előfizetés: Fejlesztés alatt 🔧
      </p>
    </div>
  );
}
