import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productApi, likeApi, commentApi } from '../services/api';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [commentContent, setCommentContent] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    if (id) {
      loadProduct();
    }
  }, [id]);

  const loadProduct = async () => {
    try {
      const response = await productApi.getDetail(Number(id));
      setProduct(response.data);
    } catch (err: any) {
      setError(err.message || '상품 정보를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!id) return;
    try {
      await likeApi.toggleProduct(Number(id));
      // 좋아요 상태 업데이트
      await loadProduct();
    } catch (err: any) {
      alert(err.message || '좋아요 처리에 실패했습니다.');
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !commentContent.trim()) return;

    setSubmittingComment(true);
    try {
      await commentApi.createForProduct(Number(id), commentContent);
      setCommentContent('');
      await loadProduct(); // 댓글 목록 새로고침
    } catch (err: any) {
      alert(err.message || '댓글 등록에 실패했습니다.');
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loading) {
    return <div className="loading">로딩 중...</div>;
  }

  if (error || !product) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom, #E3F2FD 0%, #FFF9E6 100%)', padding: '40px 20px' }}>
        <div className="container" style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div className="alert alert-error">{error || '상품을 찾을 수 없습니다.'}</div>
          <button onClick={() => navigate('/products')} className="btn btn-primary">
            목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom, #E3F2FD 0%, #FFF9E6 100%)', padding: '40px 20px' }}>
      <div className="container" style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div className="card">
        {/* 이미지 */}
        {product.image && (
          <div style={{ marginBottom: '24px', borderRadius: '12px', overflow: 'hidden' }}>
            <img
              src={product.image}
              alt={product.title}
              style={{ width: '100%', height: '400px', objectFit: 'cover' }}
            />
          </div>
        )}

        {/* 제목 */}
        <h1 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: '700', marginBottom: '16px', color: '#1A237E' }}>
          {product.title}
        </h1>

        {/* 작성자 정보 */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid var(--border-color)' }}>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '14px' }}>
            작성자: <strong style={{ color: 'var(--text-primary)' }}>ID {product.userId} ({product.userNickname})</strong>
          </p>
        </div>

        {/* 태그 */}
        {product.tags && product.tags.length > 0 && (
          <div style={{ marginBottom: '24px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {product.tags.map((tag: string, index: number) => (
              <span
                key={index}
                style={{
                  padding: '6px 12px',
                  background: 'var(--primary-color)',
                  color: 'white',
                  borderRadius: '20px',
                  fontSize: '13px',
                  fontWeight: '500',
                }}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* 내용 */}
        <div style={{ marginBottom: '32px', lineHeight: '1.8', fontSize: '16px', color: 'var(--text-primary)' }}>
          <p style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{product.content}</p>
        </div>

        {/* 가격 */}
        <div style={{ marginBottom: '32px', padding: '20px', background: 'linear-gradient(135deg, #E3F2FD 0%, #FFF9E6 100%)', borderRadius: '12px', border: '2px solid #4A90E2' }}>
          <p style={{ fontSize: '32px', fontWeight: '700', color: '#4A90E2', margin: 0 }}>
            {product.price?.toLocaleString()}원
          </p>
        </div>

        {/* 좋아요 */}
        <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={handleLike}
            className="btn"
          style={{
            background: product.isLiked ? '#4A90E2' : 'rgba(74, 144, 226, 0.1)',
            color: product.isLiked ? 'white' : '#4A90E2',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            {product.isLiked ? '❤️' : '🤍'} 좋아요 {product.likeCount || 0}
          </button>
        </div>

        {/* 댓글 섹션 */}
        <div style={{ marginTop: '48px', paddingTop: '32px', borderTop: '2px solid rgba(74, 144, 226, 0.2)' }}>
          <h3 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '24px', color: '#1A237E' }}>
            💬 문의하기
          </h3>

          {/* 댓글 작성 폼 */}
          <form onSubmit={handleCommentSubmit} style={{ marginBottom: '32px' }}>
            <div className="form-group">
              <textarea
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                placeholder="댓글을 입력하세요"
                rows={4}
                className="form-textarea"
                required
              />
            </div>
            <button
              type="submit"
              disabled={submittingComment || !commentContent.trim()}
              className="btn btn-primary"
              style={{ padding: '12px 24px', fontSize: '15px' }}
            >
              {submittingComment ? '등록 중...' : '등록'}
            </button>
          </form>

          {/* 댓글 목록 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {product.comments && product.comments.length > 0 ? (
              product.comments.map((comment: any) => (
                <div
                  key={comment.id}
                  style={{
                    padding: '16px',
                    background: 'rgba(255, 255, 255, 0.5)',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <p style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>
                      {comment.userNickname} (ID: {comment.userId})
                    </p>
                    <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)' }}>
                      {new Date(comment.createdAt).toLocaleDateString('ko-KR')}
                    </p>
                  </div>
                  <p style={{ margin: 0, color: 'var(--text-primary)', lineHeight: '1.6' }}>{comment.content}</p>
                </div>
              ))
            ) : (
              <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '32px' }}>
                아직 댓글이 없습니다.
              </p>
            )}
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}

