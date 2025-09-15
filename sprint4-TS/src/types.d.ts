interface User{
    id: number,
    password: string,
    image: string,
    email: string,
}

declare namespace Express {
    export interface Request{
        user?: User;
    }
}