//#region Imports
import { jest } from '@jest/globals';
import bcrypt from 'bcrypt';
//#endregion

//#region Records (Types)
export type UserRecord = {
  id: number;
  username: string;
  email: string;
  password: string;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
};

export type ArticleRecord = {
  id: number;
  title: string;
  content: string;
  userId: number;
  tags: string[];
  images: string[];
  createdAt: Date;
  updatedAt: Date;
};

export type ProductRecord = {
  id: number;
  name: string;
  description: string;
  price: number;
  userId: number;
  tags: string[];
  images: string[];
  createdAt: Date;
  updatedAt: Date;
};

export type ArticleLikeRecord = {
  id: number;
  articleId: number;
  userId: number;
};

export type ProductLikeRecord = {
  id: number;
  productId: number;
  userId: number;
};

export type CommentRecord = {
  id: number;
  content: string;
  userId: number;
  articleId?: number | null;
  productId?: number | null;
  createdAt: Date;
  updatedAt: Date;
};

export type NotificationRecord = {
  id: number;
  userId: number;
  type: 'COMMENT' | 'LIKE' | 'SYSTEM' | string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
};

type CommentLikeRecord = { id: number; commentId: number; userId: number };

type BooleanSelect<T> = Partial<Record<keyof T, boolean>>;

type UserSelect = BooleanSelect<UserRecord>;
type UserWhereUnique = { id?: number; username?: string; email?: string };

type FindUniqueUserArgs =
  | { where: UserWhereUnique; select?: undefined }
  | {
      where: UserWhereUnique;
      select: Pick<UserSelect, 'id' | 'username' | 'email' | 'password'>;
    };

type FindUniqueUserReturn<A extends FindUniqueUserArgs> = A extends {
  select: infer S;
}
  ? S extends UserSelect
    ? Pick<UserRecord, Extract<keyof S, keyof UserRecord>> | null
    : UserRecord | null
  : UserRecord | null;

type ProductSelect = BooleanSelect<ProductRecord>;
type FindUniqueProductArgs =
  | { where: { id: number }; select?: undefined }
  | {
      where: { id: number };
      select: Pick<ProductSelect, 'id' | 'userId' | 'name' | 'price'>;
    };

type FindUniqueProductReturn<A extends FindUniqueProductArgs> = A extends {
  select: infer S;
}
  ? S extends ProductSelect
    ? Pick<ProductRecord, Extract<keyof S, keyof ProductRecord>> | null
    : ProductRecord | null
  : ProductRecord | null;
//#endregion

//#region In-memory DB & Sequences
const db: {
  users: UserRecord[];
  articles: ArticleRecord[];
  products: ProductRecord[];
  comments: CommentRecord[];
  articleLikes: ArticleLikeRecord[];
  productLikes: ProductLikeRecord[];
  commentLikes: CommentLikeRecord[];
  notifications: NotificationRecord[];
} = {
  users: [],
  articles: [],
  products: [],
  comments: [],
  articleLikes: [],
  productLikes: [],
  commentLikes: [],
  notifications: [],
};

let seq = {
  user: 1,
  article: 1,
  product: 1,
  cmt: 1,
  aLike: 1,
  pLike: 1,
  cLike: 1,
  notif: 1,
};
//#endregion

//#region Utils (helpers)
function pickUserBy(where: UserWhereUnique): UserRecord | undefined {
  const { id, username, email } = where;
  return db.users.find(
    (u) =>
      (id !== undefined && u.id === id) ||
      (username !== undefined && u.username === username) ||
      (email !== undefined && u.email === email)
  );
}

function ensureArticleArrays<
  T extends {
    tags?: unknown;
    images?: unknown;
    comments?: unknown;
    likes?: unknown;
  }
>(a: T) {
  return {
    ...a,
    tags: Array.isArray(a.tags) ? a.tags : [],
    images: Array.isArray(a.images) ? a.images : [],
    comments: Array.isArray(a.comments) ? a.comments : [],
    likes: Array.isArray(a.likes) ? a.likes : [],
  };
}
function ensureProductArrays<
  T extends {
    tags?: unknown;
    images?: unknown;
    comments?: unknown;
    likes?: unknown;
  }
>(p: T) {
  return {
    ...p,
    tags: Array.isArray(p.tags) ? p.tags : [],
    images: Array.isArray(p.images) ? p.images : [],
    comments: Array.isArray(p.comments) ? p.comments : [],
    likes: Array.isArray(p.likes) ? p.likes : [],
  };
}

function isNumArray(x: unknown): x is number[] {
  return (
    Array.isArray(x) &&
    x.every((n) => typeof n === 'number' && Number.isFinite(n))
  );
}

function wantsCount(v: unknown, key: string): boolean {
  if (typeof v !== 'object' || v === null) return false;
  const obj = v as Record<string, unknown>;
  return obj._all === true || obj[key] === true;
}

type InsensitiveMode = 'insensitive' | 'default';

function matchesArticleWhere(
  a: ArticleRecord,
  where?: {
    OR?: Array<
      | { title?: { contains?: string; mode?: InsensitiveMode } }
      | { content?: { contains?: string; mode?: InsensitiveMode } }
    >;
  }
): boolean {
  if (!where?.OR || where.OR.length === 0) return true;
  return where.OR.some((cond) => {
    if ('title' in cond && cond.title?.contains != null) {
      const q = cond.title.contains!;
      return cond.title.mode === 'insensitive'
        ? a.title.toLowerCase().includes(q.toLowerCase())
        : a.title.includes(q);
    }
    if ('content' in cond && cond.content?.contains != null) {
      const q = cond.content.contains!;
      return cond.content.mode === 'insensitive'
        ? a.content.toLowerCase().includes(q.toLowerCase())
        : a.content.includes(q);
    }
    return false;
  });
}

function matchesProductWhere(
  p: ProductRecord,
  where?: {
    OR?: Array<
      | { name?: { contains?: string; mode?: InsensitiveMode } }
      | { description?: { contains?: string; mode?: InsensitiveMode } }
    >;
  }
): boolean {
  if (!where?.OR || where.OR.length === 0) return true;
  return where.OR.some((cond) => {
    if ('name' in cond && cond.name?.contains != null) {
      const q = cond.name.contains!;
      return cond.name.mode === 'insensitive'
        ? p.name.toLowerCase().includes(q.toLowerCase())
        : p.name.includes(q);
    }
    if ('description' in cond && cond.description?.contains != null) {
      const q = cond.description.contains!;
      return cond.description.mode === 'insensitive'
        ? p.description.toLowerCase().includes(q.toLowerCase())
        : p.description.includes(q);
    }
    return false;
  });
}

/** 키쌍(where: userId_articleId | articleId_userId) 타입 생성기 */
type PairKey<T1 extends string, T2 extends string> =
  | { [K in `${T1}_${T2}`]: { [P in T1 | T2]: number } }[`${T1}_${T2}`]
  | { [K in `${T2}_${T1}`]: { [P in T1 | T2]: number } }[`${T2}_${T1}`];

function pickArticleLikeKey(where: PairKey<'userId', 'articleId'>): {
  userId: number;
  articleId: number;
} {
  const a =
    (where as unknown as Record<string, { userId: number; articleId: number }>)[
      'userId_articleId'
    ] ??
    (where as unknown as Record<string, { userId: number; articleId: number }>)[
      'articleId_userId'
    ];
  if (!a)
    throw new Error(
      'articleLike.where needs userId_articleId or articleId_userId'
    );
  return { userId: Number(a.userId), articleId: Number(a.articleId) };
}

function pickProductLikeKey(where: PairKey<'userId', 'productId'>): {
  userId: number;
  productId: number;
} {
  const a =
    (where as unknown as Record<string, { userId: number; productId: number }>)[
      'userId_productId'
    ] ??
    (where as unknown as Record<string, { userId: number; productId: number }>)[
      'productId_userId'
    ];
  if (!a)
    throw new Error(
      'productLike.where needs userId_productId or productId_userId'
    );
  return { userId: Number(a.userId), productId: Number(a.productId) };
}

/* ---- like matchers ---- */
type ArticleLikeWhere =
  | { articleId: number; userId?: number }
  | { articleId: { in: number[] }; userId?: number };
type ProductLikeWhere =
  | { productId: number; userId?: number }
  | { productId: { in: number[] }; userId?: number };
type CommentLikeWhere =
  | { commentId: number; userId?: number }
  | { commentId: { in: number[] }; userId?: number };

function matchArticleLike(
  where: ArticleLikeWhere,
  rec: ArticleLikeRecord
): boolean {
  const idOk =
    typeof (where as { articleId: number }).articleId === 'number'
      ? rec.articleId === (where as { articleId: number }).articleId
      : (where as { articleId: { in: number[] } }).articleId.in.includes(
          rec.articleId
        );
  const userOk =
    (where as { userId?: number }).userId === undefined ||
    rec.userId === (where as { userId?: number }).userId;
  return idOk && userOk;
}

function matchProductLike(
  where: ProductLikeWhere,
  rec: ProductLikeRecord
): boolean {
  const idOk =
    typeof (where as { productId: number }).productId === 'number'
      ? rec.productId === (where as { productId: number }).productId
      : (where as { productId: { in: number[] } }).productId.in.includes(
          rec.productId
        );
  const userOk =
    (where as { userId?: number }).userId === undefined ||
    rec.userId === (where as { userId?: number }).userId;
  return idOk && userOk;
}

function matchCommentLike(
  where: CommentLikeWhere,
  rec: CommentLikeRecord
): boolean {
  const idOk =
    typeof (where as { commentId: number }).commentId === 'number'
      ? rec.commentId === (where as { commentId: number }).commentId
      : (where as { commentId: { in: number[] } }).commentId.in.includes(
          rec.commentId
        );

  const userOk =
    (where as { userId?: number }).userId === undefined ||
    rec.userId === (where as { userId?: number }).userId;

  return idOk && userOk;
}
//#endregion

//#region Query arg helper types
type OrderDir = 'asc' | 'desc';

type ProductWhereOr = {
  OR?: Array<
    | { name?: { contains?: string; mode?: InsensitiveMode } }
    | { description?: { contains?: string; mode?: InsensitiveMode } }
  >;
};
type FindManyProductArgs = { where?: ProductWhereOr };

type CommentLikeOrderBy = { id?: OrderDir };

type CommentIncludeArticle =
  | boolean
  | { select?: Partial<Record<keyof ArticleRecord, boolean>> };
type CommentIncludeProduct =
  | boolean
  | { select?: Partial<Record<keyof ProductRecord, boolean>> };

type CommentInclude =
  | boolean
  | {
      select?: Partial<Record<keyof CommentRecord, boolean>> & {
        article?: CommentIncludeArticle;
        product?: CommentIncludeProduct;
      };
      include?: {
        article?: CommentIncludeArticle;
        product?: CommentIncludeProduct;
      };
    };

type FindManyCommentLikeArgs = {
  where?: {
    userId?: number;
    commentId?: number | { in?: number[] };
  };
  orderBy?: CommentLikeOrderBy;
  skip?: number;
  take?: number;
  include?: { comment?: CommentInclude };
};

type GroupByCountOpt<K extends string> = {
  _count?: { _all?: true } & Partial<Record<K, true>>;
};
type ArticleLikeGroupByArgs = {
  by?: string[];
  where?: { articleId?: { in?: number[] } };
} & GroupByCountOpt<'articleId'>;
type ProductLikeGroupByArgs = {
  by?: string[];
  where?: { productId?: { in?: number[] } };
} & GroupByCountOpt<'productId'>;
type CommentLikeGroupByArgs = {
  by?: string[];
  where?: { commentId?: { in?: number[] } };
} & GroupByCountOpt<'commentId'>;
//#endregion

//#region Prisma Mock Root
export const prisma = {
  //#region prisma.user
  user: {
    create: jest.fn(
      async (args: {
        data: Omit<UserRecord, 'id' | 'createdAt' | 'updatedAt'>;
      }) => {
        const now = new Date();
        const { images: imagesIn, ...rest } = args.data;
        const rec: UserRecord = {
          id: seq.user++,
          createdAt: now,
          updatedAt: now,
          ...rest,
          images: imagesIn ?? [],
        };
        db.users.push(rec);
        return { ...rec };
      }
    ),

    findUnique: jest.fn(
      async <A extends FindUniqueUserArgs>(
        args: A
      ): Promise<FindUniqueUserReturn<A>> => {
        const found = pickUserBy(args.where);
        if (!found) return null as FindUniqueUserReturn<A>;
        if (!('select' in args) || !args.select)
          return { ...found } as FindUniqueUserReturn<A>;

        const sel = args.select as UserSelect;
        const pickedEntries = Object.keys(sel)
          .filter((k) => sel[k as keyof UserSelect])
          .map((k) => [k, found[k as keyof UserRecord]] as const);
        const picked = Object.fromEntries(pickedEntries) as Pick<
          UserRecord,
          Extract<keyof typeof sel, keyof UserRecord>
        >;
        return picked as FindUniqueUserReturn<A>;
      }
    ),

    update: jest.fn(
      async (args: {
        where: { id: number };
        data: Partial<Omit<UserRecord, 'id'>>;
      }) => {
        const target = db.users.find((u) => u.id === args.where.id);
        if (!target) {
          const e = new Error('Not found') as Error & { code: string };
          e.code = 'P2025';
          throw e;
        }
        Object.assign(target, args.data, { updatedAt: new Date() });
        return { ...target };
      }
    ),
  },
  //#endregion

  //#region prisma.article
  article: {
    findMany: jest.fn(
      async (args?: {
        where?: {
          OR?: Array<
            | {
                title?: { contains?: string; mode?: 'insensitive' | 'default' };
              }
            | {
                content?: {
                  contains?: string;
                  mode?: 'insensitive' | 'default';
                };
              }
          >;
        };
        orderBy?: { createdAt?: 'asc' | 'desc'; id?: 'asc' | 'desc' };
        skip?: number;
        take?: number;
      }) => {
        let list = db.articles.filter((a) =>
          matchesArticleWhere(a, args?.where)
        );
        if (args?.orderBy?.createdAt || args?.orderBy?.id) {
          const dirCreated = args?.orderBy?.createdAt === 'asc' ? 1 : -1;
          const dirId = args?.orderBy?.id === 'asc' ? 1 : -1;
          list.sort((a, b) => {
            if (args?.orderBy?.createdAt) {
              const diff =
                (a.createdAt.getTime() - b.createdAt.getTime()) * dirCreated;
              if (diff !== 0) return diff;
            }
            if (args?.orderBy?.id) {
              return (a.id - b.id) * dirId;
            }
            return 0;
          });
        }
        const start = args?.skip ?? 0;
        const end = args?.take != null ? start + args.take : undefined;
        const sliced = list.slice(start, end);

        return sliced.map((a) => ensureArticleArrays({ ...a }));
      }
    ),

    findUnique: jest.fn(async (args: { where: { id: number } }) => {
      const f = db.articles.find((a) => a.id === args.where.id);
      return f ? ensureArticleArrays({ ...f }) : null;
    }),

    count: jest.fn(
      async (args?: {
        where?: {
          OR?: Array<
            | {
                title?: { contains?: string; mode?: InsensitiveMode };
              }
            | {
                content?: {
                  contains?: string;
                  mode?: InsensitiveMode;
                };
              }
          >;
        };
      }) =>
        db.articles.filter((a) => matchesArticleWhere(a, args?.where)).length
    ),
    create: jest.fn(
      async (args: {
        data: Omit<ArticleRecord, 'id' | 'createdAt' | 'updatedAt'>;
      }) => {
        const now = new Date();
        const rec: ArticleRecord = {
          id: seq.article++,
          title: args.data.title,
          content: args.data.content ?? '',
          userId: args.data.userId,
          tags: Array.isArray(args.data.tags) ? args.data.tags : [],
          images: Array.isArray(args.data.images) ? args.data.images : [],
          createdAt: now,
          updatedAt: now,
        };
        db.articles.push(rec);
        return { ...rec };
      }
    ),

    update: jest.fn(
      async (args: {
        where: { id: number };
        data: Partial<Omit<ArticleRecord, 'id'>>;
      }) => {
        const target = db.articles.find((p) => p.id === args.where.id);
        if (!target) {
          const e = new Error('Not found') as Error & { code: string };
          e.code = 'P2025';
          throw e;
        }
        Object.assign(target, {
          ...args.data,
          tags: args.data.tags ?? target.tags,
          images: args.data.images ?? target.images,
          updatedAt: new Date(),
        });
        return { ...target };
      }
    ),

    delete: jest.fn(async (args: { where: { id: number } }) => {
      const idx = db.articles.findIndex((a) => a.id === args.where.id);
      if (idx === -1) {
        const e = new Error('Not found') as Error & { code: string };
        e.code = 'P2025';
        throw e;
      }
      const [removed] = db.articles.splice(idx, 1);
      return { ...removed };
    }),

    deleteMany: jest.fn(async (args?: { where?: { id?: number } }) => {
      const before = db.articles.length;
      if (!args?.where || args.where.id == null) {
        db.articles = [];
      } else {
        const id = args.where.id;
        db.articles = db.articles.filter((a) => a.id !== id);
      }
      const after = db.articles.length;
      return { count: before - after };
    }),
  },
  //#endregion

  //#region prisma.product
  product: {
    findMany: jest.fn(async (args?: FindManyProductArgs) => {
      const list = db.products.filter((p) =>
        matchesProductWhere(p, args?.where)
      );
      return list.map((p) => ensureProductArrays({ ...p }));
    }),

    findUnique: jest.fn(
      async <A extends FindUniqueProductArgs>(
        args: A
      ): Promise<FindUniqueProductReturn<A>> => {
        const f = db.products.find((p) => p.id === args.where.id);
        if (!f) return null as FindUniqueProductReturn<A>;

        if (!('select' in args) || !args.select) {
          return ensureProductArrays({
            ...f,
          }) as unknown as FindUniqueProductReturn<A>;
        }

        const sel = args.select as ProductSelect;
        const pickedEntries = Object.keys(sel)
          .filter((k) => sel[k as keyof ProductSelect])
          .map(
            (k) =>
              [k, f[k as keyof ProductRecord]] as [
                keyof ProductRecord | string,
                unknown
              ]
          );
        const picked = Object.fromEntries(pickedEntries) as Pick<
          ProductRecord,
          Extract<keyof typeof sel, keyof ProductRecord>
        >;
        return picked as FindUniqueProductReturn<A>;
      }
    ),

    count: jest.fn(
      async (args?: {
        where?: {
          OR?: Array<
            | {
                name?: {
                  contains?: string;
                  mode?: InsensitiveMode;
                };
              }
            | {
                description?: {
                  contains?: string;
                  mode?: InsensitiveMode;
                };
              }
          >;
        };
      }) =>
        db.products.filter((p) => matchesProductWhere(p, args?.where)).length
    ),

    create: jest.fn(
      async (args: {
        data: Omit<ProductRecord, 'id' | 'createdAt' | 'updatedAt'>;
      }) => {
        const now = new Date();
        const rec: ProductRecord = {
          id: seq.product++,
          name: args.data.name,
          description: args.data.description,
          price: args.data.price ?? 0,
          userId: args.data.userId,
          tags: Array.isArray(args.data.tags) ? args.data.tags : [],
          images: Array.isArray(args.data.images) ? args.data.images : [],
          createdAt: now,
          updatedAt: now,
        };
        db.products.push(rec);
        return { ...rec };
      }
    ),

    update: jest.fn(
      async (args: {
        where: { id: number };
        data: Partial<Omit<ProductRecord, 'id'>>;
      }) => {
        const target = db.products.find((p) => p.id === args.where.id);
        if (!target) {
          const e = new Error('Not found') as Error & { code: string };
          e.code = 'P2025';
          throw e;
        }
        Object.assign(target, {
          ...args.data,
          tags: args.data.tags ?? target.tags,
          images: args.data.images ?? target.images,
          updatedAt: new Date(),
        });
        return { ...target };
      }
    ),

    delete: jest.fn(async (args: { where: { id: number } }) => {
      const idx = db.products.findIndex((p) => p.id === args.where.id);
      if (idx === -1) {
        const e = new Error('Not found') as Error & { code: string };
        e.code = 'P2025';
        throw e;
      }
      const [removed] = db.products.splice(idx, 1);
      return { ...removed };
    }),

    deleteMany: jest.fn(async (args?: { where?: { id?: number } }) => {
      const before = db.products.length;
      if (!args?.where || args.where.id == null) {
        db.products = [];
      } else {
        const id = args.where.id;
        db.products = db.products.filter((p) => p.id !== id);
      }
      const after = db.products.length;
      return { count: before - after };
    }),
  },
  //#endregion

  //#region prisma.comment
  comment: {
    findUnique: jest.fn(async (args: { where: { id: number } }) => {
      const f = db.comments.find((c) => c.id === args.where.id);
      return f ? { ...f } : null;
    }),

    findMany: jest.fn(
      async (args?: {
        where?: {
          id?: number | { in?: number[] };
          articleId?: number | null;
          productId?: number | null;
          userId?: number;
        };
        orderBy?: { createdAt?: OrderDir };
        skip?: number;
        take?: number;
      }) => {
        let list = db.comments.slice();

        if (args?.where?.id !== undefined) {
          const idCond = args.where.id as number | { in?: number[] };
          if (typeof idCond === 'number') {
            list = list.filter((c) => c.id === idCond);
          } else if (idCond && Array.isArray(idCond.in)) {
            list = list.filter((c) => idCond.in!.includes(c.id));
          }
        }

        if (args?.where?.articleId !== undefined) {
          list = list.filter((c) => c.articleId === args.where!.articleId);
        }
        if (args?.where?.productId !== undefined) {
          list = list.filter((c) => c.productId === args.where!.productId);
        }
        if (args?.where?.userId !== undefined) {
          list = list.filter((c) => c.userId === args.where!.userId);
        }

        if (args?.orderBy?.createdAt) {
          const dir = args.orderBy.createdAt === 'asc' ? 1 : -1;
          list.sort(
            (a, b) => (a.createdAt.getTime() - b.createdAt.getTime()) * dir
          );
        }

        const start = args?.skip ?? 0;
        const end = args?.take != null ? start + args.take : undefined;
        return list.slice(start, end).map((c) => ({ ...c }));
      }
    ),

    create: jest.fn(
      async (args: {
        data: Omit<CommentRecord, 'id' | 'createdAt' | 'updatedAt'> &
          Partial<Pick<CommentRecord, 'id'>>;
      }) => {
        const hasArticle = typeof args.data.articleId === 'number';
        const hasProduct = typeof args.data.productId === 'number';
        if (hasArticle === hasProduct) {
          const e = new Error(
            'Exactly one of articleId/productId required'
          ) as Error & { code: string };
          e.code = 'VALIDATION';
          throw e;
        }

        const now = new Date();
        const rec: CommentRecord = {
          id: args.data.id ?? seq.cmt++,
          content: args.data.content ?? '',
          userId: args.data.userId,
          articleId: hasArticle ? args.data.articleId! : null,
          productId: hasProduct ? args.data.productId! : null,
          createdAt: now,
          updatedAt: now,
        };
        db.comments.push(rec);
        return { ...rec };
      }
    ),

    update: jest.fn(
      async (args: {
        where: { id: number };
        data: Partial<Omit<CommentRecord, 'id'>>;
      }) => {
        const t = db.comments.find((c) => c.id === args.where.id);
        if (!t) {
          const e = new Error('Not found') as Error & { code: string };
          e.code = 'P2025';
          throw e;
        }
        Object.assign(t, { ...args.data, updatedAt: new Date() });
        return { ...t };
      }
    ),

    delete: jest.fn(async (args: { where: { id: number } }) => {
      const idx = db.comments.findIndex((c) => c.id === args.where.id);
      if (idx < 0) {
        const e = new Error('Not found') as Error & { code: string };
        e.code = 'P2025';
        throw e;
      }
      const [removed] = db.comments.splice(idx, 1);
      return { ...removed };
    }),
  },
  //#endregion

  //#region prisma.articleLike
  articleLike: {
    findUnique: jest.fn(
      async ({ where }: { where: PairKey<'userId', 'articleId'> }) => {
        const { userId, articleId } = pickArticleLikeKey(where);
        return (
          db.articleLikes.find(
            (l) => l.userId === userId && l.articleId === articleId
          ) ?? null
        );
      }
    ),

    create: jest.fn(
      async ({ data }: { data: { userId: number; articleId: number } }) => {
        const userId = Number(data.userId);
        const articleId = Number(data.articleId);
        const exists = db.articleLikes.some(
          (l) => l.userId === userId && l.articleId === articleId
        );
        if (exists) {
          const e = new Error('Unique constraint failed') as Error & {
            code: string;
          };
          e.code = 'P2002';
          throw e;
        }
        const row: ArticleLikeRecord = { id: seq.aLike++, userId, articleId };
        db.articleLikes.push(row);
        return { ...row };
      }
    ),

    delete: jest.fn(
      async ({ where }: { where: PairKey<'userId', 'articleId'> }) => {
        const { userId, articleId } = pickArticleLikeKey(where);
        const idx = db.articleLikes.findIndex(
          (l) => l.userId === userId && l.articleId === articleId
        );
        if (idx < 0) {
          const e = new Error('Not found') as Error & { code: string };
          e.code = 'P2025';
          throw e;
        }
        const [removed] = db.articleLikes.splice(idx, 1);
        return { ...removed };
      }
    ),

    count: jest.fn(
      async (args: { where: ArticleLikeWhere }) =>
        db.articleLikes.filter((l) => matchArticleLike(args.where, l)).length
    ),

    groupBy: jest.fn(async (args: ArticleLikeGroupByArgs) => {
      const rawIds = args?.where?.articleId?.in ?? [];
      const ids = isNumArray(rawIds) ? rawIds : [];
      return ids.map((id) => {
        const c = db.articleLikes.filter((l) => l.articleId === id).length;
        return wantsCount(args?._count, 'articleId')
          ? { articleId: id, _count: { articleId: c } }
          : { articleId: id };
      });
    }),
  },
  //#endregion

  //#region prisma.productLike
  productLike: {
    findUnique: jest.fn(
      async ({ where }: { where: PairKey<'userId', 'productId'> }) => {
        const { userId, productId } = pickProductLikeKey(where);
        return (
          db.productLikes.find(
            (l) => l.userId === userId && l.productId === productId
          ) ?? null
        );
      }
    ),

    create: jest.fn(
      async ({ data }: { data: { userId: number; productId: number } }) => {
        const userId = Number(data.userId);
        const productId = Number(data.productId);
        const exists = db.productLikes.some(
          (l) => l.userId === userId && l.productId === productId
        );
        if (exists) {
          const e = new Error('Unique constraint failed') as Error & {
            code: string;
          };
          e.code = 'P2002';
          throw e;
        }
        const row: ProductLikeRecord = { id: seq.pLike++, userId, productId };
        db.productLikes.push(row);
        return { ...row };
      }
    ),

    delete: jest.fn(
      async ({ where }: { where: PairKey<'userId', 'productId'> }) => {
        const { userId, productId } = pickProductLikeKey(where);
        const idx = db.productLikes.findIndex(
          (l) => l.userId === userId && l.productId === productId
        );
        if (idx < 0) {
          const e = new Error('Not found') as Error & { code: string };
          e.code = 'P2025';
          throw e;
        }
        const [removed] = db.productLikes.splice(idx, 1);
        return { ...removed };
      }
    ),

    count: jest.fn(
      async (args: { where: ProductLikeWhere }) =>
        db.productLikes.filter((l) => matchProductLike(args.where, l)).length
    ),

    groupBy: jest.fn(async (args: ProductLikeGroupByArgs) => {
      const rawIds = args?.where?.productId?.in ?? [];
      const ids = isNumArray(rawIds) ? rawIds : [];
      return ids.map((id) => {
        const c = db.productLikes.filter((l) => l.productId === id).length;
        return wantsCount(args?._count, 'productId')
          ? { productId: id, _count: { productId: c } }
          : { productId: id };
      });
    }),
  },
  //#endregion

  //#region prisma.commentLike
  commentLike: {
    findUnique: jest.fn(
      async (args: {
        where: { userId_commentId: { userId: number; commentId: number } };
      }) => {
        const { userId, commentId } = args.where.userId_commentId;
        return (
          db.commentLikes.find(
            (l) => l.userId === userId && l.commentId === commentId
          ) ?? null
        );
      }
    ),

    findMany: jest.fn(async (args?: FindManyCommentLikeArgs) => {
      let list = db.commentLikes.slice();

      if (args?.where) {
        const w = args.where;
        const hasCommentIdCond =
          typeof w.commentId === 'number' ||
          (w.commentId && Array.isArray((w.commentId as { in?: number[] }).in));

        if (hasCommentIdCond) {
          let cond: CommentLikeWhere =
            typeof w.commentId === 'number'
              ? { commentId: w.commentId }
              : {
                  commentId: {
                    in: (w.commentId as { in?: number[] }).in ?? [],
                  },
                };

          if (typeof w.userId === 'number') {
            cond = { ...cond, userId: w.userId };
          }

          list = list.filter((rec) => matchCommentLike(cond, rec));
        }

        if (typeof w.userId === 'number') {
          list = list.filter((rec) => rec.userId === w.userId);
        }
      }

      if (args?.orderBy?.id) {
        const dir = args.orderBy.id === 'asc' ? 1 : -1;
        list.sort((a, b) => (a.id - b.id) * dir);
      }

      const start = args?.skip ?? 0;
      const end = args?.take != null ? start + args.take : undefined;
      const sliced = list.slice(start, end);

      // ---------- include.comment 처리 ----------
      const commentArg = args?.include?.comment;
      if (!commentArg) return sliced.map((x) => ({ ...x }));

      // 선택/포함 타입 정의
      type ArticleSelect = Partial<Record<keyof ArticleRecord, boolean>>;
      type ProductSelect = Partial<Record<keyof ProductRecord, boolean>>;
      type CommentBaseSelect = Partial<Record<keyof CommentRecord, boolean>>;

      interface CommentSelectShape {
        select: CommentBaseSelect & {
          article?: { select?: ArticleSelect };
          product?: { select?: ProductSelect };
        };
      }
      interface CommentIncludeShape {
        include?: {
          article?: { select?: ArticleSelect };
          product?: { select?: ProductSelect };
        };
      }

      // 타입 가드
      const hasSelect = (v: unknown): v is CommentSelectShape =>
        typeof v === 'object' &&
        v !== null &&
        'select' in (v as Record<string, unknown>);

      const hasInclude = (v: unknown): v is CommentIncludeShape =>
        typeof v === 'object' &&
        v !== null &&
        'include' in (v as Record<string, unknown>);

      const isSelect = hasSelect(commentArg);
      const sel = isSelect ? commentArg.select : undefined;

      // 안전한 pick 유틸
      const pick = <T extends Record<string, unknown>>(
        obj: T | null,
        keys?: Partial<Record<keyof T, boolean>>
      ): T | null => {
        if (!obj) return null;
        if (!keys) return { ...obj };
        const out = {} as T;
        (Object.keys(keys) as Array<keyof T>).forEach((k) => {
          if (keys[k]) {
            out[k] = obj[k];
          }
        });
        return out;
      };

      // include 모드에서 article/product 포함 여부
      const wantArticle =
        !isSelect && hasInclude(commentArg) && !!commentArg.include?.article;
      const wantProduct =
        !isSelect && hasInclude(commentArg) && !!commentArg.include?.product;

      type CommentWithIncludes = CommentRecord & {
        article?: ArticleRecord | null;
        product?: ProductRecord | null;
      };

      return sliced.map((like) => {
        const c = db.comments.find((x) => x.id === like.commentId) || null;

        // include 모드 (select 아님)
        if (!isSelect) {
          let comment: CommentWithIncludes | null = c ? { ...c } : null;

          if (comment && wantArticle) {
            comment.article =
              c!.articleId != null
                ? db.articles.find((a) => a.id === c!.articleId) || null
                : null;
          }
          if (comment && wantProduct) {
            comment.product =
              c!.productId != null
                ? db.products.find((p) => p.id === c!.productId) || null
                : null;
          }

          return { ...like, comment };
        }

        // select 모드
        const commentSelected = pick(c, sel as CommentBaseSelect);

        // article select
        if (sel?.article) {
          const art =
            c && c.articleId != null
              ? db.articles.find((a) => a.id === c.articleId) || null
              : null;

          (commentSelected as Record<string, unknown>)['article'] = sel.article
            .select
            ? pick(art, sel.article.select)
            : art;
        }

        // product select
        if (sel?.product) {
          const prod =
            c && c.productId != null
              ? db.products.find((p) => p.id === c.productId) || null
              : null;

          (commentSelected as Record<string, unknown>)['product'] = sel.product
            .select
            ? pick(prod, sel.product.select)
            : prod;
        }

        return { ...like, comment: commentSelected };
      });
    }),

    create: jest.fn(
      async (args: { data: { userId: number; commentId: number } }) => {
        const { userId, commentId } = args.data;
        const exists = db.commentLikes.some(
          (l) => l.userId === userId && l.commentId === commentId
        );
        if (exists) {
          const e = new Error('Unique constraint failed') as Error & {
            code: string;
          };
          e.code = 'P2002';
          throw e;
        }
        const row: CommentLikeRecord = { id: seq.cLike++, userId, commentId };
        db.commentLikes.push(row);
        return { ...row };
      }
    ),

    delete: jest.fn(
      async (args: {
        where: { userId_commentId: { userId: number; commentId: number } };
      }) => {
        const { userId, commentId } = args.where.userId_commentId;
        const idx = db.commentLikes.findIndex(
          (l) => l.userId === userId && l.commentId === commentId
        );
        if (idx < 0) {
          const e = new Error('Not found') as Error & { code: string };
          e.code = 'P2025';
          throw e;
        }
        const [removed] = db.commentLikes.splice(idx, 1);
        return { ...removed };
      }
    ),

    count: jest.fn(
      async (args: { where: CommentLikeWhere }) =>
        db.commentLikes.filter((l) => matchCommentLike(args.where, l)).length
    ),

    groupBy: jest.fn(async (args: CommentLikeGroupByArgs) => {
      const rawIds = args?.where?.commentId?.in ?? [];
      const ids = isNumArray(rawIds) ? rawIds : [];
      return ids.map((id) => {
        const c = db.commentLikes.filter((l) => l.commentId === id).length;
        return wantsCount(args?._count, 'commentId')
          ? { commentId: id, _count: { commentId: c } }
          : { commentId: id };
      });
    }),
  },
  //#endregion

  //#region prisma.notification
  notification: {
    findMany: jest.fn(
      async (args?: {
        where?: { userId?: number; isRead?: boolean };
        orderBy?: { createdAt?: OrderDir };
        skip?: number;
        take?: number;
      }) => {
        let list = db.notifications.slice();

        if (args?.where?.userId !== undefined) {
          list = list.filter((n) => n.userId === args.where!.userId);
        }
        if (args?.where?.isRead !== undefined) {
          list = list.filter((n) => n.isRead === args.where!.isRead);
        }

        if (args?.orderBy?.createdAt) {
          const dir = args.orderBy.createdAt === 'asc' ? 1 : -1;
          list.sort(
            (a, b) => (a.createdAt.getTime() - b.createdAt.getTime()) * dir
          );
        }

        const start = args?.skip ?? 0;
        const end = args?.take != null ? start + args.take : undefined;
        return list.slice(start, end).map((n) => ({ ...n }));
      }
    ),

    count: jest.fn(
      async (args?: { where?: { userId?: number; isRead?: boolean } }) => {
        return db.notifications.filter((n) => {
          if (
            args?.where?.userId !== undefined &&
            n.userId !== args.where!.userId
          )
            return false;
          if (
            args?.where?.isRead !== undefined &&
            n.isRead !== args.where!.isRead
          )
            return false;
          return true;
        }).length;
      }
    ),

    updateMany: jest.fn(
      async (args: {
        where?: { userId?: number; isRead?: boolean };
        data: Partial<Pick<NotificationRecord, 'isRead' | 'message' | 'type'>>;
      }) => {
        let count = 0;
        for (const n of db.notifications) {
          const userOk =
            args.where?.userId === undefined || n.userId === args.where!.userId;
          const readOk =
            args.where?.isRead === undefined || n.isRead === args.where!.isRead;
          if (userOk && readOk) {
            Object.assign(n, args.data, { updatedAt: new Date() });
            count++;
          }
        }
        return { count };
      }
    ),

    update: jest.fn(
      async (args: {
        where: { id: number };
        data: Partial<Pick<NotificationRecord, 'isRead' | 'message' | 'type'>>;
      }) => {
        const target = db.notifications.find((n) => n.id === args.where.id);
        if (!target) {
          const e = new Error('Not found') as Error & { code: string };
          e.code = 'P2025';
          throw e;
        }
        Object.assign(target, args.data, { updatedAt: new Date() });
        return { ...target };
      }
    ),

    create: jest.fn(
      async (args: {
        data: Omit<NotificationRecord, 'id' | 'createdAt' | 'updatedAt'>;
      }) => {
        const now = new Date();
        const rec: NotificationRecord = {
          id: seq.notif++,
          createdAt: now,
          updatedAt: now,
          ...args.data,
        };
        db.notifications.push(rec);
        return { ...rec };
      }
    ),

    findUnique: jest.fn(async (args: { where: { id: number } }) => {
      const n = db.notifications.find((x) => x.id === args.where.id);
      return n ? { ...n } : null;
    }),
  },
  //#endregion
};
//#endregion

//#region Prisma Mock: $transaction & default export
type PrismaLike = typeof prisma & {
  $transaction: jest.MockedFunction<(arg: unknown) => Promise<unknown>>;
};

(prisma as PrismaLike).$transaction = jest.fn(async (arg: unknown) => {
  if (Array.isArray(arg)) return Promise.all(arg as unknown[]);
  if (typeof arg === 'function')
    return (arg as (tx: typeof prisma) => unknown)(prisma);
  return arg;
});

export default prisma;
//#endregion

//#region Test Helpers (reset & seeders)
export function prismaReset(): void {
  db.users = [];
  db.articles = [];
  db.products = [];
  db.comments = [];
  db.articleLikes = [];
  db.productLikes = [];
  db.commentLikes = [];
  db.notifications = [];
  seq = {
    user: 1,
    article: 1,
    product: 1,
    cmt: 1,
    aLike: 1,
    pLike: 1,
    cLike: 1,
    notif: 1,
  };

  prisma.user.create.mockClear();
  prisma.user.findUnique.mockClear();
  prisma.user.update.mockClear();

  prisma.article.findMany.mockClear();
  prisma.article.findUnique.mockClear();
  prisma.article.count.mockClear();
  prisma.article.create.mockClear();
  prisma.article.update.mockClear();
  prisma.article.delete.mockClear();
  prisma.article.deleteMany.mockClear();

  prisma.product.findMany.mockClear();
  prisma.product.findUnique.mockClear();
  prisma.product.count.mockClear();
  prisma.product.create.mockClear();
  prisma.product.update.mockClear();
  prisma.product.delete.mockClear();
  prisma.product.deleteMany.mockClear();

  prisma.comment.findMany.mockClear();
  prisma.comment.findUnique.mockClear();
  prisma.comment.create.mockClear();
  prisma.comment.update.mockClear();
  prisma.comment.delete.mockClear();

  prisma.articleLike.count.mockClear();
  prisma.articleLike.groupBy.mockClear();
  prisma.productLike.count.mockClear();
  prisma.productLike.groupBy.mockClear();
  prisma.commentLike.count.mockClear();
  prisma.commentLike.groupBy.mockClear();

  prisma.notification.findMany.mockClear();
  prisma.notification.count.mockClear();
  prisma.notification.updateMany.mockClear();
  prisma.notification.update.mockClear();
  prisma.notification.create.mockClear();
  prisma.notification.findUnique.mockClear();

  (prisma as PrismaLike).$transaction.mockClear();
}

export function seedUsers(
  list: Array<
    Pick<UserRecord, 'id' | 'username' | 'email' | 'password'> &
      Partial<Pick<UserRecord, 'images' | 'createdAt' | 'updatedAt'>>
  >
): void {
  for (const u of list) {
    db.users.push({
      id: u.id,
      username: u.username,
      email: u.email,
      password: u.password,
      images: u.images ?? [],
      createdAt: u.createdAt ?? new Date(),
      updatedAt: u.updatedAt ?? new Date(),
    });
  }
}

export async function seedUsersWithHash(
  list: Array<
    Pick<UserRecord, 'id' | 'username' | 'email' | 'password'> &
      Partial<Pick<UserRecord, 'images' | 'createdAt' | 'updatedAt'>>
  >,
  opts: { saltRounds?: number } = {}
): Promise<void> {
  const saltRounds = opts.saltRounds ?? 10;

  for (const u of list) {
    const hashed = await bcrypt.hash(u.password, saltRounds);
    db.users.push({
      id: u.id,
      username: u.username,
      email: u.email,
      password: hashed,
      images: u.images ?? [],
      createdAt: u.createdAt ?? new Date(),
      updatedAt: u.updatedAt ?? new Date(),
    });
  }
}

export function seedArticles(
  list: Array<
    Pick<ArticleRecord, 'id' | 'title' | 'userId'> & Partial<ArticleRecord>
  >
): void {
  for (const a of list) {
    db.articles.push({
      id: a.id,
      title: a.title,
      content: a.content ?? '',
      userId: a.userId,
      tags: a.tags ?? [],
      images: a.images ?? [],
      createdAt: a.createdAt ?? new Date(),
      updatedAt: a.updatedAt ?? new Date(),
    });
  }
}

export function seedProducts(
  list: Array<
    Pick<ProductRecord, 'id' | 'name' | 'userId' | 'price'> &
      Partial<ProductRecord>
  >
): void {
  for (const p of list) {
    db.products.push({
      id: p.id,
      name: p.name,
      description: p.description ?? '',
      price: p.price,
      userId: p.userId,
      tags: p.tags ?? [],
      images: p.images ?? [],
      createdAt: p.createdAt ?? new Date(),
      updatedAt: p.updatedAt ?? new Date(),
    });
  }
}

export function seedComments(
  list: Array<
    Pick<CommentRecord, 'id' | 'userId' | 'content'> &
      (
        | { articleId: number; productId?: undefined }
        | { productId: number; articleId?: undefined }
      ) &
      Partial<Pick<CommentRecord, 'createdAt' | 'updatedAt'>>
  >
): CommentRecord[] {
  const out: CommentRecord[] = [];
  for (const c of list) {
    const hasArticle =
      typeof (c as { articleId?: number }).articleId === 'number';
    const hasProduct =
      typeof (c as { productId?: number }).productId === 'number';
    if (hasArticle === hasProduct) {
      throw new Error(
        'seedComments: require exactly one of articleId or productId'
      );
    }
    const rec: CommentRecord = {
      id: c.id,
      content: c.content,
      userId: c.userId,
      articleId: (c as { articleId?: number }).articleId ?? null,
      productId: (c as { productId?: number }).productId ?? null,
      createdAt: c.createdAt ?? new Date(),
      updatedAt: c.updatedAt ?? new Date(),
    };
    db.comments.push(rec);
    out.push(rec);
  }
  return out;
}

export function seedArticleLikes(
  pairs: ReadonlyArray<Pick<ArticleLikeRecord, 'articleId' | 'userId'>>
): void {
  for (const x of pairs) db.articleLikes.push({ id: seq.aLike++, ...x });
}

export function seedProductLikes(
  pairs: ReadonlyArray<Pick<ProductLikeRecord, 'productId' | 'userId'>>
): void {
  for (const x of pairs) db.productLikes.push({ id: seq.pLike++, ...x });
}

export function seedCommentLikes(
  list: Array<Pick<CommentLikeRecord, 'commentId' | 'userId'>>
): void {
  for (const x of list) db.commentLikes.push({ id: seq.cLike++, ...x });
}

export function seedNotifications(
  list: Array<
    Omit<NotificationRecord, 'id' | 'createdAt' | 'updatedAt'> &
      Partial<Pick<NotificationRecord, 'id' | 'createdAt' | 'updatedAt'>>
  >
): void {
  for (const n of list) {
    const now = new Date();
    db.notifications.push({
      id: n.id ?? seq.notif++,
      userId: n.userId,
      type: n.type,
      message: n.message,
      isRead: n.isRead ?? false,
      createdAt: n.createdAt ?? now,
      updatedAt: n.updatedAt ?? now,
    });
  }
}
//#endregion
