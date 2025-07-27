const { default: axios } = require("axios");

const app = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  withCredentials: true,
});

// accessToken => jwt => national-id => unique !  => user id => jwt => localStorage , cookie
// http only => no access on browser (js) => safe =>
// =>  id = 1234566 => jwt => AFDSFSLKAQTEWRLDAKSJFEQRERQWLRKJ3434DFSDF => COOKIES =>

// accessToken => 24 hrs =>
// refreshToken => 30 days =>

// 1. => access : OK => continue ...
// 2. => access : EXPIRE => 1. log out =>  ...  2. login => HOW ?? =>
//  based on refreshToken => create new accessToken => 24 hrs , 30 days => ...continue ...
// 3. refresh : EXPIRES => new login =>

app.interceptors.request.use(
  (res) => res,
  (err) => Promise.reject(err)
);

app.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalConfig = err.config;
    if (err.response.status === 401 && !originalConfig._retry) {
      originalConfig._retry = true;
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/user/refresh-token`,
          {
            withCredentials: true,
          }
        );
        if (data) return app(originalConfig);
      } catch (error) {
        return Promise.reject(error);
      }
    }
    return Promise.reject(err);
  }
);

const http = {
  get: app.get,
  patch: app.patch,
  put: app.put,
  delete: app.delete,
  post: app.post,
};

export default http;
