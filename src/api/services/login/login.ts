import { ENDPOINTS } from "@/api/endpoints"
import { LoginSchema } from "@/types/auth" // We only need the Schema now!
import callApi from "@/api/config/apiCall"

// Senior Tip: Let TypeScript infer the return type from callApi
export default async function login(UserName: string, Password: string) {

  // TypeScript "sees" LoginSchema and automatically knows 'res' is LoginResponseT
  const res = await callApi("post", ENDPOINTS.Others.login, LoginSchema, { UserName, Password });

  return res;
}