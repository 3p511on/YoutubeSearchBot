'use strict';

const { fetch, makeRequestOptions } = require('../src/utilities/network');

const API_EXCHANGE = {
  host: 'openexchangerates.org',
  path: '/api/latest.json?app_id=',
  key: '1f43ea96b1e343fe94333dd2b97a109d',
};

const POST_TEST = {
  host: 'httpbin.org',
  path: '/anything',
};

const getRate = async (currency) => {
  const { host, path, key } = API_EXCHANGE;
  const url = `https://${host}/${path}${key}`;
  const data = await fetch(url);
  const rate = data.rates[currency];
  return rate;
};

const getRequestInfo = async (options) => {
  const { host, path } = POST_TEST;
  const url = `https://${host}${path}`;
  const data = await fetch(url, options);
  return data;
};

describe('fetch()', () => {
  test('GET request', async () => {
    const rate = await getRate('USD');
    expect(rate).toBe(1);
  });

  test('POST request with body and custom headers', async () => {
    const [method, body] = ['POST', { name: 'Aurelia', age: 43 }];
    const headers = { Authorization: 'Bearer sometoken' };
    const res = await getRequestInfo({ headers, body, method });
    expect(res.method).toBe(method);
    expect(res.headers.Authorization).toBe(headers.Authorization);
    expect(res.json).toEqual(body);
  });
});

describe('makeRequestOptions()', () => {
  test('simple request', () => {
    const url = 'https://google.com/search?q=metautil';
    const options = makeRequestOptions(url);
    const expected = {
      hostname: 'google.com',
      port: '',
      path: '/search?q=metautil',
      method: 'GET',
      headers: {},
    };
    expect(options).toEqual(expected);
  });

  test('complicated request', () => {
    const url = 'http://example.com/json?lang=ru';
    const options = { method: 'POST', body: { a: 1 }, headers: { Test: 'test' } };
    const reqOptions = makeRequestOptions(url, options);
    const expected = {
      hostname: 'example.com',
      port: '',
      path: '/json?lang=ru',
      method: 'POST',
      body: '{"a":1}',
      headers: {
        Test: 'test',
        'Content-Type': 'application/json',
        'Content-Length': 7,
      },
    };
    expect(reqOptions).toEqual(expected);
  });
});
