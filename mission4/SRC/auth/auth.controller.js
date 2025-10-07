import { UserService } from "../user/user.service.js";
import { AuthService } from "./auth.service.js";

const authService = new AuthService()
const userService = new UserService();

export class AuthController{
    async register(req, res) {
        try {
            const {password, nickname, email} = req.body;

            const user = await userService.createUser({password, nickname, email})
            res.status(201).json(user)
        } catch (error) {
            res.status(400).json({ message: err.message });
        }

    }
    async login(req, res){
        try{
            const {password, nickname } = req.body;
            const user = await authService.validateUser({password, nickname })
            res.status(200).json(user)
        }catch (error) {
            res.status(400).json({ message: err.message });
        }     
    }
}