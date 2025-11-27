import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { postApi } from '../services/api';

export default function PostForm() {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isEdit) {
        await postApi.update(Number(id), title, content, image || null);
      } else {
        await postApi.create(title, content, image || null);
      }
      navigate('/posts');
    } catch (err: any) {
      setError(err.message || `${isEdit ? '수정' : '등록'}에 실패했습니다.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom, #E3F2FD 0%, #FFF9E6 100%)', padding: '40px 20px' }}>
      <div className="container" style={{ maxWidth: '700px', margin: '0 auto' }}>
        <div className="card">
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>📝</div>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 36px)', fontWeight: '700', marginBottom: '8px', color: '#1A237E' }}>
              {isEdit ? '게시글 수정' : '게시글 쓰기'}
            </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '14px' }}>
          {isEdit ? '게시글을 수정하세요' : '새로운 게시글을 작성하세요'}
        </p>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">제목</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="form-input"
              placeholder="제목을 입력해주세요"
            />
          </div>
          <div className="form-group">
            <label className="form-label">내용</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={12}
              className="form-textarea"
              placeholder="내용을 입력해주세요"
            />
          </div>
          <div className="form-group">
            <label className="form-label">이미지 등록 (선택)</label>
            <input
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="form-input"
              placeholder="https://example.com/image.jpg"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '14px', fontSize: '16px', marginTop: '8px' }}
          >
            {loading ? (isEdit ? '수정 중...' : '등록 중...') : (isEdit ? '수정하기' : '작성하기')}
          </button>
        </form>
        </div>
      </div>
    </div>
  </div>
  );
}

