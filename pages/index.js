export default function Home() {
  return (
    <div style={{ 
      minHeight: "100vh", 
      display: "flex", 
      flexDirection: "column", 
      alignItems: "center", 
      justifyContent: "center", 
      background: "linear-gradient(to bottom, #111, #222)", 
      color: "white",
      textAlign: "center",
      fontFamily: "Arial, sans-serif",
      padding: "20px"
    }}>
      <h1 style={{ fontSize: "3rem", color: "#ff6600" }}>LuciferTipp</h1>
      <p style={{ fontSize: "1.2rem", maxWidth: "600px" }}>
        Üdv a fény útján. Itt nem csupán tippeket kapsz, hanem stratégiát és előnyt.
        A szerencse csak azoknak kedvez, akik tudják, mikor kell lépni. 
      </p>
      
      <div style={{ marginTop: "20px" }}>
        <button style={{ 
          padding: "10px 20px", 
          margin: "10px", 
          borderRadius: "8px", 
          border: "none", 
          background: "#ff6600", 
          color: "white", 
          fontSize: "1rem", 
          cursor: "pointer"
        }}>
          Bejelentkezés
        </button>
        
        <button style={{ 
          padding: "10px 20px", 
          margin: "10px", 
          borderRadius: "8px", 
          border: "none", 
          background: "#444", 
          color: "white", 
          fontSize: "1rem", 
          cursor: "pointer"
        }}>
          Regisztráció
        </button>
      </div>
      
      <p style={{ marginTop: "40px", fontStyle: "italic", color: "#aaa" }}>
        Előfizetés hamarosan elérhető – fejlesztés alatt.
      </p>
    </div>
  );
}
