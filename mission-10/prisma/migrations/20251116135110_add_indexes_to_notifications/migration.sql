-- CreateIndex
CREATE INDEX "notifications_recipientId_isRead_idx" ON "public"."notifications"("recipientId", "isRead");

-- CreateIndex
CREATE INDEX "notifications_recipientId_createdAt_idx" ON "public"."notifications"("recipientId", "createdAt" DESC);
