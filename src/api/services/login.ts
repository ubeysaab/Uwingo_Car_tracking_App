import api from "../api"
import { ENDPOINTS } from "../endpoints"
import { LoginResponseT, LoginSchema } from "../../types/auth"

export default async function login(UserName: string, Password: string): Promise<LoginResponseT> {


  console.log(ENDPOINTS.Others.login)
  const res = await api.post(ENDPOINTS.Others.login, { UserName, Password })

  console.log(res)
  const parsed = LoginSchema.safeParse(res.data);
  if (!parsed.success) {
    throw new Error("Invalid login response shape");
  }

  return parsed.data;
}