'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authAPI } from '@/lib/api';
import { User } from '@/types';

export default function UserInfo() {
  const [user, setUser] = useState<User | null>(null);
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
  const [updateLoading, setUpdateLoading] = useState(false);
  const router = useRouter();

  const loadUserInfo = useCallback(async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await authAPI.getProfile();
      setUser(response.data);
      setProfileData({
        nickname: response.data.nickname,
        image: response.data.image || '',
      });
    } catch (error: unknown) {
      const apiError = error as { response?: { status?: number } };
      console.error('사용자 정보 로드 실패:', error);
      if (apiError.response?.status === 401) {
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadUserInfo();
  }, [loadUserInfo]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateLoading(true);
    
    try {
      const updateData: { nickname?: string; image?: string } = {};
      if (profileData.nickname !== user?.nickname) {
        updateData.nickname = profileData.nickname;
      }
      if (profileData.image !== (user?.image || '')) {
        updateData.image = profileData.image;
      }

      if (Object.keys(updateData).length === 0) {
        alert('변경된 정보가 없습니다.');
        setIsEditing(false);
        return;
      }

      await authAPI.updateProfile(updateData);
      alert('프로필이 성공적으로 업데이트되었습니다.');
      setIsEditing(false);
      loadUserInfo();
    } catch (error: unknown) {
      const apiError = error as { response?: { data?: { message?: string } } };
      console.error('프로필 업데이트 실패:', error);
      alert(apiError.response?.data?.message || '프로필 업데이트에 실패했습니다.');
    } finally {
      setUpdateLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('새 비밀번호가 일치하지 않습니다.');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      alert('비밀번호는 최소 6자 이상이어야 합니다.');
      return;
    }

    setUpdateLoading(true);
    
    try {
      await authAPI.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      alert('비밀번호가 성공적으로 변경되었습니다.');
      setIsChangingPassword(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: unknown) {
      const apiError = error as { response?: { data?: { message?: string } } };
      console.error('비밀번호 변경 실패:', error);
      alert(apiError.response?.data?.message || '비밀번호 변경에 실패했습니다.');
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setProfileData({
      nickname: user?.nickname || '',
      image: user?.image || '',
    });
  };

  const handleCancelPasswordChange = () => {
    setIsChangingPassword(false);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
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
        <div className="text-center">
          <p className="text-lg text-gray-600 mb-4">사용자 정보를 불러올 수 없습니다.</p>
          <Link href="/login" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            로그인하기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← 홈으로 돌아가기
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">내 정보 관리</h1>
          <p className="text-gray-600 mt-2">개인 정보를 조회하고 수정할 수 있습니다.</p>
        </div>

        {/* User Info Card */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-6">기본 정보</h2>
          
          {!isEditing && !isChangingPassword ? (
            /* View Mode */
            <div className="space-y-4">
              <div className="flex items-center space-x-6">
                {user.image && (
                  <img
                    src={user.image}
                    alt="프로필 이미지"
                    className="w-20 h-20 rounded-full object-cover border"
                  />
                )}
                <div className="flex-1">
                  <h3 className="text-xl font-medium text-gray-900">{user.nickname}</h3>
                  <p className="text-gray-600">{user.email}</p>
                  <div className="mt-2 text-sm text-gray-500">
                    <p>가입일: {new Date(user.createdAt).toLocaleDateString()}</p>
                    <p>마지막 수정: {new Date(user.updatedAt).toLocaleDateString()}</p>
                    <p>사용자 ID: {user.id}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t">
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
          ) : isEditing ? (
            /* Edit Mode */
            <form onSubmit={handleProfileUpdate} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  닉네임 *
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={profileData.nickname}
                  onChange={(e) => setProfileData({ ...profileData, nickname: e.target.value })}
                  required
                  disabled={updateLoading}
                  minLength={2}
                  maxLength={20}
                />
                <p className="text-xs text-gray-500 mt-1">2-20자 사이로 입력해주세요.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  프로필 이미지 URL
                </label>
                <input
                  type="url"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={profileData.image}
                  onChange={(e) => setProfileData({ ...profileData, image: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  disabled={updateLoading}
                />
                <p className="text-xs text-gray-500 mt-1">이미지 URL을 입력하거나 비워두세요.</p>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className={`px-4 py-2 rounded font-medium ${
                    updateLoading
                      ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                  disabled={updateLoading}
                >
                  {updateLoading ? '저장 중...' : '저장'}
                </button>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-4 py-2 border border-gray-300 rounded font-medium text-gray-700 hover:bg-gray-50"
                  disabled={updateLoading}
                >
                  취소
                </button>
              </div>
            </form>
          ) : (
            /* Password Change Mode */
            <form onSubmit={handlePasswordChange} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  현재 비밀번호 *
                </label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  required
                  disabled={updateLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  새 비밀번호 *
                </label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  required
                  disabled={updateLoading}
                  minLength={6}
                />
                <p className="text-xs text-gray-500 mt-1">최소 6자 이상 입력해주세요.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  새 비밀번호 확인 *
                </label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  required
                  disabled={updateLoading}
                  minLength={6}
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className={`px-4 py-2 rounded font-medium ${
                    updateLoading
                      ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                  disabled={updateLoading}
                >
                  {updateLoading ? '변경 중...' : '비밀번호 변경'}
                </button>
                <button
                  type="button"
                  onClick={handleCancelPasswordChange}
                  className="px-4 py-2 border border-gray-300 rounded font-medium text-gray-700 hover:bg-gray-50"
                  disabled={updateLoading}
                >
                  취소
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Quick Links */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">빠른 이동</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/profile"
              className="p-4 border rounded-lg hover:bg-gray-50 text-center"
            >
              <div className="text-2xl mb-2">📊</div>
              <div className="font-medium">마이페이지</div>
              <div className="text-sm text-gray-500">내 활동 현황</div>
            </Link>
            <Link
              href="/products/create"
              className="p-4 border rounded-lg hover:bg-gray-50 text-center"
            >
              <div className="text-2xl mb-2">🛍️</div>
              <div className="font-medium">상품 등록</div>
              <div className="text-sm text-gray-500">새 상품 추가</div>
            </Link>
            <Link
              href="/articles/create"
              className="p-4 border rounded-lg hover:bg-gray-50 text-center"
            >
              <div className="text-2xl mb-2">📝</div>
              <div className="font-medium">게시글 작성</div>
              <div className="text-sm text-gray-500">새 게시글 작성</div>
            </Link>
          </div>
        </div>

        {/* Features Info */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">🔒 개인정보 보호</h3>
          <div className="text-blue-800 space-y-2 text-sm">
            <p>✅ <strong>비밀번호 암호화:</strong> 모든 비밀번호는 안전하게 암호화되어 저장됩니다.</p>
            <p>✅ <strong>토큰 기반 인증:</strong> JWT 토큰을 사용하여 안전한 인증을 제공합니다.</p>
            <p>✅ <strong>권한 기반 접근:</strong> 본인만 자신의 정보를 수정할 수 있습니다.</p>
            <p>✅ <strong>자동 토큰 갱신:</strong> 세션이 자동으로 연장되어 편리합니다.</p>
          </div>
        </div>
      </div>
    </div>
  );
}