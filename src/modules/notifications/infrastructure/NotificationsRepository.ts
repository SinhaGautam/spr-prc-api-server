export class NotificationsRepository {
  async findAll(): Promise<unknown[]> {
    return [{ source: "notifications" }];
  }
}
