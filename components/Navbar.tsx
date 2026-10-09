import Link from "next/link";

export default function Navbar() {
  return (
    <header className="bg-stone-900 text-stone-100 shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold tracking-wide hover:text-stone-300 transition-colors">
          Loja 19 do Mercado
        </Link>
        
        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link href="/" className="hover:text-stone-300 transition-colors">
            Catálogo
          </Link>
          <Link 
            href="/admin" 
            className="bg-stone-100 text-stone-900 px-3 py-1.5 rounded-md font-semibold hover:bg-stone-200 transition-colors"
          >
            Painel Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}