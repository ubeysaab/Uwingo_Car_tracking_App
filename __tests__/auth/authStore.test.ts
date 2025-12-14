import { authStore } from "../../src/stores/authStore";
import * as keychain from "../../src/utils/auth/keychain";

jest.mock("../utils/auth/keychain");









describe('Auth Store Test ', () => {
  it("bootstrap → authenticated when token exists", async () => {

    // ref
    const rt = 'r1';


    (keychain.loadTokens as jest.Mock).mockResolvedValue({
      refreshToken: rt,
    });

    await authStore.getState().bootstrap();

    const state = authStore.getState();
    expect(state.status).toBe("authenticated");
    expect(state.refreshToken).toBe(rt);
  });
})