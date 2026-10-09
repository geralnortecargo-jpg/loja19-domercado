'use client';

import { useState } from 'react';
import { supabase } from '../../lib/supabase';

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
    } catch (err: any) {
      setMessage(`❌ Erro: ${err.message || 'Falha ao guardar produto'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md my-8">
      <h1 className="text-2xl font-bold mb-6 text-stone-800">Adicionar Novo Produto</h1>

      {message && (
        <div className={`p-4 mb-4 rounded-md ${message.startsWith('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-stone-700">Título do Produto</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full rounded-md border border-stone-300 p-2 text-stone-900"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-stone-700">Preço (€)</label>
            <input
              type="number"
              step="0.01"
              required
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="mt-1 block w-full rounded-md border border-stone-300 p-2 text-stone-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700">Categoria</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1 block w-full rounded-md border border-stone-300 p-2 text-stone-900"
            >
              <option value="casacos">Casacos</option>
              <option value="vestidos">Vestidos</option>
              <option value="calcas">Calças</option>
              <option value="camisolas">Camisolas</option>
              <option value="acessorios">Acessórios</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-stone-700">Tamanho</label>
            <input
              type="text"
              required
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="mt-1 block w-full rounded-md border border-stone-300 p-2 text-stone-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700">Estado</label>
            <input
              type="text"
              required
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className="mt-1 block w-full rounded-md border border-stone-300 p-2 text-stone-900"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700">Descrição</label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full rounded-md border border-stone-300 p-2 text-stone-900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700">Fotografia do Produto</label>
          <input
            type="file"
            accept="image/*"
            required
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            className="mt-1 block w-full text-sm text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-stone-800 file:text-white hover:file:bg-stone-700"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-stone-900 text-white py-2 px-4 rounded-md hover:bg-stone-800 disabled:opacity-50 font-medium"
        >
          {loading ? 'A carregar...' : 'Guardar Produto'}
        </button>
      </form>
    </div>
  );
}