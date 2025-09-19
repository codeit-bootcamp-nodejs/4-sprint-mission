import { listupService } from '../services/user.service.js';

(async () => {
  try {
    const userProducts = await listupService(1); // 존재하는 userId
    console.log("상품 목록:", userProducts);
  } catch (err) {
    if (err instanceof Error) {
      console.error("Caught Error:", err.message);
      if ('status' in err) console.error("Status:", (err as any).status);
    } else {
      console.error("Caught unknown error:", err);
    }
  }
})();
