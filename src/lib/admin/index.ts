import { adminApi, setAdminToken } from "./adminApi";

export async function adminLogin(identifier: string, password: string) {
  const { data } = await adminApi.post("/login", { identifier, password });
  // BE trả accessToken
  setAdminToken(data?.accessToken ?? "");
  return data;
}

export async function getOngoingTours() {
  const { data } = await adminApi.get("/tours/ongoing");
  return data; // [{_id,title,startDate,leader,...}]
}
