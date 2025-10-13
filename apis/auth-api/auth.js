import axios from "#/apis/api-constant";

export const signin = async (payload) => {
  const url = "/api/auth/login";
  try {
    const response = await axios.post(url, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const register = async (payload) => {
  const url = "/api/auth/register";
  try {
    const response = await axios.post(url, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};
