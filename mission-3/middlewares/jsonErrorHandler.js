export default function jsonErrorHandler(err, req, res, next){
    if(err.name === 'SyntaxError' && err.status === 400){
        console.error(err);
        return res.status(400).json({error: 'JSON 형식 오류'})
    }
    next(err);
}
