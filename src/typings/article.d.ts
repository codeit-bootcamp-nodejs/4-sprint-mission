import { User } from "@prisma/client";

declare global {
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
}
