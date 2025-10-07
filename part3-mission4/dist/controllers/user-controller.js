import { userService } from '../services/user-service.js';
import { productService } from '../services/product-service.js';
import { articleService } from '../services/article-service.js';
class UserController {
    // 회원가입
    async register(req, res) {
        const { username, email, password } = req.body;
        const user = await userService.register(username, email, password);
        res.status(201).json({
            data: user,
            message: '회원 가입 성공!',
        });
    }
    // 로그인
    async login(req, res) {
        const userId = req.user.id;
        const { accessToken, refreshToken } = await userService.login(userId);
        userService.setTokenCookies(res, accessToken, refreshToken);
        res.status(200).json({
            accesstoken: accessToken,
            refreshToken: refreshToken,
            message: '로그인 되었습니다.',
        });
    }
    // 로그아웃
    logout(req, res) {
        userService.clearTokenCookies(res);
        res.status(200).send({ message: '로그아웃 되었습니다.' });
    }
    // 유저 정보 조회
    async getUserProfile(req, res) {
        const idParam = req.params.userId;
        const userId = parseInt(idParam, 10);
        const profile = await userService.getUserProfile(userId);
        if (!profile) {
            return res.status(404).json({ message: '유저를 찾을 수 없습니다.' });
        }
        res.status(200).json({ profile, message: '유저 프로필 조회!' });
    }
    // 유저 정보 수정
    async updateUserProfile(req, res) {
        const { username, email, images } = req.body; // 수정할 필드만 뽑음
        const updateData = { username, email, images };
        const idParam = req.params.userId;
        const userId = parseInt(idParam, 10);
        const updated = await userService.updateUserProfile(userId, updateData);
        res.status(200).json({ updated, message: '프로필 수정 완료!' });
    }
    // 비밀번호 수정
    async updatePassword(req, res) {
        const idParam = req.params.userId;
        const userId = parseInt(idParam, 10);
        const { currentPassword, newPassword, newPasswordConfirm } = req.body;
        if (newPassword !== newPasswordConfirm) {
            return res
                .status(400)
                .json({ message: '새 비밀번호가 일치하지 않습니다.' });
        }
        await userService.updatePassword(userId, currentPassword, newPassword);
        res.status(200).json({ message: '비밀번호가 변경되었습니다.' });
    }
    // 유저가 단 댓글 조회
    async getUserComments(req, res) {
        const idParam = req.params.userId;
        const userId = parseInt(idParam, 10);
        const comments = await userService.getUserComments(userId);
        res.status(200).json({ comments });
    }
    // 유저가 좋아요 누른 상품 조회
    async getUserLikedProducts(req, res) {
        const idParam = req.params.userId;
        const userId = parseInt(idParam, 10);
        const likedProducts = await productService.getUserLikedProducts(userId);
        res.json({ data: likedProducts });
    }
    // 유저가 좋아요 누른 게시글 조회
    async getUserLikedArticles(req, res) {
        const idParam = req.params.userId;
        const userId = parseInt(idParam, 10);
        const likedArticles = await articleService.getUserLikedArticles(userId);
        res.json({ data: likedArticles });
    }
    // 유저가 좋아요 누른 댓글 조회
    async getUserLikedComments(req, res) {
        const idParam = req.params.userId;
        const userId = parseInt(idParam, 10);
        const likedComments = await userService.getUserLikedComments(userId);
        res.json({ data: likedComments });
    }
}
export const userController = new UserController();
//# sourceMappingURL=user-controller.js.map