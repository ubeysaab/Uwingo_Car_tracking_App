
import * as z from 'zod';
import api from '@/api/config/api';
/**
 * A generic function to handle API calls with Zod validation
 * @param method - The HTTP method (post, get, put, delete)
 * @param endpoint - The API URL
 * @param schema - The Zod schema to validate the response

 * @param data - Optional body data for the request
 */

//  * We use z.ZodSchema<T> so that the function can automatically "read" the type out of the Zod object you pass in. This saves you from having to manually type your API results every time you call them.











async function callApi<T>(
  method: 'get' | 'post' | 'put' | 'delete',
  endpoint: string,
  schema: z.ZodSchema<T>,
  payload?: any
): Promise<T> {
  console.log(`Calling ${method.toUpperCase()}: ${endpoint}`);

  // 1. Perform the request
  // Use api[method] to dynamically select the axios/fetch function
  const res = await api[method](endpoint, payload);

  console.log("Response :", res);

  // 2. Validate the response
  const parsed = schema.safeParse(res.data);

  if (!parsed.success) {
    console.error("Validation Error:", parsed.error);
    throw new Error(`Invalid response shape for ${endpoint}`);
  }

  return parsed.data;
}

export default callApi