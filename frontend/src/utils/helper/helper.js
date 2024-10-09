import { getLocalStorage } from "./localStorage";

const BASE_API = "http://localhost:8000"
const BASE_API_IMAGE = "http://localhost:8000/image"
const BASE_API_RECEIPT = "http://localhost:8000/receipt"

const LOCAL_STORAGE_TOKEN = "cafe/token";
const LOCAL_STORAGE_USER = "cafe/user";

const TOKEN = {
    headers: {
        Authorization: `Bearer ${getLocalStorage(LOCAL_STORAGE_TOKEN)}`
    }
}

export {BASE_API, BASE_API_IMAGE, BASE_API_RECEIPT, LOCAL_STORAGE_TOKEN, LOCAL_STORAGE_USER, TOKEN}