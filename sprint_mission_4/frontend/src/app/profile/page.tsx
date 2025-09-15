'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { authAPI } from '@/lib/api';
import { User, Product, Article } from '@/types';

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [myProducts, setMyProducts] = useState<Product[]>([]);
  const [likedProducts, setLikedProducts] = useState<Product[]>([]);
  const [myArticles, setMyArticles] = useState<Article[]>([]);
  const [activeTab, setActiveTab] = useState<'profile' | 'products' | 'liked' | 'articles'>('profile');
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [profileData, setProfileData] = useState({
    nickname: '',
    image: '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const userResponse = await authAPI.getProfile();
      setUser(userResponse.data);
      setProfileData({
        nickname: userResponse.data.nickname,
        image: userResponse.data.image || '',
      });

      const myProductsResponse = await authAPI.getMyProducts();
      setMyProducts(myProductsResponse.data);

      const likedProductsResponse = await authAPI.getMyLikedProducts();
      setLikedProducts(likedProductsResponse.data);

      const myArticlesResponse = await authAPI.getMyArticles();
      setMyArticles(myArticlesResponse.data);
    } catch (error) {
      console.error('데이터 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await authAPI.updateProfile(profileData);
      alert('프로필이 업데이트되었습니다.');
      setIsEditing(false);
      loadData();
    } catch (error: unknown) {
      const apiError = error as { response?: { data?: { message?: string } } };
      alert(apiError.response?.data?.message || '프로필 업데이트에 실패했습니다.');
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('새 비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      await authAPI.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      alert('비밀번호가 변경되었습니다.');
      setIsChangingPassword(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: unknown) {
      const apiError = error as { response?: { data?: { message?: string } } };
      alert(apiError.response?.data?.message || '비밀번호 변경에 실패했습니다.');
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">로딩 중...</div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-600 mb-4">로그인이 필요합니다.</p>
          <Link href="/login" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            로그인하기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* 헤더 */}
        <div className="mb-8">
          <Link href="/" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← 홈으로 돌아가기
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">마이페이지</h1>
        </div>

        {/* 탭 네비게이션 */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-4 px-6 border-b-2 font-medium text-sm ${
                  activeTab === 'profile'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                👤 내 정보
              </button>
              <button
                onClick={() => setActiveTab('products')}
                className={`py-4 px-6 border-b-2 font-medium text-sm ${
                  activeTab === 'products'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                🛍️ 내 상품 ({myProducts.length})
              </button>
              <button
                onClick={() => setActiveTab('liked')}
                className={`py-4 px-6 border-b-2 font-medium text-sm ${
                  activeTab === 'liked'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                ❤️ 좋아요 상품 ({likedProducts.length})
              </button>
              <button
                onClick={() => setActiveTab('articles')}
                className={`py-4 px-6 border-b-2 font-medium text-sm ${
                  activeTab === 'articles'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                📝 내 게시글 ({myArticles.length})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* 프로필 탭 */}
            {activeTab === 'profile' && (
              <div className="max-w-2xl">
                <h2 className="text-xl font-semibold mb-6">내 정보 관리</h2>
                
                {!isEditing && !isChangingPassword && (
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-4">
                        {user.image && (
                          <img
                            src={user.image}
                            alt="프로필"
                            className="w-16 h-16 rounded-full object-cover"
                          />
                        )}
                        <div>
                          <h3 className="text-lg font-medium">{user.nickname}</h3>
                          <p className="text-gray-600">{user.email}</p>
                          <p className="text-sm text-gray-500">
                            가입일: {new Date(user.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <button
                        onClick={() => setIsEditing(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                      >
                        프로필 수정
                      </button>
                      <button
                        onClick={() => setIsChangingPassword(true)}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                      >
                        비밀번호 변경
                      </button>
                    </div>
                  </div>
                )}

                {/* 프로필 수정 폼 */}
                {isEditing && (
                  <form onSubmit={handleProfileUpdate} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">닉네임</label>
                      <input
                        type="text"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                        value={profileData.nickname}
                        onChange={(e) => setProfileData({ ...profileData, nickname: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">프로필 이미지 URL</label>
                      <input
                        type="url"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                        value={profileData.image}
                        onChange={(e) => setProfileData({ ...profileData, image: e.target.value })}
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>

                    <div className="flex gap-4">
                      <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                      >
                        저장
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                      >
                        취소
                      </button>
                    </div>
                  </form>
                )}

                {/* 비밀번호 변경 폼 */}
                {isChangingPassword && (
                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">현재 비밀번호</label>
                      <input
                        type="password"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">새 비밀번호</label>
                      <input
                        type="password"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">새 비밀번호 확인</label>
                      <input
                        type="password"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        required
                      />
                    </div>

                    <div className="flex gap-4">
                      <button
                        type="submit"
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                      >
                        비밀번호 변경
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsChangingPassword(false)}
                        className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                      >
                        취소
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* 내 상품 탭 */}
            {activeTab === 'products' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">내가 등록한 상품</h2>
                  <Link
                    href="/products/create"
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    새 상품 등록
                  </Link>
                </div>

                {myProducts.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">등록한 상품이 없습니다.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {myProducts.map((product) => (
                      <div key={product.id} className="border rounded-lg p-4 hover:shadow-md">
                        <Link href={`/products/${product.id}`}>
                          <h3 className="font-medium text-gray-900 hover:text-blue-600">
                            {product.name}
                          </h3>
                        </Link>
                        <p className="text-lg font-bold text-blue-600">
                          {product.price.toLocaleString()}원
                        </p>
                        <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
                          <span>❤️ {product.likeCount} 💬 {product.commentCount}</span>
                          <span>{new Date(product.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 좋아요 상품 탭 */}
            {activeTab === 'liked' && (
              <div>
                <h2 className="text-xl font-semibold mb-6">내가 좋아요한 상품</h2>

                {likedProducts.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">좋아요한 상품이 없습니다.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {likedProducts.map((product) => (
                      <div key={product.id} className="border rounded-lg p-4 hover:shadow-md">
                        <Link href={`/products/${product.id}`}>
                          <h3 className="font-medium text-gray-900 hover:text-blue-600">
                            {product.name}
                          </h3>
                        </Link>
                        <p className="text-lg font-bold text-blue-600">
                          {product.price.toLocaleString()}원
                        </p>
                        <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
                          <span>❤️ {product.likeCount} 💬 {product.commentCount}</span>
                          <span>{new Date(product.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 내 게시글 탭 */}
            {activeTab === 'articles' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">내가 작성한 게시글</h2>
                  <Link
                    href="/articles/create"
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    새 게시글 작성
                  </Link>
                </div>

                {myArticles.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">작성한 게시글이 없습니다.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {myArticles.map((article) => (
                      <div key={article.id} className="border rounded-lg p-4 hover:shadow-md">
                        <Link href={`/articles/${article.id}`}>
                          <h3 className="font-medium text-gray-900 hover:text-blue-600 mb-2">
                            {article.title}
                          </h3>
                        </Link>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {article.content.length > 100 
                            ? `${article.content.substring(0, 100)}...` 
                            : article.content
                          }
                        </p>
                        <div className="flex justify-between items-center text-sm text-gray-500">
                          <span>❤️ {article._count?.likes || article.likeCount} 💬 {article._count?.comments || article.commentCount}</span>
                          <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 기능 테스트 안내 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">🧪 테스트 완료된 기능들</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-blue-800">
            <div>
              <h4 className="font-semibold mb-2">✅ 상품 기능</h4>
              <ul className="space-y-1 text-sm">
                <li>• 상품 등록 (로그인 필수)</li>
                <li>• 본인 상품만 수정/삭제</li>
                <li>• 상품 좋아요/취소</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">✅ 유저 기능</h4>
              <ul className="space-y-1 text-sm">
                <li>• 내 정보 조회/수정</li>
                <li>• 비밀번호 변경</li>
                <li>• 내 상품 목록</li>
                <li>• 좋아요한 상품 목록</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}