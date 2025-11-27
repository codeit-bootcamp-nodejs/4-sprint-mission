import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productApi, userApi } from '../services/api';
import { Link } from 'react-router-dom';

export default function ProductList() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<any[]>([]);
  const [bestProducts, setBestProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'latest' | 'likes'>('latest');
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const loadProducts = async () => {
    try {
      const response = await productApi.list();
      const allProducts = response.data || [];
      
      // 좋아요 수를 포함한 상품 데이터 가져오기
      const productsWithLikes = await Promise.all(
        allProducts.map(async (product: any) => {
          try {
            const detailResponse = await productApi.getDetail(product.id);
            return detailResponse.data;
          } catch {
            return { ...product, likeCount: 0, isLiked: false };
          }
        })
      );
      
      // 베스트 상품 (좋아요 순으로 상위 4개)
      const sortedByLikes = [...productsWithLikes].sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0));
      setBestProducts(sortedByLikes.slice(0, 4));
      
      // 전체 상품 정렬
      let sortedProducts = [...productsWithLikes];
      if (sortBy === 'likes') {
        sortedProducts.sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0));
      } else {
        sortedProducts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }
      
      // 검색 필터 적용
      if (searchQuery.trim()) {
        sortedProducts = sortedProducts.filter((product: any) =>
          product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.content.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      setProducts(sortedProducts);
    } catch (err: any) {
      setError(err.message || '상품 목록을 불러오는데 실패했습니다.');
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
    loadProducts();
  }, [sortBy, searchQuery]);

  const handleDelete = async (productId: number) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
      await productApi.delete(productId);
      loadProducts();
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
        {/* 베스트 상품 섹션 */}
        {bestProducts.length > 0 && (
          <section style={{ marginBottom: '60px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#1A237E', marginBottom: '24px' }}>베스트 상품</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
              {bestProducts.map((product) => (
                <div
                  key={product.id}
                  className="card"
                  style={{
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    padding: '0',
                    overflow: 'hidden',
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
                      style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                    />
                  )}
                  <div style={{ padding: '16px' }}>
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: '600', color: '#1A237E', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {product.title}
                    </h3>
                    <p style={{ fontSize: '18px', fontWeight: '700', color: '#4A90E2', margin: '0 0 8px 0' }}>
                      {product.price?.toLocaleString()}원
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px', color: '#6b7280' }}>
                      <span>❤️</span>
                      <span>{product.likeCount || 0}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 판매 중인 상품 섹션 */}
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#1A237E', margin: 0 }}>판매 중인 상품</h2>
            <Link to="/products/new" className="btn btn-primary" style={{ textDecoration: 'none', padding: '12px 24px', fontSize: '16px', fontWeight: '600' }}>
              상품 등록하기
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
        {products.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>📦</div>
            <p style={{ fontSize: '18px', color: 'var(--text-secondary)', marginBottom: '24px' }}>등록된 상품이 없습니다.</p>
            <Link to="/products/new" className="btn btn-primary" style={{ textDecoration: 'none', padding: '12px 24px', display: 'inline-block' }}>
              첫 상품 등록하기
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
              <h3 style={{ marginTop: 0, marginBottom: '12px', fontSize: '20px', fontWeight: '600', color: '#1A237E' }}>{product.title}</h3>
              {product.tags && product.tags.length > 0 && (
                <div style={{ marginBottom: '12px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {product.tags.slice(0, 3).map((tag: string, index: number) => (
                    <span
                      key={index}
                      style={{
                        padding: '4px 10px',
                        background: 'rgba(74, 144, 226, 0.1)',
                        color: '#4A90E2',
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
              <p style={{ color: '#6b7280', marginBottom: '16px', flex: 1, fontSize: '14px', lineHeight: '1.6' }}>{product.content}</p>
              <div style={{ paddingTop: '16px', borderTop: '1px solid #e5e7eb', marginTop: 'auto' }}>
                <p style={{ fontSize: '24px', fontWeight: '700', color: '#4A90E2', marginBottom: '8px' }}>
                  {product.price?.toLocaleString()}원
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <span style={{ fontSize: '14px', color: '#6b7280' }}>❤️</span>
                  <span style={{ fontSize: '14px', color: '#6b7280' }}>{product.likeCount || 0}</span>
                </div>
                {currentUserId && product.userId === currentUserId && (
                  <div style={{ display: 'flex', gap: '8px' }} onClick={(e) => e.stopPropagation()}>
                    <Link
                      to={`/products/${product.id}/edit`}
                      className="btn btn-primary"
                      style={{ textDecoration: 'none', flex: 1, fontSize: '13px', padding: '8px 16px' }}
                    >
                      수정
                    </Link>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(product.id);
                      }}
                      className="btn btn-danger"
                      style={{ flex: 1, fontSize: '13px', padding: '8px 16px' }}
                    >
                      삭제
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
        </section>
      </div>
    </div>
  );
}

