// auth/keychain.ts
import * as Keychain from "react-native-keychain";








/*

- Keychain stores strings
- Your app works with objects
- Serialization is the bridge

*/

export type StoredTokens = {
  //Todo:  IF SOME THING CHANGE IN THE FUTURE  I JUST NEED TO CHANGE THIS ONE 
  accessToken: string,
  refreshToken: string;
};

const SERVICE_NAME = "Login_Service";

/**
 * Save tokens securely
 */
export async function saveTokens(tokens: StoredTokens): Promise<void> {
  try {
    const serialized = JSON.stringify(tokens);

    await Keychain.setGenericPassword(
      "auth",
      serialized,
      {
        service: SERVICE_NAME,
        accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
        storage: Keychain.STORAGE_TYPE.AES_GCM_NO_AUTH,
      }
    );
  } catch (error) {
    throw new Error(`Failed to store tokens: ${String(error)}`);
  }
}

/**
 * Load tokens from secure storage
 */
export async function loadTokens(): Promise<StoredTokens | null> {
  try {
    const credentials = await Keychain.getGenericPassword({ service: SERVICE_NAME });
    if (!credentials) return null;

    const parsed = JSON.parse(credentials.password);

    // minimal runtime validation
    if (typeof parsed.refreshToken !== "string") {
      throw new Error("Invalid token shape");
    }

    return parsed as StoredTokens;
  } catch (error) {
    throw new Error(`Failed to load tokens: ${String(error)}`);
  }
}

/**
 * Clear all stored tokens
 */
export async function clearTokens(): Promise<void> {
  try {
    await Keychain.resetGenericPassword({ service: SERVICE_NAME });
  } catch (error) {
    throw new Error(`Failed to clear tokens: ${String(error)}`);
  }
}
