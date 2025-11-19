export interface Notification {
  id: number;
  user_id: number;
  type: string;
  title: string;
  message: string;
  product_id?: number;
  post_id?: number;
  is_read: boolean;
  read_at?: Date;
  created_at: Date;
}

export interface CreateNotificationDto {
  user_id: number;
  type: string;
  title: string;
  message: string;
  product_id?: number;
  post_id?: number;
}
