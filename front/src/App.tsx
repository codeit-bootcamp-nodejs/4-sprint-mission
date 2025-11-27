import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { isAuthenticated } from './utils/auth';
import { userApi, notificationApi } from './services/api';
import Login from './components/Login';
import Signup from './components/Signup';
import Profile from './components/Profile';
import ChangePassword from './components/ChangePassword';
import Landing from './components/Landing';
import ProductList from './components/ProductList';
import ProductForm from './components/ProductForm';
import ProductDetail from './components/ProductDetail';
import PostList from './components/PostList';
import PostDetail from './components/PostDetail';
import PostForm from './components/PostForm';
import NotificationList from './components/NotificationList';
import MyProducts from './components/MyProducts';
import AuthCallback from './components/AuthCallback';

// 인증이 필요한 라우트를 보호하는 컴포넌트
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

// 인증이 필요 없는 라우트 (이미 로그인한 경우 홈으로 리다이렉트)
function PublicRoute({ children }: { children: React.ReactNode }) {
  if (isAuthenticated()) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}

function NavNotification() {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (isAuthenticated()) {
      loadUnreadCount();
    }
  }, []);

  const loadUnreadCount = async () => {
    try {
      const response = await notificationApi.getUnreadCount();
      setUnreadCount(response.data.count);
    } catch (err) {
      console.error('미읽음 알림 개수 조회 실패:', err);
    }
  };

  return (
    <Link
      to="/notifications"
      style={{
        position: 'relative',
        textDecoration: 'none',
        color: '#1A237E',
        fontSize: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        transition: 'all 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = '#E3F2FD';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'transparent';
      }}
    >
      🔔
      {unreadCount > 0 && (
        <span
          style={{
            position: 'absolute',
            top: '-4px',
            right: '-4px',
            background: '#EF5350',
            color: 'white',
            fontSize: '12px',
            fontWeight: '700',
            borderRadius: '50%',
            width: '20px',
            height: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid white',
          }}
        >
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </Link>
  );
}

function NavProfile() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (isAuthenticated()) {
      loadProfile();
    }
  }, []);

  const loadProfile = async () => {
    try {
      const response = await userApi.getProfile();
      setUser(response.user);
    } catch (err) {
      console.error('프로필 로드 실패:', err);
    }
  };

  return (
    <Link
      to="/profile"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        textDecoration: 'none',
        color: '#1A237E',
        fontSize: '16px',
        fontWeight: '500',
        padding: '8px 12px',
        borderRadius: '8px',
        transition: 'all 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = '#E3F2FD';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'transparent';
      }}
    >
      <div
        style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #4A90E2 0%, #FFB74D 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '14px',
          fontWeight: '600',
        }}
      >
        {user?.nickname?.[0]?.toUpperCase() || 'U'}
      </div>
      <span>{user?.nickname || '사용자'}</span>
    </Link>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <nav
        style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          padding: '16px 0',
          marginBottom: '30px',
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
          borderBottom: '1px solid rgba(229, 231, 235, 0.5)',
        }}
      >
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            <Link 
              to="/" 
              style={{ 
                color: '#4A90E2', 
                textDecoration: 'none', 
                fontSize: '24px', 
                fontWeight: '700',
                letterSpacing: '-0.5px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span style={{ fontSize: '28px' }}>🐼</span>
              <span>판다마켓</span>
            </Link>
            {isAuthenticated() && (
              <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                <Link 
                  to="/products" 
                  style={{ 
                    color: '#1A237E', 
                    textDecoration: 'none',
                    fontSize: '16px',
                    fontWeight: '500',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#4A90E2';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#1A237E';
                  }}
                >
                  중고마켓
                </Link>
                <Link 
                  to="/posts" 
                  style={{ 
                    color: '#1A237E', 
                    textDecoration: 'none',
                    fontSize: '16px',
                    fontWeight: '500',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#4A90E2';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#1A237E';
                  }}
                >
                  자유게시판
                </Link>
              </div>
            )}
          </div>
          {isAuthenticated() ? (
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <NavNotification />
              <NavProfile />
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
      <main>{children}</main>
    </div>
  );
}

function Home() {
  if (!isAuthenticated()) {
    return <Landing />;
  }

  return (
    <Layout>
      <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom, #E3F2FD 0%, #FFF9E6 100%)', padding: '40px 20px' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>🐼</div>
            <h1 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: '700', marginBottom: '12px', color: '#1A237E' }}>판다마켓에 오신 것을 환영합니다!</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '40px', fontSize: '18px' }}>원하는 기능을 선택하세요</p>
          </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
        <Link
          to="/products"
          className="card"
          style={{
            textDecoration: 'none',
            color: 'inherit',
            textAlign: 'center',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>🛍️</div>
          <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '8px', color: '#1A237E' }}>상품 관리</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>상품을 등록하고 관리하세요</p>
        </Link>
        <Link
          to="/posts"
          className="card"
          style={{
            textDecoration: 'none',
            color: 'inherit',
            textAlign: 'center',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px)';
            e.currentTarget.style.boxShadow = '0 12px 24px rgba(74, 144, 226, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 6px -1px rgb(0 0 0 / 0.1)';
          }}
        >
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>📝</div>
          <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '8px', color: '#1A237E' }}>게시글 관리</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>게시글을 작성하고 관리하세요</p>
        </Link>
        <Link
          to="/my-products"
          className="card"
          style={{
            textDecoration: 'none',
            color: 'inherit',
            textAlign: 'center',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px)';
            e.currentTarget.style.boxShadow = '0 12px 24px rgba(74, 144, 226, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 6px -1px rgb(0 0 0 / 0.1)';
          }}
        >
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>📦</div>
          <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '8px', color: '#1A237E' }}>내 상품</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>내가 등록한 상품을 확인하세요</p>
        </Link>
        <Link
          to="/notifications"
          className="card"
          style={{
            textDecoration: 'none',
            color: 'inherit',
            textAlign: 'center',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px)';
            e.currentTarget.style.boxShadow = '0 12px 24px rgba(74, 144, 226, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 6px -1px rgb(0 0 0 / 0.1)';
          }}
        >
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>🔔</div>
          <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '8px', color: '#1A237E' }}>알림</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>알림을 확인하세요</p>
        </Link>
      </div>
        </div>
      </div>
    </Layout>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Layout>
                  <Login />
                </Layout>
              </PublicRoute>
            }
          />
          <Route
            path="/auth/callback"
            element={<AuthCallback />}
          />
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <Layout>
                  <Signup />
                </Layout>
              </PublicRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Layout>
                  <Profile />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/change-password"
            element={
              <ProtectedRoute>
                <Layout>
                  <ChangePassword />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <Layout>
                  <ProductList />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/products/new"
            element={
              <ProtectedRoute>
                <Layout>
                  <ProductForm />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/products/:id"
            element={
              <ProtectedRoute>
                <Layout>
                  <ProductDetail />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/products/:id/edit"
            element={
              <ProtectedRoute>
                <Layout>
                  <ProductForm />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/posts"
            element={
              <ProtectedRoute>
                <Layout>
                  <PostList />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/posts/new"
            element={
              <ProtectedRoute>
                <Layout>
                  <PostForm />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/posts/:id"
            element={
              <ProtectedRoute>
                <Layout>
                  <PostDetail />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/posts/:id/edit"
            element={
              <ProtectedRoute>
                <Layout>
                  <PostForm />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-products"
            element={
              <ProtectedRoute>
                <Layout>
                  <MyProducts />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <Layout>
                  <NotificationList />
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
    </BrowserRouter>
  );
}

export default App;

