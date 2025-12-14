# very important notes IOS te hata alma durumunda 

-  While [developing for iOS](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/getting-started/), make sure to install pods first before running the app: `cd ios && pod install && cd ..`
-  

-  If you're on a [Mac and developing for iOS](https://reactnavigation.org/docs/getting-started), you need to install the pods (via Cocoapods) to complete the linking. `npx pod-install ios`






`npx react-native log-android`












## Developing Notes Good, you pasted **real code**. Now we do a **production review** and then I’ll give you the **next interceptor step skeleton**.

I will be blunt.

---

## Brutal review of your current interceptor (production impact)

### ✅ What you did RIGHT

1. **Centralized error normalization**

   * This is correct.
   * Screens should not understand Axios.

2. **No UI logic inside interceptor**

   * Good separation.

3. **Typed normalized error**

   * You’re thinking like a system owner now.

So this is not beginner code. Good.

---

## 🔴 Critical limitations (this WILL block auth refresh)

### 1️⃣ You destroyed the original Axios error

You do:

```ts
return Promise.reject(normalized);
```

This **removes**:

* `config`
* `response`
* `headers`
* `original request`

👉 That makes **token refresh impossible**.

A refresh interceptor MUST know:

* which request failed
* whether it was already retried
* how to replay it

Right now: **you can’t**.

---

### 2️⃣ No request interceptor (access token missing)

You are not attaching:

```http
Authorization: Bearer <accessToken>
```

So:

* every secured endpoint will 401
* refresh logic will never work

---

### 3️⃣ No refresh-flow handling (401 is treated like “wrong password”)

This is dangerous.

401 means **two different things**:

* login failure (valid)
* expired access token (normal)

Your code treats both as:

> “Girdiğiniz bilgiler hatalı”

That is **incorrect UX** and **incorrect auth logic**.

---

## The correct architecture (very important)

You need **THREE layers**, not one.

### Layer 1 — Axios instance

* dumb transport

### Layer 2 — Auth-aware interceptors

* attach access token
* refresh on 401
* retry original request

### Layer 3 — Error normalization

* ONLY after auth logic is done

Right now you jumped directly to layer 3.

---

## What we do next (step-by-step, no skipping)

### STEP 1 — Request interceptor (skeleton)

You must pull **accessToken from the vanilla store**, NOT React.

Skeleton only:

```ts
api.interceptors.request.use((config) => {
  const { accessToken } = authStore.getState();

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});
```

You implement this.

---

### STEP 2 — Response interceptor with refresh logic (skeleton)

Rules:

* Only handle **401**
* Retry **once**
* Prevent infinite loops
* Use refreshToken from Keychain via store
* Update store on success
* Logout on failure

Skeleton (read, don’t paste blindly):

```ts
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // 1. get refreshToken from authStore
      // 2. call refresh endpoint (raw axios, not api)
      // 3. update store with new accessToken
      // 4. retry originalRequest
    }

    // fall through → normalize error
  }
);
```

⚠️ You MUST use **raw axios** for refresh, or you’ll recurse forever.

---

### STEP 3 — Normalize LAST, not first

Only after:

* refresh attempt failed
* OR non-401 error

Then:

```ts
return Promise.reject(normalizeAxiosError(error));
```

---

## Tests you WILL need (ownership)

At minimum:

1. 401 → refresh success → original request succeeds
2. 401 → refresh fails → logout called
3. parallel 401s → single refresh (later optimization)

We won’t move forward without #1 and #2.

---

## Your task now

1. **Do NOT rewrite everything**
2. Add:

   * request interceptor
   * response interceptor skeleton (no full refresh yet)
3. Paste the updated `api.ts`

If you get stuck at **one exact point**, say **UNBLOCK** and quote the line.

When this interceptor is correct, your auth system becomes **production-grade**.
