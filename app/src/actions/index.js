import api from '../utils/api';
import jwt from "jsonwebtoken";

export const SIGNUP_USER = "LOGIN_USER";
export const LOGIN_USER = "LOGIN_USER";
export const LOGOUT_USER = "LOGIN";

export const signupUser = (cred) => {
  return dispatch => {
    var formData = new FormData();
    formData.append("username", cred.username);
    formData.append("password", cred.password);

    fetch(api.BASE_URL + "signup", {
      method: 'POST',
      body: formData
    }).then(r => r.json()).then(json => {
      const jwtData = jwt.decode(json.token);
      console.log(jwtData);
      if (!jwtData) {
        return;
      }

      sessionStorage.setItem('token', json.token);
      dispatch({
        type: SIGNUP_USER,
        userData: {
          name: jwtData.name,
          username: jwtData.username,
        }
      })
    })
  }
}

export const loginUser = (cred) => {
  return dispatch => {
    var formData = new FormData();
    formData.append("username", cred.username);
    formData.append("password", cred.password);

    fetch(api.BASE_URL + "login", {
      method: 'POST',
      body: formData
    }).then(r => r.json()).then(json => {
      const jwtData = jwt.decode(json.token);
      console.log(jwtData);
      if (!jwtData) {
        return;
      }
      sessionStorage.setItem('token', json.token);
      dispatch({
        type: LOGIN_USER,
        userData: {
          name: jwtData.name,
          username: jwtData.username,
        }
      })
    })
  }
}




