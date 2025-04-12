export const DASHBOARD_PATH = '/sample-page';

let BACKEND_SERVER = null;
if (import.meta.env.VITE_REACT_APP_BACKEND_SERVER) {
  BACKEND_SERVER = import.meta.env.VITE_REACT_APP_BACKEND_SERVER;
} else {
  BACKEND_SERVER = "http://localhost:5000/api/";
  //BACKEND_SERVER = "http://192.168.10.16:5000/api/";
}

const config = {
  basename: '',
  fontFamily: `'Roboto', sans-serif`,
  borderRadius: 8,
  API_SERVER: BACKEND_SERVER
};

export default config;