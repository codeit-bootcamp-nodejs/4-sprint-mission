import { useState, useEffect } from 'react';
import { userApi } from '../services/api';
import { clearTokens } from '../utils/auth';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [image, setImage] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await userApi.getProfile();
      setUser(response.user);
      setNickname(response.user.nickname || '');
      setEmail(response.user.email || '');
      setImage(response.user.image || '');
    } catch (err: any) {
      setError(err.message || '프로필을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!password) {
      setError('비밀번호를 입력해주세요.');
      return;
    }
    try {
      await userApi.updateProfile({ password, nickname, email, image: image || null });
      setEditing(false);
      setPassword('');
      loadProfile();
    } catch (err: any) {
      setError(err.message || '프로필 수정에 실패했습니다.');
    }
  };

  const handleLogout = () => {
    clearTokens();
    navigate('/login');
  };

  if (loading) {
    return <div className="loading">로딩 중...</div>;
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom, #E3F2FD 0%, #FFF9E6 100%)', padding: '40px 20px' }}>
      <div className="container" style={{ maxWidth: '700px', margin: '0 auto' }}>
        <div className="card">
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🐼</div>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 36px)', fontWeight: '700', color: '#1A237E' }}>내 프로필</h2>
          </div>
        {error && <div className="alert alert-error">{error}</div>}
        
        {editing ? (
          <div>
            <div className="form-group">
              <label className="form-label">현재 비밀번호 <span style={{ color: 'var(--danger-color)' }}>*</span></label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                placeholder="프로필 수정을 위해 비밀번호를 입력하세요"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">닉네임</label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">이메일</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">이미지 URL</label>
              <input
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="form-input"
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button onClick={handleUpdate} className="btn btn-primary">
                저장
              </button>
              <button 
                onClick={() => {
                  setEditing(false);
                  setPassword('');
                  setError('');
                }} 
                className="btn btn-secondary"
              >
                취소
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              {user?.image ? (
                <img
                  src={user.image}
                  alt="프로필"
                  style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', border: '4px solid var(--primary-color)', boxShadow: 'var(--shadow-md)' }}
                />
              ) : (
                <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px', color: 'white' }}>
                  {user?.nickname?.[0]?.toUpperCase() || 'U'}
                </div>
              )}
            </div>
            <div style={{ marginBottom: '24px' }}>
              <div style={{ marginBottom: '16px', padding: '16px', background: 'var(--light-color)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>닉네임</div>
                <div style={{ fontSize: '18px', fontWeight: '600', color: 'var(--text-primary)' }}>{user?.nickname}</div>
              </div>
              <div style={{ marginBottom: '16px', padding: '16px', background: 'var(--light-color)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>이메일</div>
                <div style={{ fontSize: '18px', fontWeight: '600', color: 'var(--text-primary)' }}>{user?.email}</div>
              </div>
              <div style={{ padding: '16px', background: 'var(--light-color)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>가입일</div>
                <div style={{ fontSize: '18px', fontWeight: '600', color: 'var(--text-primary)' }}>
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('ko-KR') : ''}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button onClick={() => setEditing(true)} className="btn btn-primary">
                프로필 수정
              </button>
              <button onClick={handleLogout} className="btn btn-danger">
                로그아웃
              </button>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}

