// 좋아요 토글 결과
export interface ToggleLikeResult {
    message: string;
    isLiked: boolean;
}

// 좋아요 생성 데이터
export interface CreateLikeData {
    userId: number;
    resourceType: string;
    resourceId: number;
}

// 좋아요 요청 타입들
export interface ToggleLikeRequest {
    user: {
        id: number;
        email: string;
        nickname: string;
    };
    resourceType: string;
    resourceId: string;
}

export interface GetMyLikesRequest {
    user: {
        id: number;
        email: string;
        nickname: string;
    };
    resourceType: string;
}

