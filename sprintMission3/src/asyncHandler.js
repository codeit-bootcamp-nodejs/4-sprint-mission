import { Prisma } from '@prisma/client'; 
//비동기 에러 핸들링 함수
export function asyncHandler (handler){
  return async function (req,res){
    try{
      await handler(req, res);
    } catch(err){
      if(
        err.name === 'StructError' ||
        err instanceof Prisma.PrismaClientValidationError
      ){
        return res.status(400).json({ message: '요청하신 정보는 유효하지 않습니다.'});
      } else if(
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === 'P2025'
      ){
        return res.status(404).json({ message: '요청하신 정보를 찾을 수 없습니다.' });
      } else {
        return res.status(500).json({ message: '서버 오류로 요청하신 정보를 처리할 수 없습니다.'});
      }
    }
  }; //{ message: e.message }
}

