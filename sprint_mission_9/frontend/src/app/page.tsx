'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { productAPI, authAPI, articleAPI } from '@/lib/api';
import { User, Product, Article } from '@/types';
import { useWebSocket } from '@/hooks/useWebSocket';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const { connected, notifications, unreadCount, getNotifications } = useWebSocket(user?.id || null);

  const loadData = useCallback(async () => {
    try {
      // 토큰이 있으면 사용자 정보 로드
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          const userResponse = await authAPI.getProfile();
          setUser(userResponse.data);
        } catch (error) {
          console.log('사용자 정보 로드 실패:', error);
        }
      }

      // 상품 목록 로드
      const productsResponse = await productAPI.getAll({ limit: 6 });
      setProducts(productsResponse.data.data || productsResponse.data.list || productsResponse.data || []);

      // 게시글 목록 로드
      const articlesResponse = await articleAPI.getAll({ limit: 6 });
      setArticles(articlesResponse.data.data || articlesResponse.data.list || articlesResponse.data || []);
    } catch (error) {
      console.error('데이터 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleLike = async (productId: number) => {
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      await productAPI.toggleLike(productId);
      // 상품 목록 새로고침
      const response = await productAPI.getAll({ limit: 6 });
      setProducts(response.data.data || response.data.list || response.data || []);
    } catch (error) {
      console.error('좋아요 실패:', error);
    }
  };

  const handleArticleLike = async (articleId: number) => {
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      await articleAPI.toggleLike(articleId);
      // 게시글 목록 새로고침
      const articlesResponse = await articleAPI.getAll({ limit: 6 });
      setArticles(articlesResponse.data.data || articlesResponse.data.list || articlesResponse.data || []);
    } catch (error) {
      console.error('좋아요 실패:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
    window.location.reload();
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
            <h1 className="text-xl font-bold text-gray-900">Sprint Mission 9</h1>
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  <Link
                    href="/profile"
                    className="text-gray-700 hover:text-blue-600"
                  >
                    마이페이지
                  </Link>
                  <Link
                    href="/user"
                    className="text-gray-700 hover:text-blue-600"
                  >
                    내 정보
                  </Link>
                  <Link
                    href="/products/create"
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    상품 등록
                  </Link>
                  <Link
                    href="/articles/create"
                    className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                  >
                    게시글 작성
                  </Link>
                  <span className="text-gray-700">안녕하세요, {user.nickname}님!</span>
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                  >
                    로그아웃
                  </button>
                </div>
              ) : (
                <div className="space-x-2">
                  <Link
                    href="/login"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    로그인
                  </Link>
                  <Link
                    href="/register"
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    회원가입
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">🛍️ 상품 목록</h2>
              <Link
                href="/articles"
                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
              >
                📝 게시글 보기
              </Link>
            </div>
            <p className="text-gray-600 mb-6">
              백엔드 API와 연결된 상품 목록입니다. 좋아요 기능을 테스트해보세요!
            </p>

            {/* API 연결 상태 */}
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
              <p className="font-bold">✅ 백엔드 연결 성공!</p>
              <p>총 {products.length}개 상품, {articles.length}개 게시글이 로드되었습니다.</p>
            </div>
          </div>

          {/* 상품 그리드 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <Link href={`/products/${product.id}`}>
                    <h3 className="text-lg font-medium text-gray-900 mb-2 hover:text-blue-600 cursor-pointer">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-2xl font-bold text-blue-600 mb-4">
                    {product.price.toLocaleString()}원
                  </p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>💬 {product.commentCount}</span>
                      <span>❤️ {product.likeCount}</span>
                    </div>
                    
                    <button
                      onClick={() => handleLike(product.id)}
                      className={`px-3 py-1 rounded text-sm font-medium ${
                        product.isLiked
                          ? 'bg-red-100 text-red-800 hover:bg-red-200'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                      disabled={!user}
                    >
                      {product.isLiked ? '❤️ 좋아요 취소' : '🤍 좋아요'}
                    </button>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="text-xs text-gray-400">
                      {new Date(product.createdAt).toLocaleDateString()}
                    </div>
                    <Link
                      href={`/products/${product.id}`}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      자세히 보기 →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 빈 상태 */}
          {products.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg mb-4">상품이 없습니다.</div>
              <p className="text-gray-400">
                백엔드에서 테스트 상품을 추가해보세요!
              </p>
            </div>
          )}

          {/* 게시글 섹션 */}
          <div className="mt-16">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">📝 최근 게시글</h2>
              <Link
                href="/articles"
                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
              >
                모든 게시글 보기
              </Link>
            </div>

            {/* 게시글 목록 */}
            <div className="space-y-4">
              {articles.map((article) => (
                <div
                  key={article.id}
                  className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <Link href={`/articles/${article.id}`}>
                        <h3 className="text-xl font-semibold text-gray-900 hover:text-blue-600 mb-2">
                          {article.title}
                        </h3>
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
                            onClick={() => handleArticleLike(article.id)}
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

            {/* 게시글 빈 상태 */}
            {articles.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-500 text-lg mb-4">게시글이 없습니다.</div>
                {user ? (
                  <Link
                    href="/articles/create"
                    className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 inline-block"
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
          </div>

          {/* WebSocket 실시간 알림 UI */}
          {user && (
            <div className="mt-12 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-purple-900">🔔 실시간 알림 (WebSocket)</h3>
                {unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {unreadCount}개
                  </span>
                )}
              </div>

              <div className="bg-white rounded-lg p-4 mb-4 border border-purple-100">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${connected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                    <span className="text-sm font-medium text-gray-700">
                      연결 상태: {connected ? '활성' : '비활성'}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {connected ? 'WebSocket 서버에 연결됨' : 'WebSocket 연결 대기 중'}
                  </span>
                </div>

                <div className="text-sm text-gray-600">
                  <p>실시간으로 알림을 받을 수 있습니다:</p>
                  <ul className="mt-2 space-y-1 text-xs">
                    <li>• 내 게시글/상품에 댓글이 달렸을 때</li>
                    <li>• 내 게시글/상품에 좋아요가 눌렸을 때</li>
                    <li>• 내 댓글에 답글이 달렸을 때</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-semibold text-gray-700">최근 알림</h4>
                  <button
                    onClick={getNotifications}
                    className="text-xs text-purple-600 hover:text-purple-800"
                  >
                    새로고침
                  </button>
                </div>

                {notifications.length > 0 ? (
                  notifications.slice(0, 5).map((notification) => (
                    <div
                      key={notification.id}
                      className={`${
                        notification.isRead ? 'bg-gray-50' : 'bg-white'
                      } rounded-lg p-3 border border-gray-200 hover:border-blue-300 transition-colors cursor-pointer`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm">
                            {notification.type === 'comment' ? '💬' :
                             notification.type === 'like' ? '❤️' : '📝'}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm ${notification.isRead ? 'text-gray-600' : 'text-gray-900'}`}>
                            {notification.relatedUser && (
                              <span className="font-medium">{notification.relatedUser.nickname}</span>
                            )}
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(notification.createdAt).toLocaleString('ko-KR')}
                            {notification.isRead && ' (읽음)'}
                          </p>
                        </div>
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p className="text-sm">아직 알림이 없습니다.</p>
                    <p className="text-xs mt-1">활동이 생기면 실시간으로 알림을 받을 수 있습니다.</p>
                  </div>
                )}
              </div>

              {notifications.length > 5 && (
                <div className="mt-4 text-center">
                  <button className="text-sm text-purple-600 hover:text-purple-800 font-medium">
                    모든 알림 보기 ({notifications.length}개) →
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}