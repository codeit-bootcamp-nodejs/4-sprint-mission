import { User } from "@prisma/client";

declare global {
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
}
