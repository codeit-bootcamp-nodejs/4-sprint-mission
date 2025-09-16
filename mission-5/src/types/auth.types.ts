export interface Signup {
  email: string;
  nickname: string;
  password: string;
}

export interface Login {
  received_email: string;
  received_password: string;
}
