const API_DOMAIN = "localhost:1323";
const BASE_URL = "http://" + API_DOMAIN + "/";

function req(url, data, auth = false) {
  if (auth) {
    const token = sessionStorage.getItem('token');
    if (token) {
      data.headers['Authorization'] = "Bearer " + token;
      data.mode = "cors";
    }
  }
  return fetch(url, data);
}

function get(url, params, auth = false) {
  var new_url = new URL(BASE_URL + url);
  if (params) Object.keys(params).forEach(key => new_url.searchParams.append(key, params[key]))
  return req(new_url, {
    method: 'GET'
  }, auth).then(r => r.json())
}
function post(url, data, auth = false) {
  var new_url = new URL(BASE_URL + url);
  return req(new_url, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(data)
  }, auth).then(r => r.json())
}
function del(url, params, auth = false) {
  var new_url = new URL(BASE_URL + url);
  if (params) Object.keys(params).forEach(key => new_url.searchParams.append(key, params[key]))
  return req(new_url, {
    method: 'DELETE'
  }, auth).then(r => r.json())
}

export default {
  API_DOMAIN,
  BASE_URL,
  testAuth: () => post("me", {}, true),
  user: {
    list: (params) => get("users", params),
    get: (id) => get("users/" + id),
    create: (id, data) => post("users/" + id, data),
    delete: (id) => del("users/" + id),
  },
  post: {
    list: (params) => get("posts", params),
    get: (id) => get("posts/" + id),
    getChildren: (id, params) => get("posts/" + id + "/children", params),
    create: (id, data) => post("posts/" + id, data),
    delete: (id) => del("posts/" + id),
  }
};

