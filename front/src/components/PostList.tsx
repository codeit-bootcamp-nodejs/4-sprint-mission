import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { postApi, userApi } from '../services/api';
import { Link } from 'react-router-dom';

export default function PostList() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<any[]>([]);
  const [bestPosts, setBestPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'latest' | 'likes'>('latest');
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const loadPosts = async () => {
    try {
      const response = await postApi.list();
      const allPosts = response.data || [];
      
      // 좋아요 수를 포함한 게시글 데이터 가져오기
      const postsWithLikes = await Promise.all(
        allPosts.map(async (post: any) => {
          try {
            const detailResponse = await postApi.getDetail(post.id);
            return detailResponse.data;
          } catch {
            return { ...post, likeCount: 0, isLiked: false };
          }
        })
      );
      
      // 베스트 게시글 (좋아요 순으로 상위 3개)
      const sortedByLikes = [...postsWithLikes].sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0));
      setBestPosts(sortedByLikes.slice(0, 3));
      
      // 전체 게시글 정렬
      let sortedPosts = [...postsWithLikes];
      if (sortBy === 'likes') {
        sortedPosts.sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0));
      } else {
        sortedPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }
      
      // 검색 필터 적용
      if (searchQuery.trim()) {
        sortedPosts = sortedPosts.filter((post: any) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.content.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      setPosts(sortedPosts);
    } catch (err: any) {
      setError(err.message || '게시글 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const loadCurrentUser = async () => {
    try {
      const response = await userApi.getProfile();
      setCurrentUserId(response.user?.id || null);
    } catch (err: any) {
      console.error('사용자 정보를 불러오는데 실패했습니다:', err);
    }
  };

  useEffect(() => {
    loadCurrentUser();
  }, []);

  useEffect(() => {
    loadPosts();
  }, [sortBy, searchQuery]);

  const handleDelete = async (postId: number) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
      await postApi.delete(postId);
      loadPosts();
    } catch (err: any) {
      alert(err.message || '삭제에 실패했습니다.');
    }
  };

  if (loading) {
    return <div className="loading">로딩 중...</div>;
  }

  return (
    <div style={{ minHeight: '100vh', background: 'white', padding: '40px 20px' }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* 베스트 게시글 섹션 */}
        {bestPosts.length > 0 && (
          <section style={{ marginBottom: '60px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#1A237E', marginBottom: '24px' }}>베스트 게시글</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
              {bestPosts.map((post) => (
                <div
                  key={post.id}
                  className="card"
                  style={{
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    padding: '0',
                    overflow: 'hidden',
                    position: 'relative',
                  }}
                  onClick={() => navigate(`/posts/${post.id}`)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
                  }}
                >
                  <div style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 1 }}>
                    <div style={{ 
                      background: '#4A90E2', 
                      color: 'white', 
                      padding: '4px 12px', 
                      borderRadius: '12px', 
                      fontSize: '12px', 
                      fontWeight: '700',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}>
                      <span>🏆</span>
                      <span>Best</span>
                    </div>
                  </div>
                  <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <h3 style={{ 
                      margin: '0 0 12px 0', 
                      fontSize: '16px', 
                      fontWeight: '600', 
                      color: '#1A237E',
                      lineHeight: '1.5',
                      flex: 1,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}>
                      {post.title}
                    </h3>
                    {post.image && (
                      <img
                        src={post.image}
                        alt={post.title}
                        style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '8px', marginBottom: '12px' }}
                      />
                    )}
                    <div style={{ marginTop: 'auto' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '14px', color: '#6b7280' }}>
                        <span>{post.userNickname || '작성자'}</span>
                        <span>•</span>
                        <span>❤️ {post.likeCount || 0}</span>
                      </div>
                      <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>
                        {post.createdAt ? new Date(post.createdAt).toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }) : ''}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 게시글 섹션 */}
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#1A237E', margin: 0 }}>게시글</h2>
            <Link to="/posts/new" className="btn btn-primary" style={{ textDecoration: 'none', padding: '12px 24px', fontSize: '16px', fontWeight: '600' }}>
              글쓰기
            </Link>
          </div>
          
          {/* 검색바와 정렬 */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '300px' }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="검색할 상품을 입력해주세요"
                style={{
                  width: '100%',
                  padding: '12px 16px 12px 40px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px',
                }}
              />
              <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '18px' }}>🔍</span>
            </div>
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                style={{
                  padding: '12px 16px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  background: 'white',
                  cursor: 'pointer',
                  fontSize: '14px',
                  minWidth: '120px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px',
                }}
              >
                <span>{sortBy === 'latest' ? '최신순' : '좋아요순'}</span>
                <span>▼</span>
              </button>
              {showSortDropdown && (
                <>
                  <div
                    style={{
                      position: 'fixed',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      zIndex: 998,
                    }}
                    onClick={() => setShowSortDropdown(false)}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: '100%',
                      right: 0,
                      marginTop: '4px',
                      background: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                      zIndex: 999,
                      minWidth: '120px',
                    }}
                  >
                    <button
                      onClick={() => {
                        setSortBy('latest');
                        setShowSortDropdown(false);
                      }}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: 'none',
                        background: sortBy === 'latest' ? '#E3F2FD' : 'white',
                        cursor: 'pointer',
                        fontSize: '14px',
                        textAlign: 'left',
                        borderRadius: '8px 8px 0 0',
                      }}
                    >
                      최신순
                    </button>
                    <button
                      onClick={() => {
                        setSortBy('likes');
                        setShowSortDropdown(false);
                      }}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: 'none',
                        background: sortBy === 'likes' ? '#E3F2FD' : 'white',
                        cursor: 'pointer',
                        fontSize: '14px',
                        textAlign: 'left',
                        borderTop: '1px solid #e5e7eb',
                        borderRadius: '0 0 8px 8px',
                      }}
                    >
                      좋아요순
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
          
        {error && <div className="alert alert-error">{error}</div>}
        {posts.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>📝</div>
            <p style={{ fontSize: '18px', color: '#6b7280', marginBottom: '24px' }}>등록된 게시글이 없습니다.</p>
            <Link to="/posts/new" className="btn btn-primary" style={{ textDecoration: 'none', padding: '12px 24px', display: 'inline-block' }}>
              첫 게시글 작성하기
            </Link>
          </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {posts.map((post) => (
            <div
              key={post.id}
              className="card"
              style={{
                background: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                padding: '20px',
              }}
              onClick={() => navigate(`/posts/${post.id}`)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '600', color: '#1A237E', lineHeight: '1.5' }}>
                    {post.title}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', color: '#6b7280', marginTop: '12px' }}>
                    <span>{post.userNickname || '작성자'}</span>
                    <span>•</span>
                    <span>{post.createdAt ? new Date(post.createdAt).toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }) : ''}</span>
                    <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span>❤️</span>
                      <span>{post.likeCount || 0}</span>
                    </span>
                  </div>
                </div>
                {post.image && (
                  <img
                    src={post.image}
                    alt={post.title}
                    style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }}
                  />
                )}
              </div>
              {currentUserId && post.userId === currentUserId && (
                <div style={{ display: 'flex', gap: '8px', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #e5e7eb' }} onClick={(e) => e.stopPropagation()}>
                  <Link
                    to={`/posts/${post.id}/edit`}
                    className="btn btn-primary"
                    style={{ textDecoration: 'none', fontSize: '13px', padding: '6px 12px' }}
                  >
                    수정
                  </Link>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(post.id);
                    }}
                    className="btn btn-danger"
                    style={{ fontSize: '13px', padding: '6px 12px' }}
                  >
                    삭제
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
        </section>
      </div>
    </div>
  );
}

