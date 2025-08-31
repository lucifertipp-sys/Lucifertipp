export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold mb-4 text-red-500">LuciferTipp</h1>

      <div className="max-w-2xl text-center space-y-4">
        <p>
          „A sportfogadásban sokan buknak – mert túl sok zaj, túl sok szelvény között kell válogatniuk.
          Itt más a játék. Itt nincs káosz. Itt csak a nyerés van.”
        </p>

        <p>
          👉 Minden csomag pontosan <b>1 szelvényt</b> tartalmaz – a legjobb, a legbiztosabb.
        </p>
        <p>
          👉 Többféle csomag közül választhatsz, különböző oddsokkal – attól függően, mennyi kockázatot és mennyi profitot akarsz.
        </p>
        <p>
          👉 És ha most regisztrálsz, hetente <b>2 ingyenes tippet</b> is kapsz, amit máshol nem érhetsz el.
        </p>

        <p>
          Ez nem szerencsejáték. Ez stratégia.  
          A döntés egyszerű: velünk játszol és előnyben vagy, vagy kimaradsz és mások viszik el a nyereményeket.
        </p>

        <div className="mt-6 space-y-2">
          <p>⚡ Csak a regisztrált tagok láthatják a tippeket.</p>
          <p>⚡ A nyerők mindig időben lépnek.</p>
          <p>⚡ A többiek csak későn jönnek rá, mit veszítettek.</p>
        </div>
      </div>

      <div className="mt-8 space-x-4">
        <a href="/login" className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded">
          Bejelentkezés
        </a>
        <a href="/register" className="bg-gray-700 hover:bg-gray-800 px-4 py-2 rounded">
          Regisztráció
        </a>
      </div>

      <div className="mt-10 p-4 border border-gray-600 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Előfizetés</h2>
        <p>💡 Előfizetéses csomagok hamarosan elérhetők! (Fejlesztés alatt)</p>
      </div>
    </div>
  )
}
