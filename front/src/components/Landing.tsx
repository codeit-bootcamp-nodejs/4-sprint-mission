import { Link } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';

export default function Landing() {
  const authenticated = isAuthenticated();

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom, #E3F2FD 0%, #FFF9E6 100%)' }}>
      {/* Navigation */}
      <nav
        style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          padding: '16px 0',
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
          borderBottom: '1px solid rgba(229, 231, 235, 0.5)',
          position: 'sticky',
          top: 0,
          zIndex: 1000
        }}
      >
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link 
            to="/" 
            style={{ 
              color: '#4A90E2', 
              textDecoration: 'none', 
              fontSize: '24px', 
              fontWeight: '700',
              letterSpacing: '-0.5px',
            }}
          >
            🐼 판다마켓
          </Link>
          {authenticated ? (
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <Link 
                to="/products" 
                style={{ 
                  color: '#1A237E', 
                  textDecoration: 'none',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#E3F2FD';
                  e.currentTarget.style.color = '#4A90E2';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#1A237E';
                }}
              >
                상품
              </Link>
              <Link 
                to="/posts" 
                style={{ 
                  color: '#1A237E', 
                  textDecoration: 'none',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#E3F2FD';
                  e.currentTarget.style.color = '#4A90E2';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#1A237E';
                }}
              >
                게시글
              </Link>
              <Link 
                to="/profile" 
                style={{ 
                  color: '#1A237E', 
                  textDecoration: 'none',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#E3F2FD';
                  e.currentTarget.style.color = '#4A90E2';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#1A237E';
                }}
              >
                프로필
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <Link 
                to="/login" 
                className="btn btn-secondary"
                style={{ textDecoration: 'none' }}
              >
                로그인
              </Link>
              <Link 
                to="/signup" 
                className="btn btn-primary"
                style={{ textDecoration: 'none' }}
              >
                회원가입
              </Link>
            </div>
          )}
        </div>
      </nav>
      {/* Hero Section */}
      <section style={{ 
        position: 'relative', 
        padding: '80px 20px', 
        background: 'linear-gradient(to bottom, #E3F2FD 0%, #FFF3E0 100%)',
        overflow: 'hidden'
      }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '40px' }}>
          <div style={{ flex: 1, minWidth: '300px', zIndex: 2 }}>
            <h1 style={{ 
              fontSize: 'clamp(36px, 5vw, 64px)', 
              fontWeight: '700', 
              color: '#1A237E',
              marginBottom: '16px',
              lineHeight: '1.2'
            }}>
              일상의 모든 물건을
              <br />
              거래해 보세요
            </h1>
            <Link
              to={authenticated ? "/products" : "/login"}
              className="btn btn-primary"
              style={{
                display: 'inline-block',
                padding: '16px 32px',
                fontSize: '18px',
                fontWeight: '600',
                borderRadius: '12px',
                textDecoration: 'none',
                marginTop: '24px',
                boxShadow: '0 4px 12px rgba(74, 144, 226, 0.3)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(74, 144, 226, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(74, 144, 226, 0.3)';
              }}
            >
              구경하러 가기
            </Link>
          </div>
          <div style={{ 
            flex: 1, 
            minWidth: '300px', 
            position: 'relative',
            height: '400px',
            zIndex: 1
          }}>
            {/* Panda Character Illustration */}
            <div style={{
              position: 'absolute',
              bottom: '0',
              right: '0',
              width: '300px',
              height: '350px',
              background: 'linear-gradient(to bottom, #FFF3E0 0%, #FFE0B2 100%)',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
            }}>
              {/* Panda Character */}
              <div style={{ position: 'relative', fontSize: '120px' }}>🐼</div>
              {/* Building */}
              <div style={{
                position: 'absolute',
                left: '20px',
                bottom: '40px',
                width: '80px',
                height: '100px',
                background: '#FFF8E1',
                borderRadius: '8px',
                border: '2px solid #FFCC80',
                display: 'flex',
                flexWrap: 'wrap',
                padding: '8px',
                gap: '4px'
              }}>
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} style={{
                    width: '18px',
                    height: '18px',
                    background: '#FFB74D',
                    borderRadius: '2px'
                  }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hot Items Section */}
      <section style={{ padding: '80px 20px', background: 'white' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '60px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '300px' }}>
            <div style={{
              width: '200px',
              height: '250px',
              background: 'linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%)',
              borderRadius: '16px',
              position: 'relative',
              margin: '0 auto',
              boxShadow: '0 8px 24px rgba(76, 175, 80, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              padding: '20px'
            }}>
              <div style={{ fontSize: '80px', marginBottom: '16px' }}>👕</div>
              <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                {[1, 2, 3].map((i) => (
                  <span key={i} style={{ fontSize: '24px', color: '#E91E63' }}>❤️</span>
                ))}
              </div>
            </div>
          </div>
          <div style={{ flex: 1, minWidth: '300px' }}>
            <div style={{ color: '#4A90E2', fontSize: '14px', fontWeight: '600', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Hot item
            </div>
            <h2 style={{ 
              fontSize: 'clamp(32px, 4vw, 48px)', 
              fontWeight: '700', 
              color: '#1A237E',
              marginBottom: '16px',
              lineHeight: '1.3'
            }}>
              인기 상품을
              <br />
              확인해 보세요
            </h2>
            <p style={{ 
              fontSize: '16px', 
              color: '#666', 
              lineHeight: '1.8',
              marginTop: '16px'
            }}>
              가장 HOT한 중고거래 물품을
              <br />
              판다 마켓에서 확인해 보세요
            </p>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section style={{ padding: '80px 20px', background: 'white' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '60px', flexWrap: 'wrap-reverse' }}>
          <div style={{ flex: 1, minWidth: '300px' }}>
            <div style={{ color: '#4A90E2', fontSize: '14px', fontWeight: '600', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Search
            </div>
            <h2 style={{ 
              fontSize: 'clamp(32px, 4vw, 48px)', 
              fontWeight: '700', 
              color: '#1A237E',
              marginBottom: '16px',
              lineHeight: '1.3'
            }}>
              구매를 원하는
              <br />
              상품을 검색하세요
            </h2>
            <p style={{ 
              fontSize: '16px', 
              color: '#666', 
              lineHeight: '1.8',
              marginTop: '16px'
            }}>
              구매하고 싶은 물품은 검색해서
              <br />
              쉽게 찾아보세요
            </p>
          </div>
          <div style={{ flex: 1, minWidth: '300px', display: 'flex', justifyContent: 'center' }}>
            <div style={{ position: 'relative', width: '300px', height: '200px' }}>
              {/* Search Cards */}
              <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', alignItems: 'center' }}>
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    style={{
                      width: '80px',
                      height: '100px',
                      background: i === 2 ? '#E3F2FD' : '#F5F5F5',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '32px',
                      border: i === 2 ? '2px solid #4A90E2' : '2px solid transparent',
                      boxShadow: i === 2 ? '0 4px 12px rgba(74, 144, 226, 0.2)' : 'none'
                    }}
                  >
                    {i === 2 ? '❓' : ''}
                  </div>
                ))}
              </div>
              {/* Magnifying Glass */}
              <div style={{
                position: 'absolute',
                top: '-20px',
                left: '50%',
                transform: 'translateX(-50%)',
                fontSize: '60px',
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))'
              }}>
                🔍
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Register Section */}
      <section style={{ padding: '80px 20px', background: 'white' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '60px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '300px', display: 'flex', justifyContent: 'center' }}>
            <div style={{ position: 'relative', width: '250px', height: '250px' }}>
              {/* Folder Icons */}
              <div style={{
                position: 'absolute',
                bottom: '0',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '100px',
                height: '120px',
                background: '#1976D2',
                borderRadius: '8px 8px 0 0',
                boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)'
              }} />
              <div style={{
                position: 'absolute',
                bottom: '10px',
                left: '45%',
                width: '90px',
                height: '110px',
                background: '#64B5F6',
                borderRadius: '8px 8px 0 0',
                opacity: 0.7,
                zIndex: -1
              }} />
              {/* Floating Icons */}
              {[
                { top: '20px', left: '20px', emoji: '✏️', bg: '#9C27B0' },
                { top: '40px', right: '30px', emoji: '📚', bg: '#03A9F4' },
                { top: '60px', left: '40px', emoji: '💕', bg: '#E91E63' }
              ].map((item, i) => (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    top: item.top,
                    left: item.left,
                    right: item.right,
                    width: '60px',
                    height: '60px',
                    background: item.bg,
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '32px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                  }}
                >
                  {item.emoji}
                </div>
              ))}
              {/* Magic Wand */}
              <div style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                fontSize: '40px',
                transform: 'rotate(-20deg)',
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
              }}>
                ✨
              </div>
            </div>
          </div>
          <div style={{ flex: 1, minWidth: '300px' }}>
            <div style={{ color: '#4A90E2', fontSize: '14px', fontWeight: '600', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Register
            </div>
            <h2 style={{ 
              fontSize: 'clamp(32px, 4vw, 48px)', 
              fontWeight: '700', 
              color: '#1A237E',
              marginBottom: '16px',
              lineHeight: '1.3'
            }}>
              판매를 원하는
              <br />
              상품을 등록하세요
            </h2>
            <p style={{ 
              fontSize: '16px', 
              color: '#666', 
              lineHeight: '1.8',
              marginTop: '16px'
            }}>
              어떤 물건이든 판매하고 싶은 상품을
              <br />
              쉽게 등록하세요
            </p>
            {authenticated && (
              <Link
                to="/products/new"
                className="btn btn-primary"
                style={{
                  display: 'inline-block',
                  padding: '14px 28px',
                  fontSize: '16px',
                  fontWeight: '600',
                  borderRadius: '10px',
                  textDecoration: 'none',
                  marginTop: '24px'
                }}
              >
                상품 등록하기
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Trustworthy Section */}
      <section style={{ 
        position: 'relative',
        padding: '80px 20px', 
        background: 'linear-gradient(to bottom, #E3F2FD 0%, #FFF3E0 100%)',
        overflow: 'hidden'
      }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '40px' }}>
          <div style={{ flex: 1, minWidth: '300px', zIndex: 2 }}>
            <h2 style={{ 
              fontSize: 'clamp(36px, 5vw, 56px)', 
              fontWeight: '700', 
              color: '#1A237E',
              marginBottom: '24px',
              lineHeight: '1.3'
            }}>
              믿을 수 있는
              <br />
              판다마켓 중고 거래
            </h2>
            <div style={{ display: 'flex', gap: '16px', marginTop: '32px', flexWrap: 'wrap' }}>
              <div style={{
                padding: '16px 24px',
                background: 'white',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <div style={{ fontSize: '32px' }}>💬</div>
                <div>
                  <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>실시간 채팅</div>
                  <div style={{ fontSize: '12px', color: '#999' }}>판매자와 직접 소통</div>
                </div>
              </div>
              <div style={{
                padding: '16px 24px',
                background: 'white',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <div style={{ fontSize: '32px' }}>⭐⭐⭐⭐⭐</div>
                <div>
                  <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>신뢰도 평가</div>
                  <div style={{ fontSize: '12px', color: '#999' }}>검증된 거래자</div>
                </div>
              </div>
            </div>
          </div>
          <div style={{ 
            flex: 1, 
            minWidth: '300px', 
            position: 'relative',
            height: '300px',
            zIndex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-end',
            gap: '20px'
          }}>
            {[1, 2].map((i) => (
              <div
                key={i}
                style={{
                  fontSize: '80px',
                  transform: `rotate(${i === 1 ? '-5deg' : '5deg'})`,
                  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))'
                }}
              >
                🐼
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        background: '#1A237E',
        padding: '24px 20px',
        textAlign: 'center'
      }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'center', gap: '32px', flexWrap: 'wrap' }}>
          <a href="#" style={{ color: 'white', textDecoration: 'none', fontSize: '14px', opacity: 0.8 }}>Privacy Policy</a>
          <a href="#" style={{ color: 'white', textDecoration: 'none', fontSize: '14px', opacity: 0.8 }}>FAQ</a>
        </div>
      </footer>
    </div>
  );
}

