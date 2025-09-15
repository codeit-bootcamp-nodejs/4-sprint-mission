'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { articleAPI, authAPI, commentAPI } from '@/lib/api';

interface Article {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  userId: number;
  likeCount: number;
  commentCount: number;
  isLiked: boolean;
  user?: {
    nickname: string;
  };
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

export default function ArticleDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [article, setArticle] = useState<Article | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [commentContent, setCommentContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: '',
    content: '',
  });
  const router = useRouter();
  const articleId = parseInt(resolvedParams.id);

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

      const articleResponse = await articleAPI.getById(articleId);
      setArticle(articleResponse.data);
      
      setEditData({
        title: articleResponse.data.title,
        content: articleResponse.data.content,
      });

      // 댓글 로드
      try {
        const commentsResponse = await commentAPI.getForArticle(articleId);
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

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditData({
      title: article!.title,
      content: article!.content,
    });
  };

  const handleSaveEdit = async () => {
    try {
      await articleAPI.update(articleId, {
        title: editData.title,
        content: editData.content,
      });
      alert('게시글이 수정되었습니다.');
      setIsEditing(false);
      loadData();
    } catch (error: any) {
      alert(error.response?.data?.error || '수정에 실패했습니다.');
    }
  };

  const handleDelete = async () => {
    if (!confirm('정말로 이 게시글을 삭제하시겠습니까?')) return;

    try {
      await articleAPI.delete(articleId);
      alert('게시글이 삭제되었습니다.');
      router.push('/articles');
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
      await commentAPI.createForArticle(articleId, { content: commentContent });
      setCommentContent('');
      alert('댓글이 등록되었습니다.');
      loadData();
    } catch (error: any) {
      console.error('Comment creation failed:', error);
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

  if (!article) {
    return <div className="min-h-screen flex items-center justify-center">게시글을 찾을 수 없습니다.</div>;
  }

  const isOwner = user && user.id === article.userId;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* 뒤로가기 */}
        <div className="mb-6">
          <Link href="/articles" className="text-blue-600 hover:text-blue-800">
            ← 게시글 목록으로 돌아가기
          </Link>
        </div>

        {/* 게시글 정보 */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          {!isEditing ? (
            <>
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-3xl font-bold text-gray-900">{article.title}</h1>
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

              <div className="mb-4">
                <p className="text-sm text-gray-500">
                  작성자: {article.user?.nickname || '알 수 없는 사용자'} | {new Date(article.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="prose max-w-none mb-6">
                <p className="text-gray-700 whitespace-pre-wrap">{article.content}</p>
              </div>

              <div className="flex items-center justify-between border-t pt-4">
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>💬 {article.commentCount}</span>
                  <span>❤️ {article.likeCount}</span>
                </div>

                <button
                  onClick={handleLike}
                  className={`px-4 py-2 rounded font-medium ${
                    article.isLiked
                      ? 'bg-red-100 text-red-800 hover:bg-red-200'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                  disabled={!user}
                >
                  {article.isLiked ? '❤️ 좋아요 취소' : '🤍 좋아요'}
                </button>
              </div>
            </>
          ) : (
            // 수정 모드
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">게시글 수정</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">제목</label>
                <input
                  type="text"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={editData.title}
                  onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">내용</label>
                <textarea
                  rows={15}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={editData.content}
                  onChange={(e) => setEditData({ ...editData, content: e.target.value })}
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
          <h3 className="text-xl font-bold mb-4">댓글 ({article.commentCount})</h3>

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