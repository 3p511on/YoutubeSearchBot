'use strict';

const parseJSON = (string) => {
  try {
    return [null, JSON.parse(string)];
  } catch (err) {
    return [err, null];
  }
};

const parseCookies = (cookies) => {
  const cookiesReducer = (acc, cookie) => {
    const [key, value] = cookie.trim().split('=').map(decodeURIComponent);
    try {
      return Object.assign(acc, { [key]: JSON.parse(value) });
    } catch (err) {
      return Object.assign(acc, { [key]: value });
    }
  };
  return cookies.split(';').reduce(cookiesReducer, {});
};

const cookiesToString = (parsedCookies, decorator = ([key, value]) => `${key}=${value}`, separator = ';') =>
  Object.entries(parsedCookies).map(decorator).join(separator);

module.exports = { parseJSON, parseCookies, cookiesToString };
