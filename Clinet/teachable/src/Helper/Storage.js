// COOKIES, LOCAL STORAGE

export const setAuthUser = (data, rememberMe) => {
  if (rememberMe) {
    localStorage.setItem("user", JSON.stringify(data));
  } else {
    sessionStorage.setItem("user", JSON.stringify(data));
  }
};


export const getAuthUser = () => {
  if (localStorage.getItem("user")) {
    return JSON.parse(localStorage.getItem("user"));
  } else if (sessionStorage.getItem("user")) {
    return JSON.parse(sessionStorage.getItem("user"));
  }
};


export const removeAuthUser = () => {
  if (localStorage.getItem("user")) localStorage.removeItem("user");
  if (sessionStorage.getItem("user")) sessionStorage.removeItem("user");
};

