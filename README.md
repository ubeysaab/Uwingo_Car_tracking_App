# very important notes IOS te hata alma durumunda 

-  While [developing for iOS](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/getting-started/), make sure to install pods first before running the app: `cd ios && pod install && cd ..`
-  

-  If you're on a [Mac and developing for iOS](https://reactnavigation.org/docs/getting-started), you need to install the pods (via Cocoapods) to complete the linking. `npx pod-install ios`






`npx react-native log-android`














# Brutal review of your current interceptor (production impact)

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



# 📝  context of VanillaStore/Bound store  Zustand

This is a very common and critical error in React state management, especially when using libraries like **Zustand** (which uses React's `useSyncExternalStore` hook internally).

The warning:

> "The result of `getSnapshot` should be cached to avoid an infinite loop"

means that the function you are passing as the selector to `useStore` (or your custom `useAuthStore` hook) is **returning a new object or array reference on every single render**, even if the actual data inside that object/array has not changed.

When the selector returns a new reference, React thinks the state has changed, which triggers a re-render, which runs the selector again, which returns a new reference, and the loop continues infinitely.

Here are the **three primary ways to fix this** using the provided `useAuthStore` structure.

-----

## 1\. The Best Fix: Use `shallow` Equality

Zustand provides a utility called `shallow` (or `useShallow` for selectors) that tells the hook to compare the **values** inside the returned object/array, rather than just comparing the memory **reference** of the object/array itself.

### A. If you are selecting multiple properties:

The most common cause of this error is returning a new object literal (`{...}`) or array literal (`[...]`) from your selector function, like this:

**❌ The Code Causing the Error:**

```tsx
const { name, isLoggedIn } = useAuthStore((state) => ({
    name: state.user?.name,
    isLoggedIn: state.isLoggedIn,
})); // This object is new on every render!
```

**✅ The Fix: Use `shallow`**
You need to import `shallow` (or `useShallow` if you have it) from `zustand` and pass it as the second argument to your `useAuthStore` hook.

```tsx
import { shallow } from 'zustand';
// Or if you use the recommended useShallow:
// import { useShallow } from 'zustand/react/shallow'

function UserProfileCard() {
  // Pass 'shallow' to compare the values of 'name' and 'isLoggedIn',
  // not the object reference.
  const { name, isLoggedIn } = useAuthStore((state) => ({
    name: state.user?.name,
    isLoggedIn: state.isLoggedIn,
  }), shallow); // <-- FIX IS HERE!

  // ... rest of your component
}
```

> **Note on your custom hook:** If you want this fix to be automatically applied, you would need to change your `useAuthStore` definition to accept an equality function:
>
> ```typescript
> import { useStore, shallow } from 'zustand';
> // ... authStore setup
> ```

> // New definition of your custom hook
> export const useAuthStore = <T>(
> selector: (state: AuthStore) =\> T,
> // Add an optional equality function (defaulting to a specific one if needed)
> equalityFn?: (a: T, b: T) =\> boolean
> ) =\> useStore(authStore, selector, equalityFn);

> // Usage with shallow:
> const { name, isLoggedIn } = useAuthStore(
> (state) =\> ({ name: state.user?.name, isLoggedIn: state.isLoggedIn }),
> shallow // Passed as the third argument
> );
>
> ```
> ```

-----

## 2\. The Granular Fix: Select One Value at a Time

If you only need one value from the store, you can avoid returning an object/array completely, which eliminates the need for `shallow`. This is the most performance-optimized approach in Zustand.

**✅ The Fix: Multiple Hooks**

```tsx
function Header() {
  // Select a single primitive value (string, boolean, number)
  const name = useAuthStore((state) => state.user?.name);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  // No new object/array is created, so no infinite loop.
  // The component only re-renders if 'name' or 'isLoggedIn' changes.

  if (!isLoggedIn) return null;
  return <h1>Hello, {name}</h1>;
}
```

-----

## 3\. The Object Fix: Select the Whole Immutable Object

If you are selecting a piece of state that is already an immutable object (e.g., the entire `user` object) and you plan to destructure it inside the component, you can select it directly.

**✅ The Fix: Select an existing object reference**

```tsx
function UserDetails() {
  // Select the entire 'user' object (assuming state.user is not recreated
  // on every state change, which it shouldn't be in a well-defined store).
  const user = useAuthStore((state) => state.user);

  // Now, safely destructure and use the properties
  const { name, email } = user || {};

  return (
    <div>
      <p>Name: {name}</p>
      <p>Email: {email}</p>
    </div>
  );
}
```

### Summary of the Cause

The warning points to the core mechanism React uses for state hooks: if the returned value from the subscription function is **referentially different** on subsequent calls, React assumes the state has changed and triggers a re-render. Returning an object or array literal (`{...}` or `[...]`) inside a selector always creates a new reference, leading to the infinite loop. Using `shallow` solves this by checking the **content** instead of the **reference**.

I recommend using **Option 1 (with `shallow`)** if you need multiple values, or **Option 2 (single-value selectors)** if your component can be logically split.

Do you want to check if the issue is in your store definition or if it is purely in how you are calling `useAuthStore` in your component?


## Thing need to back 

-  npm warn deprecated inflight@1.0.6: This module is not supported, and leaks memory. Do not use it. Check out lru-cache if you want a good and tested way to coalesce async requests by a key value, which is much more comprehensive and powerful.
-  

# Zod
In Zod, these three terms refer to different parts of the ecosystem: **the blueprint** (`z.object`), **the tool** (`z.infer`), and **the generic type** (`z.ZodSchema`).

Here is a breakdown of how they differ and when to use them.

---

### 1. `z.object` (The Blueprint)

This is a **function** used to define the shape of a JavaScript object. It is the most common way to create a schema. It tells Zod exactly what keys and value types to expect at **runtime**.

* **Usage:** Creating your data model.
* **Example:**
```typescript
const UserSchema = z.object({
  name: z.string(),
  age: z.number()
});

```



### 2. `z.infer` (The Tool)

This is a **TypeScript utility** provided by Zod. It "extracts" the TypeScript type from a Zod schema so you don't have to write the interface manually. It bridges the gap between Zod (runtime) and TypeScript (compile-time).

* **Usage:** Generating a TypeScript type/interface from your schema.
* **Example:**
```typescript
// This creates a standard TypeScript type: { name: string; age: number; }
type User = z.infer<typeof UserSchema>;

const myUser: User = { name: "Alice", age: 30 }; // Type-safe!

```



### 3. `z.ZodSchema` (The Generic Type)

This is a **TypeScript type definition** (specifically an alias for `ZodType`). It is used when you want to define a variable or function argument that can hold *any* Zod schema, regardless of whether it's an object, string, or array.

* **Usage:** Creating reusable functions that accept schemas as arguments.
* **Example:** (This is what we used in your `callApi` function)
```typescript
// We use z.ZodSchema<T> to say "this argument must be a Zod validator"
function validateData<T>(schema: z.ZodSchema<T>, data: unknown): T {
  return schema.parse(data);
}

```



---

### Summary Comparison Table

| Feature        | `z.object`                  | `z.infer`                    | `z.ZodSchema`              |
| -------------- | --------------------------- | ---------------------------- | -------------------------- |
| **Category**   | Runtime Builder             | Type Utility                 | Type Definition            |
| **Purpose**    | Defines a structure.        | Creates a TS Type.           | Type-hints a schema.       |
| **Result**     | A Zod Schema instance.      | A TypeScript Type.           | A type for a variable.     |
| **Common Use** | `const S = z.object({...})` | `type T = z.infer<typeof S>` | `function(s: z.ZodSchema)` |

### How they work together

In a professional codebase, you usually see them used in this exact order:

1. Define the structure with **`z.object`**.
2. Extract the type with **`z.infer`** to use in your components/functions.
3. Use **`z.ZodSchema`** (or `z.ZodType`) if you are building a generic wrapper like the `callApi` helper we discussed earlier.

**Would you like me to clarify the difference between `z.ZodSchema` and `z.ZodType`, or are you ready to implement the generic API helper?**



# arch
To answer your question directly: **No, seniors do not usually call the API wrapper directly inside the UI component.**

While your `callApi` wrapper makes the code **DRY**, seniors focus on **Separation of Concerns**. Calling an API directly in a component makes that component hard to test, tightly coupled to your API structure, and difficult to manage as the app grows.

Here is the "Senior" architecture for handling data fetching:

---

### The 3-Layer Architecture

Instead of one jump from UI to API, seniors use a layered approach:

#### 1. The API Client (The Wrapper)

This is exactly what we built. It handles the "how" of the network call (headers, base URL, Zod validation).

* **File:** `src/api/client.ts`
* **Purpose:** Technical infrastructure.

#### 2. The Service Layer (The Logic)

You create a specific file for each resource (e.g., `vehicles.service.ts`). This layer defines *what* data is being fetched. If the backend changes a URL or a field name, you only change it here, not in 50 components.

* **File:** `src/services/vehicles.ts`
* **Example:**
```typescript
export const VehicleService = {
  getAll: () => callApi('get', '/vehicles', VehicleListSchema),
  getById: (id: string) => callApi('get', `/vehicles/${id}`, VehicleSchema),
};

```



#### 3. The Hook Layer (The State) — *Crucial*

Seniors almost never use `useEffect` for data fetching anymore. They use a library like **TanStack Query (React Query)** or **SWR**. This handles caching, loading states, and retries.

* **File:** `src/hooks/useVehicles.ts`
* **Example:**
```typescript
export const useVehicles = () => {
  return useQuery({
    queryKey: ['vehicles'],
    queryFn: VehicleService.getAll,
  });
};

```



---

### Why Seniors do it this way:

| Problem                 | Direct Wrapper in UI                                                    | Senior Architecture (Service + Hooks)                |
| ----------------------- | ----------------------------------------------------------------------- | ---------------------------------------------------- |
| **Loading/Error State** | You must manually create `useState` for `isLoading` in every component. | Automatically handled by the hook.                   |
| **Duplicate Calls**     | If 3 components need the same data, the API is hit 3 times.             | The hook caches the result; only 1 API call is made. |
| **Testing**             | Hard. You have to mock the network.                                     | Easy. You just mock the hook or the service.         |
| **Refactoring**         | If `/vehicles` changes to `/fleet`, you find/replace everywhere.        | You change 1 line in the Service file.               |

---

### Comparison of the "Junior" vs "Senior" UI Component

**Junior (Direct Call):**

```tsx
const VehicleList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    callApi('get', '/vehicles', schema).then(res => {
      setData(res);
      setLoading(false);
    });
  }, []);

  if (loading) return <Spinner />;
  return <div>{/* render data */}</div>;
};

```

**Senior (Using Hooks):**

```tsx
const VehicleList = () => {
  const { data, isLoading, error } = useVehicles(); // One line, clean logic.

  if (isLoading) return <Spinner />;
  if (error) return <ErrorMessage />;

  return <div>{/* render data */}</div>;
};

```



# vs config

To implement a Next.js-style `@` alias in React Native and ensure VS Code handles file moves correctly, follow this step-by-step summary.

### **Step 1: Install the Babel Plugin**

Babel needs a specific plugin to understand that `@` isn't a real package in `node_modules`, but a shortcut to your folder.

```bash
npm install --save-dev babel-plugin-module-resolver
# or
yarn add --dev babel-plugin-module-resolver

```

---

### **Step 2: Configure Babel (The "Builder")**

Edit your `babel.config.js`. This tells the Metro Bundler how to find your files when the app runs.

```javascript
module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@': './src',
        },
      },
    ],
  ],
};

```

---

### **Step 3: Configure TypeScript (The "Editor")**

Edit your `tsconfig.json`. This tells VS Code where the files are so you get auto-complete and "Cmd + Click" support.

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}

```

---

### **Step 4: Configure VS Code for File Moves**

To make VS Code automatically update your `@/` imports when you drag-and-drop or rename a file, change these settings:

1. **Open Settings**: `Cmd + ,` (Mac) or `Ctrl + ,` (Windows).
2. **Update Imports on Move**: Search for `updateImportsOnFileMove` and set both JS and TS to **"Always"**.
3. **Prefer Path Aliases**: Search for `importModuleSpecifier` and set it to **"non-relative"**. This forces VS Code to use `@/` instead of `../../` when it fixes paths.

---

### **Step 5: Reset and Test**

Because React Native caches your file structure, you **must** restart with a clean slate for the changes to take effect:

```bash
npx react-native start --reset-cache

```

### **Summary of Results**

* **Imports look like:** `import { Header } from '@/components/Header';`
* **Moving a file:** If you move `Header.tsx` to a new folder, VS Code will automatically rewrite all your `@/components/Header` imports to the new location.
* **No Red Lines:** TypeScript will recognize `@/` as your `src` folder immediately.

[VS Code tips for moving files](https://www.youtube.com/watch?v=8oCBk9BWjHQ)
This video demonstrates how to configure VS Code to automatically update import statements when renaming or moving files within your project.

**Would you like me to provide a "check-list" of common errors to look for if your app still says "Module not found" after these steps?**



## React Query
In **TanStack Query** (formerly React Query), `useQueryClient` is a custom hook that returns the current **QueryClient** instance.

Think of the `QueryClient` as the "brain" or the central engine that manages the cache, state, and configuration for all your data fetching.

---

## Why do you need `useQueryClient`?

While `useQuery` is used to **fetch** data, `useQueryClient` is used to **manipulate** the cache or interact with it globally. Here are the most common use cases:

### 1. Manual Cache Invalidation

The most frequent use case is telling React Query that certain data is now "old" (stale) and needs to be refetched—usually after a successful mutation (like updating a user profile).

```javascript
const queryClient = useQueryClient();

const mutation = useMutation({
  mutationFn: updateProfile,
  onSuccess: () => {
    // Invalidate and refetch 'user' data
    queryClient.invalidateQueries({ queryKey: ['user'] });
  },
});

```

### 2. Prefetching Data

You can use it to fetch data before the user even navigates to a specific page or opens a modal, making the UI feel instantaneous.

```javascript
const prefetchTodos = async () => {
  // This will fetch the data and put it in the cache
  await queryClient.prefetchQuery({
    queryKey: ['todos'],
    queryFn: fetchTodos,
  });
};

```

### 3. Updating the Cache Manually (Optimistic Updates)

Sometimes you don’t want to wait for a server response to show a change. You can use `setQueryData` to manually update the cached data immediately.

```javascript
queryClient.setQueryData(['todos'], (oldData) => [...oldData, newTodo]);

```

### 4. Accessing Cached Data

If you need to peek at data that is already in the cache without triggering a new network request, you can use `getQueryData`.

```javascript
const cachedData = queryClient.getQueryData(['user']);

```

---

## How it works under the hood

When you wrap your app in a `<QueryClientProvider>`, you provide a `new QueryClient()`. The `useQueryClient` hook allows any child component to tap into that same instance.

### Summary Table

| Method                  | What it does                                      |
| ----------------------- | ------------------------------------------------- |
| **`invalidateQueries`** | Marks data as stale and triggers a refetch.       |
| **`setQueryData`**      | Directly overwrites data in the cache.            |
| **`getQueryData`**      | Retrieves existing data from the cache.           |
| **`prefetchQuery`**     | Fetches data ahead of time to store in the cache. |
| **`clear`**             | Wipes the entire cache (useful for logout).       |

---

Would you like to see a full example of how to implement an **optimistic update** using `useQueryClient`?



## RipGrep (need To learn)
`rg -l "theThingYourAreLooking" | ForEach-Object {git add $_}`



## git 
Command,What it finds,Use Case
`git log --grep=""X"`,"Commits with ""X"" in the message.",Finding a specific feature/fix.
`git log -S ""X""`,"Commits where ""X"" was added/removed in code.",Finding when a variable was deleted.
`git log -G ""X""`,"Commits where ""X"" exists in the diff.",Finding any change involving a keyword.



## zod error vs message 
In the context of **Zod** and **React Hook Form**, the difference between `message` and `error` is primarily about the **level of the data structure** you are looking at.

---

### 1. `error` (The Container)

The `error` is usually an **object** that contains all the metadata about why a specific field failed. When you use React Hook Form, `errors.fieldName` is an object.

**Inside the `error` object, you typically find:**

* **type**: The validation rule that failed (e.g., "required", "min", "too_small").
* **message**: The actual string text to show the user.
* **ref**: A reference to the input element (in web).

### 2. `message` (The String)

The `message` is just the **plain text** inside that error object. It is the human-readable part (e.g., "Please enter a valid date").

---

### Comparison Table

| Feature       | `error`                                         | `message`                                         |
| ------------- | ----------------------------------------------- | ------------------------------------------------- |
| **Data Type** | Object `{ type, message, ... }`                 | String `"Required"`                               |
| **Purpose**   | Tells the developer *what* happened.            | Tells the user *how* to fix it.                   |
| **Usage**     | Used to trigger UI changes (e.g., red borders). | Used to display the warning text below the input. |

---

### How it looks in your code

When you define your schema, you are providing the **message** for the potential **error**:

```typescript
const schema = z.object({
  performedBy: z.string().min(1, { message: "Name is required" }) 
  //                              ^ This is the message string
});

```

When you use it in your Component:

```tsx
const { formState: { errors } } = useForm();

// 1. We check if the 'error' object exists to show/hide parts of UI
const hasError = errors.performedBy ? true : false;

// 2. We extract the 'message' string to show the text
const errorMessage = errors.performedBy?.message;

return (
  <View>
    <TextInput style={{ borderColor: errors.performedBy ? 'red' : 'gray' }} />
    
    {/* If the error object exists, show the message string */}
    {errors.performedBy && <Text>{errors.performedBy.message}</Text>}
  </View>
);

```

### Why you might be confused (Zod 4 / Modern Zod)

In older versions of some libraries, you might have seen a field called `error` that was just a string.

**In modern Zod/React Hook Form:**

1. **`errors`** is the collection of all field failures.
2. **`errors.field`** is the specific error object for that input.
3. **`errors.field.message`** is the string text you defined in your Zod schema.

---

**Summary:** If your code says `errors.lastMaintenanceDate`, you are holding the **Error Object**.
If your code says `errors.lastMaintenanceDate.message`, you are holding the **Text String**.

Would you like me to show you how to set up a "Base Input" component that automatically extracts the `message` from the `error` object so you don't have to repeat that logic?




## Uploading Images

Since you're using **React Native**, handling file uploads requires a specific approach to how the `fetch` API interacts with the native file system.

Here is the integrated code for your `ImageUploader` component. I’ve added a `loading` state to provide feedback to the user while the image is traveling to the server.

### Updated Component

```tsx
import LucideIconButton from '@/components/IconButton/LucideIconButton';
import React, { useState } from 'react';
import { View, Image, StyleSheet, Alert, ActivityIndicator, Platform } from 'react-native';
import { launchCamera, launchImageLibrary, CameraOptions, ImagePickerResponse, Asset } from 'react-native-image-picker';

const ImageUploader = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const options: CameraOptions = {
    mediaType: 'photo',
    quality: 1,
    saveToPhotos: true,
  };

  const uploadImage = async (asset: Asset) => {
    const formData = new FormData();
    
    // Crucial for React Native: The object must have uri, type, and name
    const fileToUpload = {
      uri: Platform.OS === 'android' ? asset.uri : asset.uri?.replace('file://', ''),
      type: asset.type || 'image/jpeg',
      name: asset.fileName || 'upload.jpg',
    };

    // @ts-ignore - FormData expects a string/blob, but RN uses this object format
    formData.append('image', fileToUpload);

    try {
      setUploading(true);
      const response = await fetch('https://your-api-endpoint.com/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const result = await response.json();
      Alert.alert('Success', 'Image uploaded!');
    } catch (error) {
      console.error(error);
      Alert.alert('Upload Failed', 'Check your network or server.');
    } finally {
      setUploading(false);
    }
  };

  const handleResponse = (result: ImagePickerResponse) => {
    if (result.didCancel) return;
    if (result.errorCode) {
      Alert.alert('Error', result.errorMessage);
    } else if (result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      setSelectedImage(asset.uri || null);
      uploadImage(asset);
    }
  };

  return (
    <View style={styles.container}>
      {uploading && <ActivityIndicator size="large" color="#0000ff" />}
      
      {selectedImage && <Image source={{ uri: selectedImage }} style={styles.image} />}

      <View style={styles.buttonRow}>
        <LucideIconButton text="Take Photo" icon='Camera' onPress={() => launchCamera(options, handleResponse)} />
        <LucideIconButton text="Gallery" icon='ImagePlus' onPress={() => launchImageLibrary(options, handleResponse)} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  image: { width: 200, height: 200, marginBottom: 20, borderRadius: 10 },
  buttonRow: { flexDirection: 'row', gap: 10 }
});

export default ImageUploader;

```

---

### Why this works

1. **`FormData` Construction**: React Native's `fetch` implementation looks for an object with a `uri` key. If it sees this, it knows to go to the device storage, find that file, and stream it as binary data rather than a plain string.
2. **`Platform.OS` Check**: Android URIs usually start with `content://` or `file://`. Occasionally, iOS needs the `file://` prefix stripped for the internal `fetch` library to read it correctly.
3. **`Content-Type`**: When sending `FormData`, the browser (or React Native) automatically adds a "boundary" string to the header to separate the fields. By setting the header manually to `multipart/form-data`, you're ensuring the server knows how to parse the incoming stream.

### One quick thing to check:

Does your server expect the file field name to be `'image'`, `'file'`, or something else? In my code, I used `formData.append('image', ...)`. Ensure this matches your backend's expected key (like `multer.single('image')` in Node.js).

**Would you like me to show you how to add a progress bar so the user can see the upload percentage?**


## i18n
| Package               | Role       | Why you can't (easily) skip it                                                                                                                              |
| --------------------- | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| i18next               | The Brain  | "This is the base engine. It handles the logic of switching languages                                                                                       | pluralization (e.g., ""1 item"" vs ""2 items""), and formatting." |
| react-i18next         | The Bridge | "This connects the ""Brain"" to React. It gives you the useTranslation hook so your UI automatically re-renders when the language changes."                 |
| react-native-localize | The Sensor | "JavaScript can't ""talk"" to your iPhone or Android system settings directly to ask ""What language is this phone set to?"" This native module does that." |
| async-storage         | The Memory | "Without this, if a user manually changes the app to French, it will ""forget"" and reset to English the next time they open the app."                      |





## ts
What a type predicate means (plain English)

It means:

“If this function returns true, then TypeScript should treat value as PeriodInMonths.”