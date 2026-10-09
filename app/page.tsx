'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';

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

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

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
      {/* BACKGROUND DA LOJA COM OVERLAY SUAVE */}
      <div className="fixed inset-0 -z-10 overflow-hidden bg-stone-950">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 scale-105"
          style={{ backgroundImage: `url('/bg-loja.jpg')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-stone-950/70 via-stone-900/50 to-stone-950/90" />
      </div>

      {/* NAVBAR EM VIDRO OPACO */}
      <Navbar />

      {/* CONTEÚDO PRINCIPAL */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* CABEÇALHO */}
        <section className="text-center mb-16 max-w-3xl mx-auto">
          <div className="inline-block p-8 rounded-3xl backdrop-blur-xl bg-stone-900/40 border border-white/10 shadow-2xl">
            <h1 className="text-4xl sm:text-5xl font-extralight tracking-wider text-amber-50/90 mb-4">
              Loja 19 do Mercado
            </h1>
            <p className="text-stone-300 font-light text-base sm:text-lg leading-relaxed">
              Seleção exclusiva de vestuário e casacos em segunda mão no coração da Foz. Encontra peças únicas com história e elegância.
            </p>
          </div>
        </section>

        {/* GRELHA DE PRODUTOS */}
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