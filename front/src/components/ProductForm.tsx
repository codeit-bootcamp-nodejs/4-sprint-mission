import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { productApi } from '../services/api';

export default function ProductForm() {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit) {
      loadProduct();
    }
  }, [id]);

  const loadProduct = async () => {
    // 편집 모드에서는 상품 목록에서 데이터를 가져와야 하지만,
    // 개별 상품 조회 API가 없으므로 목록에서 찾거나 다른 방법 사용
    // 여기서는 간단히 폼만 표시
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
      if (isEdit) {
        await productApi.update(Number(id), title, content, Number(price), image || null, tagsArray);
      } else {
        await productApi.create(title, content, Number(price), image || null, tagsArray);
      }
      navigate('/products');
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
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🛍️</div>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 36px)', fontWeight: '700', marginBottom: '8px', color: '#1A237E' }}>
              {isEdit ? '상품 수정' : '상품 등록'}
            </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '14px' }}>
          {isEdit ? '상품 정보를 수정하세요' : '새로운 상품을 등록하세요'}
        </p>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">상품 이미지 (선택)</label>
            <input
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="form-input"
              placeholder="https://example.com/image.jpg"
            />
          <div className="form-group">
            <label className="form-label">상품명</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="form-input"
              placeholder="상품명을 입력해주세요"
            />
          </div>
          <div className="form-group">
            <label className="form-label">상품소개</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={6}
              className="form-textarea"
              placeholder="상품 소개를 입력해주세요"
            />
          </div>
          <div className="form-group">
            <label className="form-label">판매가격</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              min="0"
              className="form-input"
              placeholder="판매 가격을 입력해주세요"
            />
          </div>
          </div>
          <div className="form-group">
            <label className="form-label">태그 </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="form-input"
              placeholder="태그를 입력해주세요"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '14px', fontSize: '16px', marginTop: '8px' }}
          >
            {loading ? (isEdit ? '수정 중...' : '등록 중...') : (isEdit ? '수정하기' : '등록하기')}
          </button>
        </form>
        </div>
      </div>
    </div>
  </div>
  );
}