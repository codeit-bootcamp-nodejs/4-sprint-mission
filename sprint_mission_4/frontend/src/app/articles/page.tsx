'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { articleAPI, authAPI } from '@/lib/api';

interface Article {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  likeCount: number;
  commentCount: number;
  isLiked: boolean;
}

export default function Articles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          const userResponse = await authAPI.getProfile();
          setUser(userResponse.data);
        } catch (error) {
          console.log('사용자 정보 로드 실패:', error);
        }
      }

      const articlesResponse = await articleAPI.getAll({ limit: 10 });
      setArticles(articlesResponse.data);
    } catch (error) {
      console.error('데이터 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (articleId: number) => {
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      const API_BASE_URL = process.env.NODE_ENV === 'production' 
        ? 'https://sprint-mission-4-backend.onrender.com'
        : 'http://localhost:3000';
      
      const response = await fetch(`${API_BASE_URL}/articles/${articleId}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        loadData(); // 새로고침
      }
    } catch (error) {
      console.error('좋아요 실패:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-blue-600 hover:text-blue-800">
                ← 홈으로
              </Link>
              <h1 className="text-xl font-bold text-gray-900">게시글 목록</h1>
            </div>
            <div className="flex items-center space-x-4">
              {user && (
                <Link
                  href="/articles/create"
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  게시글 작성
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto py-8 px-4">
        {/* Articles List */}
        <div className="space-y-6">
          {articles.map((article) => (
            <div
              key={article.id}
              className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <Link href={`/articles/${article.id}`}>
                    <h2 className="text-xl font-semibold text-gray-900 hover:text-blue-600 mb-2">
                      {article.title}
                    </h2>
                  </Link>
                  <p className="text-gray-700 mb-4 line-clamp-3">
                    {article.content.length > 150 
                      ? `${article.content.substring(0, 150)}...` 
                      : article.content
                    }
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>💬 {article.commentCount}</span>
                      <span>❤️ {article.likeCount}</span>
                      <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleLike(article.id)}
                        className={`px-3 py-1 rounded text-sm font-medium ${
                          article.isLiked
                            ? 'bg-red-100 text-red-800 hover:bg-red-200'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                        disabled={!user}
                      >
                        {article.isLiked ? '❤️ 좋아요 취소' : '🤍 좋아요'}
                      </button>
                      
                      <Link
                        href={`/articles/${article.id}`}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        자세히 보기 →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {articles.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-4">게시글이 없습니다.</div>
            {user ? (
              <Link
                href="/articles/create"
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 inline-block"
              >
                첫 게시글 작성하기
              </Link>
            ) : (
              <div>
                <p className="text-gray-400 mb-4">게시글을 작성하려면 로그인해주세요.</p>
                <Link
                  href="/login"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 inline-block"
                >
                  로그인하기
                </Link>
              </div>
            )}
          </div>
        )}

        {/* 게시글 기능 안내 */}
        <div className="mt-12 bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-900 mb-3">📝 게시글 기능</h3>
          <div className="text-green-800 space-y-2">
            <p>✅ <strong>로그인한 유저만 게시글 작성 가능</strong></p>
            <p>✅ <strong>본인이 작성한 게시글만 수정/삭제 가능</strong></p>
            <p>✅ <strong>게시글 좋아요/취소 기능</strong></p>
            <p>⏳ 댓글 기능은 추후 구현 예정</p>
          </div>
        </div>
      </main>
    </div>
  );
}