import axios from "#/apis/api-constant";


export const getTours = async () => {
    const url = "/api/tours";
    try {
        const response = await axios.get(url);
        console.log("getTours response:", response);
        return response.data;
    } catch (error) {
        throw error
    }
};