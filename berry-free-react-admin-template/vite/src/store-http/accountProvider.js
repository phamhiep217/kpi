import axios from 'axios';
import configData from '../config';
// Base URL of your API

const api = axios.create({
  baseURL: configData.API_SERVER,
});

//Action
export const loginRequest = () => ({
  type: 'LOGIN_REQUEST',
});

export const loginSuccess = (userData) => ({
  type: 'LOGIN_SUCCESS',
  payload: userData,
});

export const loginFailure = (error) => ({
  type: 'LOGIN_FAILURE',
  payload: error,
});


export const loginUser = (credentials) => {
  return async (dispatch) => {
    dispatch(loginRequest());
    try {
      const response = await api.post('/users/login', credentials);
      dispatch(loginSuccess(response.data));
      // Có thể lưu token vào local storage hoặc thực hiện các hành động khác sau khi đăng nhập thành công
    } catch (error) {
      // Kiểm tra xem error có phải là một đối tượng axios error hay không
      if (error.isAxiosError && error.response) {
        // Nếu có response từ server (lỗi 400), lấy thông báo từ response.data
        dispatch(loginFailure(error.response.data));
      } else {
        // Nếu không phải lỗi axios hoặc không có response, dispatch lỗi chung
        dispatch(loginFailure({ msg: error.message || 'Đã có lỗi xảy ra.' }));
      }
    }
  };
};




