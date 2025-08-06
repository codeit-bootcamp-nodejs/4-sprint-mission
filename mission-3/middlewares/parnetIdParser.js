export default function parentIdParser(req, res, next){
    req.parentId = parseInt(req.params.id);
    next();
}
