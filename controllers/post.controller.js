import {
  postDeleteService,
  postListService,
  postPutService,
  postRegisterService,
} from "../services/post.service.js";

// 작성중 고민했던 부분 const userId = req.user.id; 이걸 어떤 부분에서는 const userId = req.user.userId 라고 썻던 부분이 있는데 혼용해서 쓰면 에러가 날것임
// 그레서 const userId = req.user.id; 로 통일 후 나중에 미들웨워 구축간 지칭어 통일 예정.

// 게시글 목록 조회
export async function postListController(req, res, next) {
  try {
    const userId = req.user.userId;

    const list = await postListService.postList(userId)

    //응답
    res.status(200).json({
      message:"게시글 목록 조회 성공",
      data: list
    })
  } catch (err) {
    next (err);
  }
}


// 로그인한 유저만 게시글 등록 가능
export async function postRegisterController(req, res, next) {
  try {
    // 로그인 정보 가져오기 ( 이미 로그인이 검증된 유저 정보 가져옴)
    const userId = req.user.userId;

    // 게시글 필요 요소 받아오기
    const { title, content } = req.body;

    // 서비스 로직
    const createdPost = await postRegisterService.postRegister(userId, title, content);

    // 응답
    res.status(200).json({
      message: "게시글 등록 성공",
      data: createdPost,
    });
  } catch (err) {
    next(err);
  }
}

// 게시글을 등록한 유저만 해당 글을 수정할 수 있음
export async function postPutController(req, res, next) {
  try {
    // 로그인 정보 가져오기 (이미 로그인이 검증된 상태로 들어옴)
    const userId = req.user.userId;

    // 수정하려는 게시글 id 가져오기
    const postId = req.params.postId;

    // 수정할 데이터
    const { title, content } = req.body;

    // 서비스 로직
    const updatedPost = await postPutService.postPut(userId, postId, title, content);

    // 응답
    res.status(200).json({
      message: "게시글 수정 성공",
      data: updatedPost,
    });
  } catch (err) {
    next(err);
  }
}

// 게시글을 등록한 유저만 해당 글을 삭제할 수 있음
export async function postDeleteController(req, res, next) {
  try {
    // 로그인 정보 가져오기
    const userId = req.user.userId;

    // 게시글 id 찾기
    const postId = req.params.postId;

    // 서비스 로직
    const deletedPost = await postDeleteService.postDelete(userId, postId);

    // 응답
    res.status(200).json({
      message: "게시글 삭제 성공",
      data: deletedPost,
    });
  } catch (err) {
    next(err);
  }
}
