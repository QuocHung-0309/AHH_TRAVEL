"use client";

import { register, signin } from "../../apis/auth-api/auth";
// import { logout } from "../../apis/auth-api/logout";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useSignin = () => {
  return useMutation({ mutationFn: signin });
};
export const useRegister = () => {
  return useMutation({ mutationFn: register });
};

// export const useLogout = () => {
//     return useMutation({ mutationFn: logout });
// };

// export const useIsVerify = (params) => {
//     return useQuery({
//         queryKey: ["isVerify", params],
//         queryFn: () => isVerify(params),
//     });
// };
