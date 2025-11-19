'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { articleAPI, authAPI } from '@/lib/api';

export default function CreateArticle() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
  });
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        router.push('/login');
        return;
      }

      const userResponse = await authAPI.getProfile();
      setUser(userResponse.data);
    } catch (error) {
      console.error('인증 확인 실패:', error);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }

    setSubmitting(true);
    
    try {
      const response = await articleAPI.create({
        title: formData.title.trim(),
        content: formData.content.trim(),
      });
      
      alert('게시글이 작성되었습니다.');
      router.push(`/articles/${response.data.id}`);
    } catch (error: any) {
      console.error('게시글 작성 실패:', error);
      alert(`게시글 작성에 실패했습니다: ${error.response?.data?.error || error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">로딩 중...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">로그인이 필요합니다.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <Link href="/articles" className="text-blue-600 hover:text-blue-800">
            ← 게시글 목록으로 돌아가기
          </Link>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">게시글 작성</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                제목 *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="게시글 제목을 입력하세요"
                value={formData.title}
                onChange={handleChange}
                required
                disabled={submitting}
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                내용 *
              </label>
              <textarea
                id="content"
                name="content"
                rows={15}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="게시글 내용을 입력하세요"
                value={formData.content}
                onChange={handleChange}
                required
                disabled={submitting}
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className={`px-6 py-2 rounded font-medium ${
                  submitting
                    ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
                disabled={submitting}
              >
                {submitting ? '작성 중...' : '게시글 작성'}
              </button>
              
              <Link
                href="/articles"
                className="px-6 py-2 border border-gray-300 rounded font-medium text-gray-700 hover:bg-gray-50"
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