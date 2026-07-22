import Link from "next/link";

export default function NotFound() {
  return (
    <main className="not-found">
      <p className="eyebrow">404 · Fonus Studio</p>
      <h1>Esta página no existe.</h1>
      <p>The page you’re looking for could not be found.</p>
      <Link className="button button-primary" href="/">Volver al inicio</Link>
    </main>
  );
}
