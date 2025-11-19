import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userApi } from '../services/api';
import { Link } from 'react-router-dom';

export default function MyProducts() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadMyProducts();
  }, []);

  const loadMyProducts = async () => {
    try {
      const response = await userApi.getMyProducts();
      setProducts(response.data || []);
    } catch (err: any) {
      setError(err.message || '내 상품 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">로딩 중...</div>;
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom, #E3F2FD 0%, #FFF9E6 100%)', padding: '40px 20px' }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: '700', marginBottom: '32px', color: '#1A237E', margin: '0 0 32px 0' }}>📦 내가 등록한 상품</h1>
        {error && <div className="alert alert-error">{error}</div>}
        {products.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>📦</div>
            <p style={{ fontSize: '18px', color: 'var(--text-secondary)', marginBottom: '24px' }}>등록한 상품이 없습니다.</p>
            <Link to="/products/new" className="btn btn-primary" style={{ textDecoration: 'none', padding: '12px 24px', display: 'inline-block' }}>
              상품 등록하기
            </Link>
          </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
          {products.map((product) => (
            <div
              key={product.id}
              className="card"
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              }}
              onClick={() => navigate(`/products/${product.id}`)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
              }}
            >
              {product.image && (
                <img
                  src={product.image}
                  alt={product.title}
                  style={{ width: '100%', height: '200px', objectFit: 'cover', marginBottom: '16px', borderRadius: '8px' }}
                />
              )}
              <h3 style={{ marginTop: 0, marginBottom: '12px', fontSize: '20px', fontWeight: '600', color: 'var(--text-primary)' }}>{product.title}</h3>
              {product.tags && product.tags.length > 0 && (
                <div style={{ marginBottom: '12px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {product.tags.slice(0, 3).map((tag: string, index: number) => (
                    <span
                      key={index}
                      style={{
                        padding: '4px 10px',
                        background: 'rgba(74, 144, 226, 0.1)',
                        color: 'var(--primary-color)',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: '500',
                      }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
              <p style={{ color: 'var(--text-secondary)', marginBottom: '16px', flex: 1, fontSize: '14px', lineHeight: '1.6' }}>{product.content}</p>
              <div style={{ paddingTop: '16px', borderTop: '1px solid var(--border-color)', marginTop: 'auto' }}>
                <p style={{ fontSize: '24px', fontWeight: '700', color: 'var(--primary-color)', marginBottom: '8px' }}>
                  {product.price?.toLocaleString()}원
                </p>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  {product.createdAt ? new Date(product.createdAt).toLocaleDateString('ko-KR') : ''}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
    </div>
  );
}

