import { User } from "@prisma/client";

declare global {
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
}
