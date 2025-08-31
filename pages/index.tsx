import React from "react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white flex flex-col items-center justify-center px-6">
      
      {/* Bemutatkozás */}
      <section className="text-center max-w-2xl mb-12">
        <h1 className="text-4xl font-bold mb-4">Üdv a Lucifertipp világában</h1>
        <p className="text-lg leading-relaxed text-gray-300">
          A fényhozó nem az árnyékokat mutatja meg, hanem az utat a sikerhez.
          Mi nem hiszünk a véletlenben – mi formáljuk azt. Tippjeinkkel
          esélyeid nem a vakszerencsére épülnek, hanem gondosan elemzett
          stratégiára.  
        </p>
        <p className="text-lg leading-relaxed text-gray-300 mt-4">
          Csatlakozz, és fedezd fel, milyen, amikor a játék többé nem csak
          szerencse – hanem irányított győzelem.
        </p>
      </section>

      {/* Gombok */}
      <section className="flex gap-6 mb-12">
        <a
          href="/login"
          className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg"
        >
          Bejelentkezés
        </a>
        <a
          href="/register"
          className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-6 py-3 rounded-lg shadow-lg"
        >
          Regisztráció
        </a>
      </section>

      {/* Előfizetés */}
      <section className="text-center max-w-xl border border-gray-700 p-6 rounded-xl shadow-lg bg-gray-800">
        <h2 className="text-2xl font-bold mb-3">Előfizetés</h2>
        <p className="text-gray-300 mb-4">
          Hamarosan elérhető! Dolgozunk azon, hogy exkluzív tartalmakat és
          bónuszokat biztosítsunk előfizetőinknek.  
        </p>
        <span className="px-4 py-2 bg-gray-600 text-sm rounded-lg">
          🚧 Fejlesztés alatt
        </span>
      </section>
    </div>
  );
}
