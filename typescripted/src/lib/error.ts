
class HttpError extends Error{
    status: number;
    message: string;
    constructor(status: number, message: string){
        super(message);
        this.status = status;
        this.message = message;
    }
}
export default HttpError


//export const error_handler = (err: unknown,req:Request, res: Response, next:NextFunction) => {

//}