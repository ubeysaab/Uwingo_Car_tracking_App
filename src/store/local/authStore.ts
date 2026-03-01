
// // - A vanilla store
// import { createStore } from "zustand/vanilla";
// import { useStore } from "zustand";






// /**
//  * 1. Store tokens: Keychain ONLY
//  * 2. Mirror the token in-memory using Zustand
//  * 3. Refresh token stays ONLY in Keychain
//  * 4. Access token is copied from Keychain → Zustand at startup
//  */
// // Zustand store must hydrate itself BEFORE the app renders auth-gated screens


// import { clearTokens, loadTokens, saveTokens } from "../../utils/auth/keychain";

// type AuthStatus = "booting" | "authenticated" | "unauthenticated";

// type AuthState = {
//   status: AuthStatus;
//   accessToken: string | null;
// };

// type AuthActions = {
//   bootstrap: () => Promise<void>;
//   loginSuccess: (payload: {
//     accessToken: string;
//     refreshToken: string;
//   }) => Promise<void>;
//   logout: () => Promise<void>;
// };

// export type AuthStore = AuthState & AuthActions;

// export const authStore = createStore<AuthStore>((set) => ({
//   // set initial states 
//   status: "booting",
//   accessToken: null,


//   // TODO : IN ORDER TO MAKE IT PERSIST LOOK AT THE COMMENTED CODES  AT THE END AND KEYCHAIN FILE

//   // define what each actions do 

//   // BOOTSTRAP : THE INITIAL LOADING STATE
//   bootstrap: async () => {
//     const stored = await loadTokens();

//     if (stored) {
//       set({
//         status: "authenticated",
//         // refreshToken: stored.refreshToken,
//       });
//     } else {
//       set({ status: "unauthenticated" });
//     }
//   },

//   loginSuccess: async ({ accessToken, refreshToken }) => {
//     await saveTokens({ refreshToken });

//     set({
//       accessToken,
//       status: "authenticated",
//     });

//     console.log("AUTH STATUS AFTER LOGIN:", authStore.getState().status);



//   },

//   logout: async () => {
//     await clearTokens();

//     set({
//       status: "unauthenticated",
//       accessToken: null,
//     });
//   },
// }));


// // ✅ The correct definition:
// export const useAuthStore = <T>(selector: (state: AuthStore) => T) => useStore(authStore, selector);



import { createStore } from "zustand/vanilla";
import { useStore } from "zustand";
import { clearTokens, loadTokens, saveTokens } from "../../utils/auth/keychain";

type AuthStatus = "booting" | "authenticated" | "unauthenticated";

type AuthState = {
  status: AuthStatus;
  accessToken: string | null;
};

type AuthActions = {
  bootstrap: () => Promise<void>;
  loginSuccess: (payload: {
    accessToken: string;
    refreshToken: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
};

export type AuthStore = AuthState & AuthActions;

export const authStore = createStore<AuthStore>((set) => ({
  status: "booting",
  accessToken: null,

  // UYGULAMA AÇILIŞINDA ÇALIŞIR: Keychain'den verileri belleğe (Zustand) çeker
  bootstrap: async () => {
    try {
      const stored = await loadTokens();

      if (stored && stored.accessToken) {
        set({
          status: "authenticated",
          accessToken: stored.accessToken, // Belleğe geri yükle
        });
      } else {
        set({ status: "unauthenticated", accessToken: null });
      }
    } catch (error) {
      console.error("Bootstrap error:", error);
      set({ status: "unauthenticated", accessToken: null });
    }
  },

  // LOGIN BAŞARILI: Hem Keychain'e (kalıcı) hem Zustand'a (bellek) yazar
  loginSuccess: async ({ accessToken, refreshToken }) => {
    try {
      // ÖNEMLİ: accessToken'ı da Keychain'e ekledik
      await saveTokens({ accessToken, refreshToken });

      set({
        accessToken,
        status: "authenticated",
      });

      console.log("AUTH STATUS AFTER LOGIN:", authStore.getState().status);
    } catch (error) {
      console.error("Save tokens error:", error);
    }
  },

  // LOGOUT: Hem Keychain'i hem Zustand'ı temizler
  logout: async () => {
    await clearTokens();
    set({
      status: "unauthenticated",
      accessToken: null,
    });
  },
}));

export const useAuthStore = <T>(selector: (state: AuthStore) => T) =>
  useStore(authStore, selector);

