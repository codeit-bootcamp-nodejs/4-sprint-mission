import { useState } from 'react';
import { userApi } from '../services/api';

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (newPassword !== confirmPassword) {
      setError('새 비밀번호가 일치하지 않습니다.');
      return;
    }

    setLoading(true);

    try {
      await userApi.changePassword(currentPassword, newPassword);
      setSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setError(err.message || '비밀번호 변경에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom, #E3F2FD 0%, #FFF9E6 100%)', padding: '40px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="container" style={{ maxWidth: '500px', width: '100%' }}>
        <div className="card">
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔒</div>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 36px)', fontWeight: '700', marginBottom: '8px', color: '#1A237E' }}>비밀번호 변경</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '14px' }}>계정 보안을 위해 비밀번호를 변경하세요</p>
        {success && <div className="alert alert-success">비밀번호가 성공적으로 변경되었습니다.</div>}
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">현재 비밀번호</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className="form-input"
              placeholder="••••••••"
            />
          </div>
          <div className="form-group">
            <label className="form-label">새 비밀번호</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="form-input"
              placeholder="••••••••"
            />
          </div>
          <div className="form-group">
            <label className="form-label">새 비밀번호 확인</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="form-input"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '14px', fontSize: '16px', marginTop: '8px' }}
          >
            {loading ? '변경 중...' : '비밀번호 변경'}
          </button>
        </form>
        </div>
      </div>
    </div>
  </div>
  );
}