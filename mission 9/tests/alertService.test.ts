import { AlertService } from "../src/services/alertService";
import { AlertRepository } from "../src/repositories/alertRepository";
import { getIo } from "../src/socket/io";

jest.mock("../src/repositories/alertRepository");
jest.mock("../src/socket/io");

describe("AlertService", () => {
  let service: AlertService;
  let repo: jest.Mocked<AlertRepository>;

  beforeEach(() => {
    service = new AlertService();
    repo = service["repo"] as any;
    (getIo as jest.Mock).mockReturnValue({
      to: jest.fn().mockReturnThis(),
      emit: jest.fn(),
    });
  });

  it("알림 생성", async () => {
    repo.createAlert.mockResolvedValue({
      id: 1,
      userId: 1,
      message: "테스트",
      link: null,
      createdAt: new Date(),
      isRead: false,
    });
    const alert = await service.create(1, "테스트");
    expect(alert).toHaveProperty("id");
    expect(getIo().to).toHaveBeenCalled();
  });

  it("알림 읽기 권한 검증", async () => {
    repo.findById.mockResolvedValue({
      id: 1,
      userId: 2,
      message: "테스트",
      link: null,
      createdAt: new Date(),
      isRead: false,
    });
    const result = await service.read(1, 2);
    expect(result).toBe(true);
  });

  it("권한 없는 경우 읽기 실패", async () => {
    repo.findById.mockResolvedValue({
      id: 1,
      userId: 2,
      message: "테스트",
      link: null,
      createdAt: new Date(),
      isRead: false,
    });
    const result = await service.read(1, 3);
    expect(result).toBe(false);
  });
});
