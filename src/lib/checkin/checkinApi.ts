import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface CheckinPayload {
  note?: string;
  device?: string;
  imgList?: string[];
}

export const checkinApi = {

  getUserCheckins: async () => {
    const token = localStorage.getItem("accessToken");
    const res = await axios.get(`${API_URL}/me/checkins`, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
    return res.data.data;
  },

  createCheckin: async (placeId: string, data?: CheckinPayload) => {
    const token = localStorage.getItem("accessToken");
    const res = await axios.post(
      `${API_URL}/places/${placeId}/checkin`,
      {
        ...(data?.note ? { note: data.note } : {}),
        ...(data?.device ? { device: data.device } : { device: "Web App" }),
        ...(data?.imgList ? { imgList: data.imgList } : {}),
      },
      {
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      }
    );
    return res.data.data;
  },
};


