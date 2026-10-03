export class BootstrapRepository {
  async findAll(): Promise<unknown[]> {
    return [{ source: "bootstrap" }];
  }
}
