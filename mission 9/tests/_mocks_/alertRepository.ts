export class AlertRepository {
  createAlert = jest.fn();
  findByUserId = jest.fn();
  findById = jest.fn();
  markAsRead = jest.fn();
  countUnread = jest.fn();
}
