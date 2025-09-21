'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { productAPI } from '@/lib/api';

export default function CreateProduct() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    tags: '',
    imageUrl: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 유효성 검사
      if (!formData.name.trim()) {
        setError('상품명을 입력해주세요.');
        setLoading(false);
        return;
      }
      if (!formData.description.trim()) {
        setError('상품 설명을 입력해주세요.');
        setLoading(false);
        return;
      }
      if (!formData.price || isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
        setError('올바른 가격을 입력해주세요.');
        setLoading(false);
        return;
      }
      if (!formData.tags.trim()) {
        setError('태그를 입력해주세요.');
        setLoading(false);
        return;
      }

      const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      if (tagsArray.length === 0) {
        setError('최소 하나의 태그를 입력해주세요.');
        setLoading(false);
        return;
      }

      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: Number(formData.price),
        tags: tagsArray,
        ...(formData.imageUrl && { imageUrl: formData.imageUrl.trim() }),
      };

      await productAPI.create(productData);
      alert('상품이 성공적으로 등록되었습니다!');
      router.push('/');
    } catch (error: any) {
      console.error('상품 등록 실패:', error);
      setError(error.response?.data?.message || '상품 등록에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">상품 등록</h1>
            <p className="text-gray-600 mt-2">새로운 상품을 등록해보세요.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                상품명 *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                상품 설명 *
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={4}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                가격 *
              </label>
              <input
                type="number"
                id="price"
                name="price"
                required
                min="0"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={formData.price}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
                태그 (쉼표로 구분)
              </label>
              <input
                type="text"
                id="tags"
                name="tags"
                placeholder="예: 전자제품, 스마트폰, 최신"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={formData.tags}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
                이미지 URL (선택사항)
              </label>
              <input
                type="url"
                id="imageUrl"
                name="imageUrl"
                placeholder="https://example.com/image.jpg"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={formData.imageUrl}
                onChange={handleChange}
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {loading ? '등록 중...' : '상품 등록'}
              </button>
              
              <Link
                href="/"
                className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 text-center"
              >
                취소
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}