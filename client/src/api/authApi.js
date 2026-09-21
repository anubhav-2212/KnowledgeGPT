import Api from "./axios.js";

export const login = async(data) => { 
     const response= await Api.post("/auth/login", data);
     return response.data

    }
export const register = async(data) =>{
    const response= await Api.post("/auth/register", data);
}
export const logout = () => Api.post("/auth/logout");