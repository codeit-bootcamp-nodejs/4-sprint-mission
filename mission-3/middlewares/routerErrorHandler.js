export default function errorHandler(handler){
    return async (req, res) =>{
        try{
            await handler(req, res);
        }catch(e){
            console.error(e);
            if(e?.code === 'P2025'){
                res.status(404).json({error:'id를 찾을 수 없습니다.'})
            }else if(e?.name === 'StructError'){
                res.status(400).json({
                    error: 'Validation error',
                    message: e.message,
                });
            }else{
                res.status(500).json({error:'server error'});
            }
        }
    }
}
