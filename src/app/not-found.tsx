// app/not-found.tsx
export default function NotFound() {
  return (
    <div
      style={{
        height: "100vh",
        display: "grid",
        placeItems: "center",
        backgroundColor: "#1F1D2B",
        color: "#69EAE2",
        padding: "1rem",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <img
          src="/dashboard_home/404.png"
          alt="Personaje triste"
          style={{ maxWidth: "300px", marginBottom: "1rem" }}
        />
        <h1 style={{ fontSize: "4rem", marginBottom: "0.5rem" }}>404</h1>
        <p style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
          Parece que estás teniendo problemas.
        </p>
        <p style={{ fontSize: "1.2rem" }}>
          Por favor contacta a soporte: <strong>314 409 8591</strong>
        </p>
      </div>
    </div>
  );
}
