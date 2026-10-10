'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Product {
  id: string;
  title: string;
  price: number;
  category: string;
  size: string;
  condition: string;
  description: string;
  image_url: string;
  images?: string[];
}

const CAROUSEL_SLIDES = [
  {
    id: 1,
    title: 'Vestido Boho Vintage',
    subtitle: 'Edição limitada em segunda mão com detalhes únicos.',
    image: '/vestido.jpg',
    tag: 'Destaque'
  },
  {
    id: 2,
    title: 'Especial Natal na Foz',
    subtitle: 'Peças aconchegantes e seleção especial para a época festiva.',
    image: '/lojanatal.jpg',
    tag: 'Época Festiva'
  },
  {
    id: 3,
    title: 'Gorro Carhartt Azul',
    subtitle: 'Estilo urbano e proteção para os dias frios.',
    image: '/gorro.jpg',
    tag: 'Novidade'
  },
  {
    id: 4,
    title: 'Casaco Acolchoado Cinza',
    subtitle: 'Conforto e elegância para a estação.',
    image: '/casaco.jpg',
    tag: 'Saldos'
  }
];

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setProducts(data || []);
      } catch (err) {
        console.error('Erro ao carregar produtos:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % CAROUSEL_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const openProductModal = (product: Product) => {
    setSelectedProduct(product);
    setActiveImageIndex(0);
  };

  const getProductImages = (product: Product): string[] => {
    if (product.images && product.images.length > 0) {
      return product.images;
    }
    return [product.image_url];
  };

  return (
    <div className="relative min-h-screen text-stone-100 selection:bg-stone-700 selection:text-white">
      {/* BACKGROUND DA LOJA */}
      <div className="fixed inset-0 -z-10 overflow-hidden bg-stone-950">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25 scale-105"
          style={{ backgroundImage: `url('/bg-loja.jpg')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-stone-950/80 via-stone-900/60 to-stone-950/90" />
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* CARROSSEL */}
        <section className="relative mb-16 rounded-3xl overflow-hidden bg-stone-900/60 border border-white/10 shadow-2xl">
          <div className="relative h-[380px] sm:h-[480px] w-full overflow-hidden">
            {CAROUSEL_SLIDES.map((slide, index) => (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-all duration-700 ease-in-out grid grid-cols-1 md:grid-cols-12 items-center ${
                  index === currentSlide ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-95 z-0 pointer-events-none'
                }`}
              >
                {/* IMAGEM DO PRODUTO */}
                <div className="absolute inset-0 md:relative md:col-span-7 h-full w-full overflow-hidden">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-stone-950 via-stone-950/60 to-transparent" />
                </div>

                {/* TEXTO DO SLIDE */}
                <div className="relative z-20 md:col-span-5 p-6 sm:p-10 flex flex-col items-start justify-center text-left">
                  <span className="px-3.5 py-1 mb-3 rounded-full text-xs uppercase tracking-widest font-semibold bg-amber-400/20 text-amber-200 border border-amber-300/30 backdrop-blur-md">
                    {slide.tag}
                  </span>
                  <h2 className="text-3xl sm:text-5xl font-light text-amber-50 tracking-wide mb-3 leading-tight">
                    {slide.title}
                  </h2>
                  <p className="text-stone-300 text-sm sm:text-base font-light leading-relaxed mb-6">
                    {slide.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* BOTÕES */}
          <button
            onClick={() => setCurrentSlide((prev) => (prev - 1 + CAROUSEL_SLIDES.length) % CAROUSEL_SLIDES.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full backdrop-blur-md bg-stone-950/60 hover:bg-amber-500/20 text-white flex items-center justify-center border border-white/20 transition-all shadow-lg"
          >
            ❮
          </button>
          <button
            onClick={() => setCurrentSlide((prev) => (prev + 1) % CAROUSEL_SLIDES.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full backdrop-blur-md bg-stone-950/60 hover:bg-amber-500/20 text-white flex items-center justify-center border border-white/20 transition-all shadow-lg"
          >
            ❯
          </button>

          {/* INDICADORES */}
          <div className="absolute bottom-5 right-6 z-30 flex gap-2">
            {CAROUSEL_SLIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === currentSlide ? 'w-8 bg-amber-300' : 'w-2 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        </section>

        {/* CATÁLOGO DE PRODUTOS */}
        <section className="text-center mb-12 max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-extralight tracking-wider text-amber-50/90 mb-3">
            Catálogo de Peças Únicas
          </h1>
          <p className="text-stone-300 font-light text-sm sm:text-base leading-relaxed">
            Explora a nossa seleção exclusiva de vestuário e casacos em segunda mão no Mercado da Foz.
          </p>
        </section>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="px-6 py-4 rounded-2xl backdrop-blur-md bg-stone-900/50 border border-white/10 text-stone-300">
              A carregar peças exclusivas...
            </div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-block p-8 rounded-2xl backdrop-blur-md bg-stone-900/40 border border-white/10 text-stone-300">
              Ainda não existem produtos disponíveis no catálogo. Adiciona no Painel Admin!
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => {
              const gallery = getProductImages(product);
              return (
                <div
                  key={product.id}
                  onClick={() => openProductModal(product)}
                  className="group cursor-pointer rounded-2xl overflow-hidden backdrop-blur-md bg-stone-900/40 border border-white/10 hover:border-amber-200/40 transition-all duration-300 hover:-translate-y-1 shadow-xl hover:shadow-2xl flex flex-col"
                >
                  <div className="relative aspect-[3/4] overflow-hidden bg-stone-900/60">
                    <img
                      src={gallery[0]}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 backdrop-blur-md bg-stone-950/70 border border-white/10 text-amber-200 font-semibold text-sm px-3 py-1 rounded-full">
                      {product.price.toFixed(2)} €
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2 mb-2">
                        <h3 className="text-lg font-medium text-stone-100 group-hover:text-amber-200 transition-colors">
                          {product.title}
                        </h3>
                        <span className="text-xs uppercase tracking-wider px-2 py-0.5 rounded backdrop-blur-md bg-white/10 text-stone-300">
                          Tamanho {product.size}
                        </span>
                      </div>
                      <p className="text-xs text-stone-400 line-clamp-2 font-light">
                        {product.description || 'Sem descrição disponível.'}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/10 flex justify-between items-center text-xs text-stone-300">
                      <span>Estado: <strong className="text-stone-200 font-normal">{product.condition}</strong></span>
                      <span className="text-amber-200/80 font-medium group-hover:translate-x-1 transition-transform">
                        Ver detalhes &rarr;
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* MODAL DETALHADA COM GALERIA */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-md">
          <div
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl backdrop-blur-2xl bg-stone-900/80 border border-white/20 shadow-2xl p-6 sm:p-8 text-stone-100"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full backdrop-blur-md bg-white/10 hover:bg-white/20 text-stone-200 hover:text-white flex items-center justify-center text-xl transition-colors border border-white/10"
            >
              ✕
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-stone-950 border border-white/10 shadow-inner">
                  <img
                    src={getProductImages(selectedProduct)[activeImageIndex]}
                    alt={selectedProduct.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex gap-2 overflow-x-auto pb-2">
                  {getProductImages(selectedProduct).map((imgUrl, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-16 h-20 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                        idx === activeImageIndex
                          ? 'border-amber-300 scale-105 shadow-lg'
                          : 'border-white/10 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div>
                    <span className="text-xs uppercase tracking-widest text-amber-300/80 font-medium">
                      {selectedProduct.category}
                    </span>
                    <h2 className="text-3xl font-light text-stone-100 mt-1">
                      {selectedProduct.title}
                    </h2>
                    <div className="text-2xl font-semibold text-amber-200 mt-2">
                      {selectedProduct.price.toFixed(2)} €
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 py-3 border-y border-white/10 text-sm">
                    <div>
                      <span className="text-stone-400 block text-xs">Tamanho</span>
                      <span className="font-medium text-stone-200">{selectedProduct.size}</span>
                    </div>
                    <div>
                      <span className="text-stone-400 block text-xs">Estado de Conservação</span>
                      <span className="font-medium text-stone-200">{selectedProduct.condition}</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-stone-300 mb-2">Descrição do Artigo</h4>
                    <p className="text-sm text-stone-300 leading-relaxed font-light whitespace-pre-line">
                      {selectedProduct.description || 'Sem descrição fornecida para este artigo.'}
                    </p>
                  </div>
                </div>

                <a
                  href={`https://wa.me/351910000000?text=${encodeURIComponent(
                    `Olá! Tenho interesse em adquirir o artigo: "${selectedProduct.title}" (${selectedProduct.price.toFixed(2)}€) da Loja 19 do Mercado.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-200 to-amber-400 text-stone-900 font-semibold text-center hover:from-amber-300 hover:to-amber-500 transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  💬 Reservar / Comprar no WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}