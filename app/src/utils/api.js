const API_DOMAIN = "localhost:1323";
const BASE_URL = "http://" + API_DOMAIN + "/";

function get(url, params) {
  var new_url = new URL(BASE_URL + url);
  if (params) Object.keys(params).forEach(key => new_url.searchParams.append(key, params[key]))
  return fetch(new_url, {
    method: 'GET'
  }).then(r => r.json())
}
function post(url, data) {
  var new_url = new URL(BASE_URL + url);
  return fetch(new_url, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(data)
  }).then(r => r.json())
}
function del(url, params) {
  var new_url = new URL(BASE_URL + url);
  if (params) Object.keys(params).forEach(key => new_url.searchParams.append(key, params[key]))
  return fetch(new_url, {
    method: 'DELETE'
  }).then(r => r.json())
}

export default {
  API_DOMAIN,
  BASE_URL,
  login: (id, data) => post("users/" + id, data),
  logout: (id, data) => post("users/" + id, data),
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

