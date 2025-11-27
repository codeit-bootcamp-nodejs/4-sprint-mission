import { getToken, getRefreshToken, setTokens, clearTokens } from '../utils/auth';

const API_BASE_URL = 'http://52.79.236.229/api';

// API 요청 헬퍼
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // 토큰 만료 시 재발급 시도
  if (response.status === 401) {
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      try {
        const refreshResponse = await fetch(`${API_BASE_URL}/user/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken }),
        });

        if (refreshResponse.ok) {
          const { newAccessToken } = await refreshResponse.json();
          setTokens(newAccessToken, refreshToken);

	  //새로운 토큰으로 재시도
	  const newHeaders = new Headers(options.headers);
	  newHeaders.set('Content-Type', 'application/json');
	  newHeaders.set('Authorization', `Bearer ${newAccessToken}`);

          // 원래 요청 재시도
          
          const retryResponse = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers: newHeaders,
          });

          return retryResponse.json();
        }
      } catch (error) {
        clearTokens();
        window.location.href = '/login';
        throw error;
      }
    }
    clearTokens();
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }

  if (!response.ok) {
	  throw new Error('Request failed');
  }

  return response.json();
}

// User API
export const userApi = {
  signup: async (email: string, nickname: string, password: string) => {
    return apiRequest('/user/sign', {
      method: 'POST',
      body: JSON.stringify({ email, nickname, password }),
    });
  },

  login: async (email: string, password: string) => {
    return apiRequest<{
      message: string;
      user: any;
      accessToken: string;
      refreshToken: string;
    }>('/user/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  refresh: async (refreshToken: string) => {
    return apiRequest<{ message: string; accesToken: string }>('/user/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  },

  getProfile: async () => {
    return apiRequest<{ message: string; user: any }>('/user');
  },

  updateProfile: async (data: { password: string; nickname: string; email: string; image?: string | null }) => {
    return apiRequest('/user', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    return apiRequest('/user/password', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  },

  getMyProducts: async () => {
    return apiRequest<{ message: string; data: any[] }>('/user/listup');
  },
};

// Product API
export const productApi = {
  list: async () => {
    return apiRequest<{ message: string; data: any[] }>('/product');
  },

  getDetail: async (productId: number) => {
    return apiRequest<{ message: string; data: any }>(`/product/${productId}`);
  },

  create: async (title: string, content: string, price: number, image?: string | null, tags?: string[]) => {
    return apiRequest('/product', {
      method: 'POST',
      body: JSON.stringify({ title, content, price, image, tags }),
    });
  },

  update: async (productId: number, title: string, content: string, price: number, image?: string | null, tags?: string[]) => {
    return apiRequest(`/product/${productId}`, {
      method: 'PUT',
      body: JSON.stringify({ title, content, price, image, tags }),
    });
  },

  delete: async (productId: number) => {
    return apiRequest(`/product/${productId}`, {
      method: 'DELETE',
    });
  },
};

// Post API
export const postApi = {
  list: async () => {
    return apiRequest<{ message: string; data: any[] }>('/post');
  },

  getDetail: async (postId: number) => {
    return apiRequest<{ message: string; data: any }>(`/post/${postId}`);
  },

  create: async (title: string, content: string, image?: string | null) => {
    return apiRequest('/post', {
      method: 'POST',
      body: JSON.stringify({ title, content, image }),
    });
  },

  update: async (postId: number, title: string, content: string, image?: string | null) => {
    return apiRequest(`/post/${postId}`, {
      method: 'PUT',
      body: JSON.stringify({ title, content, image }),
    });
  },

  delete: async (postId: number) => {
    return apiRequest(`/post/${postId}`, {
      method: 'DELETE',
    });
  },
};

// Comment API
export const commentApi = {
  list: async () => {
    return apiRequest<{ message: string; data: any[] }>('/comment');
  },

  createForProduct: async (productId: number, content: string) => {
    return apiRequest('/comment/products', {
      method: 'POST',
      body: JSON.stringify({ productId, content }),
    });
  },

  createForPost: async (postId: number, content: string) => {
    return apiRequest('/comment/posts', {
      method: 'POST',
      body: JSON.stringify({ postId, content }),
    });
  },

  update: async (commentId: number, content: string) => {
    return apiRequest(`/comment/${commentId}`, {
      method: 'PUT',
      body: JSON.stringify({ content }),
    });
  },

  delete: async (commentId: number) => {
    return apiRequest(`/comment/${commentId}`, {
      method: 'DELETE',
      body: JSON.stringify({}),
    });
  },
};

// Like API
export const likeApi = {
  toggleProduct: async (productId: number) => {
    return apiRequest<{ message: string; data: any }>(`/like/products/${productId}`, {
      method: 'POST',
    });
  },

  togglePost: async (postId: number) => {
    return apiRequest<{ message: string; data: any }>(`/like/posts/${postId}`, {
      method: 'POST',
    });
  },

  checkProduct: async (productId: number) => {
    return apiRequest<{ message: string; data: { isLiked: boolean } }>(`/like/products/${productId}`);
  },

  checkPost: async (postId: number) => {
    return apiRequest<{ message: string; data: { isLiked: boolean } }>(`/like/posts/${postId}`);
  },

  getLikedProducts: async () => {
    return apiRequest<{ message: string; data: any[] }>('/like/listProductlist');
  },
};

// Notification API
export const notificationApi = {
  list: async () => {
    return apiRequest<{ message: string; data: any[] }>('/notification');
  },

  getUnreadCount: async () => {
    return apiRequest<{ message: string; data: { count: number } }>('/notification/unread');
  },

  markAsRead: async (notificationId: number) => {
    return apiRequest(`/notification/${notificationId}`, {
      method: 'PATCH',
    });
  },

  markAllAsRead: async () => {
    return apiRequest('/notification/read/all', {
      method: 'PATCH',
    });
  },
};

