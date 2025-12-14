import * as Keychain from 'react-native-keychain';



// Your jest.mock block (assuming it is at the top of the file)
jest.mock("react-native-keychain", () => ({
  setGenericPassword: jest.fn(),
  getGenericPassword: jest.fn(),
  resetGenericPassword: jest.fn(),
  ACCESSIBLE: { WHEN_UNLOCKED: "WHEN_UNLOCKED" },
  STORAGE_TYPE: { AES_GCM_NO_AUTH: "AES_GCM_NO_AUTH" },
}));










// --- MOCK IMPLEMENTATION OF YOUR WRAPPER FUNCTIONS (Assuming this is your actual implementation) ---

// Replace 'auth/keychain' with the actual path to your file
const SERVICE_NAME = 'auth';

const saveRefreshToken = async (token: string) => {
  await Keychain.setGenericPassword(SERVICE_NAME, token, {
    accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
    storage: Keychain.STORAGE_TYPE.AES_GCM_NO_AUTH,
  });
};

const loadTokenBundle = async () => {
  const credentials = await Keychain.getGenericPassword();
  if (credentials === false) {
    return null; // Indicates nothing was found
  }
  return credentials.password; // Assuming you only store the token in the password field
};

const clearStoredTokens = async () => {
  await Keychain.resetGenericPassword();
};

// -------------------------------------------------------------------------------------------------




describe("auth/keychain", () => {

  // before each case clear all mocks
  beforeEach(() => jest.clearAllMocks());


  it("saves the refresh token with correct parameters", async () => {
    // 1. Arrange
    const mockToken: string = "super-secret-refresh-token-12345";

    // 2. Act
    await saveRefreshToken(mockToken);

    // 3. Assert
    expect(Keychain.setGenericPassword).toHaveBeenCalledTimes(1);
    expect(Keychain.setGenericPassword).toHaveBeenCalledWith(
      SERVICE_NAME, // The username/service name
      mockToken,    // The password (token)
      {
        accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
        storage: Keychain.STORAGE_TYPE.AES_GCM_NO_AUTH,
      }
    );

    expect(Keychain.setGenericPassword).toThrow()
  });

  it("getRefreshToken successfully", async () => {
    // 1. Arrange
    const expectedToken: string = "loaded-token-from-keychain";

    // Mock the successful return value of getGenericPassword
    (Keychain.getGenericPassword as jest.Mock).mockResolvedValue({
      service: SERVICE_NAME,
      username: SERVICE_NAME,
      password: expectedToken,
      // You might also need to mock the type property depending on your setup
    });

    // 2. Act
    const token = await loadTokenBundle();

    // 3. Assert
    expect(Keychain.getGenericPassword).toHaveBeenCalledTimes(1);
    expect(token).toEqual(expectedToken);
  });

  it("returns null when no token is found", async () => {
    // 1. Arrange
    // Keychain returns 'false' when no credentials are found for the service.
    (Keychain.getGenericPassword as jest.Mock).mockResolvedValue(false);

    // 2. Act
    const token = await loadTokenBundle();

    // 3. Assert
    expect(Keychain.getGenericPassword).toHaveBeenCalledTimes(1);
    expect(token).toBeNull();
    expect(Keychain.getGenericPassword).toThrow()
  });

  it("clears stored tokens", async () => {
    // 1. Arrange & 2. Act
    await clearStoredTokens();

    // 3. Assert
    expect(Keychain.resetGenericPassword).toHaveBeenCalledTimes(1);
    // You typically don't need to check the arguments, as resetGenericPassword is called without them
    expect(Keychain.resetGenericPassword).toThrow()
  });
});