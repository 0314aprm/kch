import { combineReducers } from 'redux';
import {SIGNUP_USER, LOGIN_USER, LOGOUT_USER} from '../actions';

const userData = function (state={}, action) {
  switch (action.type) {
    case SIGNUP_USER:
    case LOGIN_USER:
      const data = action.userData;
      return Object.assign({}, state, {
        name: data.name,
        username: data.username,
      });
    case LOGOUT_USER:
  }
  return state;
}

const rootReducer = combineReducers({
  userData
})


export default rootReducer