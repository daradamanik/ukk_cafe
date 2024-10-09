import axios from "axios";
import { BASE_API, LOCAL_STORAGE_TOKEN } from "../../../../utils/helper/helper";
import { getLocalStorage } from "../../../../utils/helper/localStorage";

export const getAllMeja = async () => {
  const URL = `${BASE_API}/meja/getAll`;
  try {
    const data = await axios.get(URL, {
      headers: {
        Authorization: `Bearer ${getLocalStorage(LOCAL_STORAGE_TOKEN)}`,
      },
    });
    const res = data.data;
    if (res.success === true) {
      return Promise.resolve({
        success: true,
        data: res.data,
      });
    }
  } catch (error) {
    return Promise.resolve({
      success: false,
      message: error.res.data.message,
    });
  }
};

export const getMejaByID = async (id) => {
  const URL = `${BASE_API}/meja/getID/${id}`;
  try {
    const data = await axios.get(URL, {
      headers: {
        Authorization: `Bearer ${getLocalStorage(LOCAL_STORAGE_TOKEN)}`,
      },
    });
    const res = data.data;
    if (res.success === true) {
      return Promise.resolve({
        success: true,
        data: res.data,
      });
    }
  } catch (error) {
    return Promise.resolve({
      success: false,
      message: error.res.data.message,
    });
  }
};

export const searchMeja = async (nomor_meja) => {
  const URL = `${BASE_API}/meja/search/${nomor_meja}`;
  try {
    const data = await axios.get(URL, {
      headers: {
        Authorization: `Bearer ${getLocalStorage(LOCAL_STORAGE_TOKEN)}`,
      },
    });
    const res = data.data;
    if (res.success === true) {
      return Promise.resolve({
        success: true,
        data: res.data,
      });
    }
  } catch (error) {
    return Promise.resolve({
      success: false,
      message: error.res.data.message,
    });
  }
};

export const addMeja = async (values) => {
  const URL = `${BASE_API}/meja/add`;
  try {
    const data = await axios.post(URL, values, {
      headers: {
        Authorization: `Bearer ${getLocalStorage(LOCAL_STORAGE_TOKEN)}`,
      },
    });
    const res = data.data;
    if (res.success === true) {
      return Promise.resolve({
        success: true,
        message: "success adding a table",
        data: res.data,
      });
    }
  } catch (error) {
    return Promise.resolve({
      success: false,
      message: error.res.data.message,
    });
  }
};

export const updateMeja = async (values, id) => {
  const URL = `${BASE_API}/meja/update/${id}`;
  try {
    const data = await axios.put(URL, values, {
      headers: {
        Authorization: `Bearer ${getLocalStorage(LOCAL_STORAGE_TOKEN)}`,
      },
    });
    const res = data.data;
    if (res.success === true) {
      return Promise.resolve({
        success: true,
        message: "success editing a table",
        data: res.data,
      });
    }
  } catch (error) {
    return Promise.resolve({
      success: false,
      message: error.res.data.message,
    });
  }
};

export const deleteMeja = async (id) => {
  const URL = `${BASE_API}/meja/delete/${id}`;
  try {
    const data = await axios.delete(URL, {
      headers: {
        Authorization: `Bearer ${getLocalStorage(LOCAL_STORAGE_TOKEN)}`,
      },
    });
    const res = data.data;
    if (res.success === true) {
      return Promise.resolve({
        success: true,
        message: "success deleting a table",
        data: res.data,
      });
    }
  } catch (error) {
    return Promise.resolve({
      success: false,
      message: error.res.data.message,
    });
  }
};
