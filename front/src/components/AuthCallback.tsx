import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { setTokens } from '../utils/auth';

export default function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const refreshToken = searchParams.get('refreshToken');
    const isNewUser = searchParams.get('isNewUser') === 'true';
    const error = searchParams.get('error');

    if (error) {
      alert('로그인에 실패했습니다. 다시 시도해주세요.');
      navigate('/login');
      return;
    }

    if (token && refreshToken) {
      setTokens(token, refreshToken);
      if (isNewUser) {
        alert('회원가입이 완료되었습니다!');
      }
      navigate('/');
    } else {
      alert('로그인에 실패했습니다.');
      navigate('/login');
    }
  }, [searchParams, navigate]);

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom, #E3F2FD 0%, #FFF9E6 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
        <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#1A237E', marginBottom: '8px' }}>로그인 처리 중...</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>잠시만 기다려주세요</p>
      </div>
    </div>
  );
}

