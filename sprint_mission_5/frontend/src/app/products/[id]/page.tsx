'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { productAPI, authAPI, commentAPI } from '@/lib/api';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  tags: string[];
  imageUrl?: string;
  createdAt: string;
  userId: number;
  likeCount: number;
  commentCount: number;
  isLiked: boolean;
}

interface Comment {
  id: number;
  content: string;
  createdAt: string;
  userId?: number;
  user?: {
    nickname: string;
  };
}

export default function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [commentContent, setCommentContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: '',
    description: '',
    price: '',
    tags: '',
    imageUrl: '',
  });
  const router = useRouter();
  const productId = parseInt(resolvedParams.id);

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

      const productResponse = await productAPI.getById(productId);
      setProduct(productResponse.data);
      
      setEditData({
        name: productResponse.data.name,
        description: productResponse.data.description,
        price: productResponse.data.price.toString(),
        tags: productResponse.data.tags.join(', '),
        imageUrl: productResponse.data.imageUrl || '',
      });

      // 댓글 로드
      try {
        const commentsResponse = await commentAPI.getForProduct(productId);
        setComments(commentsResponse.data);
      } catch (error) {
        console.log('댓글 로드 실패:', error);
      }

    } catch (error) {
      console.error('데이터 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      await productAPI.toggleLike(productId);
      loadData(); // 새로고침
    } catch (error) {
      console.error('좋아요 실패:', error);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditData({
      name: product!.name,
      description: product!.description,
      price: product!.price.toString(),
      tags: product!.tags.join(', '),
      imageUrl: product!.imageUrl || '',
    });
  };

  const handleSaveEdit = async () => {
    try {
      const tagsArray = editData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      const updateData = {
        name: editData.name,
        description: editData.description,
        price: parseInt(editData.price),
        tags: tagsArray,
        ...(editData.imageUrl && { imageUrl: editData.imageUrl }),
      };

      await productAPI.update(productId, updateData);
      alert('상품이 수정되었습니다.');
      setIsEditing(false);
      loadData();
    } catch (error: any) {
      alert(error.response?.data?.error || '수정에 실패했습니다.');
    }
  };

  const handleDelete = async () => {
    if (!confirm('정말로 이 상품을 삭제하시겠습니까?')) return;

    try {
      await productAPI.delete(productId);
      alert('상품이 삭제되었습니다.');
      router.push('/');
    } catch (error: any) {
      alert(error.response?.data?.error || '삭제에 실패했습니다.');
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      console.log('Submitting comment:', { productId, content: commentContent });
      const response = await commentAPI.createForProduct(productId, { content: commentContent });
      console.log('Comment created:', response);
      setCommentContent('');
      alert('댓글이 등록되었습니다.');
      loadData();
    } catch (error: any) {
      console.error('Comment creation failed:', error);
      console.error('Error response:', error.response?.data);
      alert(`댓글 등록에 실패했습니다: ${error.response?.data?.error || error.message}`);
    }
  };

  const handleCommentDelete = async (commentId: number) => {
    if (!confirm('정말로 이 댓글을 삭제하시겠습니까?')) return;

    try {
      await commentAPI.delete(commentId);
      alert('댓글이 삭제되었습니다.');
      loadData();
    } catch (error: any) {
      console.error('Comment deletion failed:', error);
      alert(`댓글 삭제에 실패했습니다: ${error.response?.data?.error || error.message}`);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">로딩 중...</div>;
  }

  if (!product) {
    return <div className="min-h-screen flex items-center justify-center">상품을 찾을 수 없습니다.</div>;
  }

  const isOwner = user && user.id === product.userId;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* 뒤로가기 */}
        <div className="mb-6">
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            ← 목록으로 돌아가기
          </Link>
        </div>

        {/* 상품 정보 */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          {!isEditing ? (
            <>
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                {isOwner && (
                  <div className="space-x-2">
                    <button
                      onClick={handleEdit}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                      수정
                    </button>
                    <button
                      onClick={handleDelete}
                      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    >
                      삭제
                    </button>
                  </div>
                )}
              </div>

              {product.imageUrl && (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full max-w-md h-64 object-cover rounded-lg mb-4"
                />
              )}

              <p className="text-3xl font-bold text-blue-600 mb-4">
                {product.price.toLocaleString()}원
              </p>

              <p className="text-gray-700 mb-4">{product.description}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {product.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>💬 {product.commentCount}</span>
                  <span>❤️ {product.likeCount}</span>
                  <span>{new Date(product.createdAt).toLocaleDateString()}</span>
                </div>

                <button
                  onClick={handleLike}
                  className={`px-4 py-2 rounded font-medium ${
                    product.isLiked
                      ? 'bg-red-100 text-red-800 hover:bg-red-200'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                  disabled={!user}
                >
                  {product.isLiked ? '❤️ 좋아요 취소' : '🤍 좋아요'}
                </button>
              </div>
            </>
          ) : (
            // 수정 모드
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">상품 수정</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">상품명</label>
                <input
                  type="text"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">설명</label>
                <textarea
                  rows={4}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={editData.description}
                  onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">가격</label>
                <input
                  type="number"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={editData.price}
                  onChange={(e) => setEditData({ ...editData, price: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">태그 (쉼표로 구분)</label>
                <input
                  type="text"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={editData.tags}
                  onChange={(e) => setEditData({ ...editData, tags: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">이미지 URL</label>
                <input
                  type="url"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={editData.imageUrl}
                  onChange={(e) => setEditData({ ...editData, imageUrl: e.target.value })}
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleSaveEdit}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  저장
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                >
                  취소
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 댓글 섹션 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold mb-4">댓글 ({product.commentCount})</h3>

          {/* 댓글 작성 */}
          {user ? (
            <form onSubmit={handleCommentSubmit} className="mb-6">
              <textarea
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="댓글을 입력하세요..."
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                required
              />
              <button
                type="submit"
                className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                댓글 등록
              </button>
            </form>
          ) : (
            <div className="mb-6 p-4 bg-gray-100 rounded-lg">
              <p className="text-gray-600">댓글을 작성하려면 로그인해주세요.</p>
            </div>
          )}

          {/* 댓글 목록 */}
          <div className="space-y-4">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.id} className="border-b border-gray-200 pb-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-gray-700">
                          {comment.user?.nickname || '알 수 없는 사용자'}
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(comment.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-gray-800">{comment.content}</p>
                    </div>
                    {user && comment.userId === user.id && (
                      <button
                        onClick={() => handleCommentDelete(comment.id)}
                        className="text-red-600 hover:text-red-800 text-sm ml-4"
                      >
                        삭제
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-gray-500 text-center py-8">
                아직 댓글이 없습니다. 첫 번째 댓글을 작성해보세요!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}