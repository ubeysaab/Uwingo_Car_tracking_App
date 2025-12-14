import api from "../api"
import { loginEndPoint } from "../endpoints"
import { LoginResponseT, LoginSchema } from "../../types/auth"

export default async function login(UserName: string, Password: string): Promise<LoginResponseT> {

  const res = await api.post(loginEndPoint, { UserName, Password })

  console.log(res)
  const parsed = LoginSchema.safeParse(res.data);
  if (!parsed.success) {
    throw new Error("Invalid login response shape");
  }

  return parsed.data;
}