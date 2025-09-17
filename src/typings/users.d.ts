export {};
declare global {
  namespace Users {
    interface Update {
      id: number;
      updateData: {
        nickname?: string;
        password?: string;
      };
    }
    interface User {
      email: string;
      nickname: string;
      password: string;
    }
    interface Login {
      email: string;
      password: string;
    }
  }
}
