import axios from "axios";
import { BASE_API, LOCAL_STORAGE_TOKEN } from "../../../../utils/helper/helper";
import { getLocalStorage } from "../../../../utils/helper/localStorage";

export const getAllMenu = async() => {
    const URL = `${BASE_API}/menu/getAll`
    try{
        const data = await axios.get(URL, {
            headers: {
                Authorization: `Bearer ${getLocalStorage(LOCAL_STORAGE_TOKEN)}`, 
              },        
        })
        const res = data.data
        if(res.success === true) {
            return Promise.resolve({
                status: "success",
                data: res.data,
              });
        
        }
    } catch (err) {
        return Promise.resolve({
          status: "error",
          message: err.response,
        });
    }
}

export const getByID = async(id) => {
    const URL = `${BASE_API}/menu/getID/${id}`
    try{
        const data = await axios.get(URL,{
            headers: {
                Authorization: `Bearer ${getLocalStorage(LOCAL_STORAGE_TOKEN)}`, 
              },        
        })
        const res = data.data
        if(res.success === true) {
            return Promise.resolve({
                status: "success",
                data: res.data,
              });
        
        }
    } catch (err) {
        return Promise.resolve({
          status: "error",
          message: err.response,
        });
    }
}

export const search = async(values) => {
    const URL = `${BASE_API}/menu/`
}