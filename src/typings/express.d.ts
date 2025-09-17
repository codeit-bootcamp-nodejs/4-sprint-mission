import { User } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      user?: User | null;
    }
  }
  namespace Article {
    interface Create {
      title: string;
      content: string;
      user: User;
    }
    interface Delete {
      id: number;
      user: User;
    }
    interface Get {
      offset: number;
      limit: number;
      search: string;
      user: User;
    }
    interface Update {
      id: number;
      updateData: {
        title?: string;
        content?: string;
      };
      user: User;
    }
    interface Article {
      title: string;
      content: string;
    }
  }
  namespace Product {
    interface Create {
      data: {
        name: string;
        description: string;
        price: number;
        tags: string[];
      };
      user: User;
    }
    interface Delete {
      id: number;
      user: User;
    }
    interface Update {
      id: number;
      updateData: {
        name?: string;
        description?: string;
        price?: number;
        tags?: string[];
      };
      user: User;
    }
  }
  namespace Comment {
    interface Create {
      id: number;
      content: string;
      user: User;
    }
    interface Delete {
      commentId: number;
      user: User;
    }
    interface Get {
      id: number;
      take: number;
      cursor: number;
    }
    interface Update {
      commentId: number;
      content: string;
      user: User;
    }
    interface Comment {
      content: string;
    }
  }
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

export {};
