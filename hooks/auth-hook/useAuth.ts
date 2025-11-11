// /hooks/auth-hook/useAuth.ts
"use client";

import { authApi } from "@/lib/auth/authApi";
import { useMutation } from "@tanstack/react-query";

type SigninInput = {
  identifier: string;
  password: string;
};

type RegisterInput = {
  lastName: string;
  firstName: string;
  email: string;
  phone: string;
  password: string;
};

export const useSignin = () => {
  return useMutation({
    mutationFn: (input: SigninInput) =>
      authApi.login(input.identifier, input.password),
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: (input: RegisterInput) =>
      authApi.register(
        input.lastName,
        input.firstName,
        input.email,
        input.phone,
        input.password
      ),
  });
};
