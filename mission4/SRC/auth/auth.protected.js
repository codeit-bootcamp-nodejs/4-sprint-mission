import express from 'express' 
import passport from 'passport' 
const router = express.Router() 
router.get( '/', passport.authenticate('access-token', { session: false }), (req, res) => { 
    // JWT가 유효하면 req.user에 사용자 정보가 들어옴
     res.json({ message:` Protected profile data for ${req.user.nickname}`, user: req.user });
    
});
;
export default router