import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { userApi } from '../services/api';
import { setTokens } from '../utils/auth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await userApi.login(email, password);
      setTokens(response.accessToken, response.refreshToken);
      navigate('/');
    } catch (err: any) {
      setError(err.message || '로그인에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom, #E3F2FD 0%, #FFF9E6 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div className="card" style={{ maxWidth: '440px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>🐼</div>
          <h2 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px', color: '#1A237E' }}>로그인</h2>
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '14px' }}>계정에 로그인하세요</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">이메일</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-input"
              placeholder="your@email.com"
            />
          </div>
          <div className="form-group">
            <label className="form-label">비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-input"
              placeholder="••••••••"
            />
          </div>
          {error && <div className="alert alert-error">{error}</div>}
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '14px', fontSize: '16px', marginTop: '8px' }}
          >
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>
        
        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0', gap: '12px' }}>
            <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }}></div>
            <span style={{ color: '#6b7280', fontSize: '14px' }}>또는</span>
            <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }}></div>
          </div>
          <a
            href="http://localhost:8080/auth/google"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              width: '100%',
              padding: '12px',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              background: 'white',
              color: '#1A237E',
              textDecoration: 'none',
              fontSize: '15px',
              fontWeight: '500',
              transition: 'all 0.2s ease',
              marginTop: '12px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#f9fafb';
              e.currentTarget.style.borderColor = '#d1d5db';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'white';
              e.currentTarget.style.borderColor = '#e5e7eb';
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Google로 로그인
          </a>
        </div>
        
        <p style={{ marginTop: '24px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '14px' }}>
          계정이 없으신가요? <Link to="/signup" style={{ color: '#4A90E2', fontWeight: '500' }}>회원가입</Link>
        </p>
      </div>
    </div>
  );
}

