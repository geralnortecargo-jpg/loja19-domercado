'use client';

import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function AdminPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('casacos');
  const [size, setSize] = useState('M');
  const [condition, setCondition] = useState('Excelente estado');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile) {
      setMessage('Por favor, seleciona uma imagem.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('produtos')
        .upload(fileName, imageFile);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('produtos')
        .getPublicUrl(fileName);

      const imageUrl = urlData.publicUrl;

      const { error: insertError } = await supabase.from('products').insert([
        {
          title,
          price: parseFloat(price),
          category,
          size,
          condition,
          description,
          image_url: imageUrl,
        },
      ]);

      if (insertError) throw insertError;

      setMessage('✅ Produto adicionado com sucesso!');
      setTitle('');
      setPrice('');
      setDescription('');
      setImageFile(null);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Ocorreu um erro ao guardar.';
      setMessage(`❌ Erro: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-xl shadow-sm my-8 border border-stone-200">
      <h1 className="text-2xl font-serif font-bold text-stone-900 mb-6">
        Adicionar Nova Peça
      </h1>

      {message && (
        <div className="mb-4 p-3 rounded bg-stone-100 text-stone-800 text-sm font-medium">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">
            Fotografia da Peça
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            className="w-full text-sm text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-stone-900 file:text-white hover:file:bg-stone-800 cursor-pointer"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">
            Título / Nome da Peça
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: Casaco de Lã Vintage"
            className="w-full p-2.5 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-800"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Preço (€)
            </label>
            <input
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="25.00"
              className="w-full p-2.5 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-800"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Tamanho
            </label>
            <input
              type="text"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              placeholder="Ex: S, M, L, Único"
              className="w-full p-2.5 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-800"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Categoria
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2.5 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-800 bg-white"
            >
              <option value="casacos">Casacos & Sobretudos</option>
              <option value="vestidos">Vestidos & Saias</option>
              <option value="camisolas">Camisolas & Tops</option>
              <option value="calcas">Calças & Calções</option>
              <option value="acessorios">Acessórios</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Estado
            </label>
            <input
              type="text"
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              placeholder="Ex: Como novo"
              className="w-full p-2.5 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-800"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">
            Descrição / Detalhes
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Detalhes sobre o tecido, marca ou particularidades..."
            className="w-full p-2.5 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-800"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-amber-900 hover:bg-amber-800 text-white font-medium rounded-lg transition disabled:opacity-50"
        >
          {loading ? 'A guardar peça...' : 'Publicar Peça'}
        </button>
      </form>
    </div>
  );
}