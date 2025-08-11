-- CreateTable
CREATE TABLE "public"."CommentLike" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "commentId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CommentLike_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."article_comment_likes" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "commentId" INTEGER NOT NULL,

    CONSTRAINT "article_comment_likes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."product_comment_likes" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "commentId" INTEGER NOT NULL,

    CONSTRAINT "product_comment_likes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CommentLike_userId_commentId_key" ON "public"."CommentLike"("userId", "commentId");

-- CreateIndex
CREATE UNIQUE INDEX "article_comment_likes_userId_commentId_key" ON "public"."article_comment_likes"("userId", "commentId");

-- CreateIndex
CREATE UNIQUE INDEX "product_comment_likes_userId_commentId_key" ON "public"."product_comment_likes"("userId", "commentId");

-- AddForeignKey
ALTER TABLE "public"."CommentLike" ADD CONSTRAINT "CommentLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CommentLike" ADD CONSTRAINT "CommentLike_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "public"."ArticleComment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."article_comment_likes" ADD CONSTRAINT "article_comment_likes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."article_comment_likes" ADD CONSTRAINT "article_comment_likes_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "public"."ArticleComment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."product_comment_likes" ADD CONSTRAINT "product_comment_likes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."product_comment_likes" ADD CONSTRAINT "product_comment_likes_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "public"."ProductComment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
