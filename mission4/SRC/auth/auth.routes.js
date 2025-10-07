import passport from "passport"
import express from"express"
import { localStrategy } from '../../lib/passport/localStrategy.js'
import { AuthController } from "./auth.controller.js";

const ac = new AuthController();
const router = express.Router();

passport.use(localStrategy)


router.post("/register", (req,res) => ac.register(req, res))

router.post("/login",
     passport.authenticate("local", { session: false }), // LocalStrategy 호출
  (req, res) => ac.login(req, res)
)
export default router