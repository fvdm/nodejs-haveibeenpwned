/*
Name:         haveibeenpwned - test.js
Description:  Unit tests for index.js
Author:       Franklin van de Meent (https://frankl.in)
Source code:  https://github.com/fvdm/nodejs-haveibeenpwned
Feedback:     https://github.com/fvdm/nodejs-haveibeenpwned/issues
License:      Unlicense (public domain, see LICENSE file)
*/


const dotest = require ('dotest');
const crypto = require ('crypto');
const app = require ('./');

const config = {
  timeout: process.env.Timeout || null
};

const pwned = app (config);

/**
 * Generate SHA-1 hash from a string
 *
 * @return  {string}       SHA-1 hash as hex string
 * @param   {mixed}   str  Data to hash
 */

function hashSha1 (str) {
  return crypto
    .createHash ('sha1')
    .update (str)
    .digest ('hex');
}


dotest.add ('Interface', test => {
  const pp = pwned && pwned.pwnedpasswords;

  test()
    .isFunction ('fail', 'exports', app)
    .isObject ('fail', 'interface', pwned)
    .isObject ('fail', '.pwnedpasswords', pp);

  if (pwned) {
    test()
      .isFunction ('fail', '.breachedAccount', pwned.breachedAccount)
      .isFunction ('fail', '.breaches', pwned.breaches)
      .isFunction ('fail', '.breach', pwned.breach)
      .isFunction ('fail', '.pasteAccount', pwned.pasteAccount)
      .isFunction ('fail', '.dataclasses', pwned.dataclasses);
  }

  if (pp) {
    test()
      .isFunction ('fail', '.pwnedpasswords.byPassword', pp && pp.byPassword)
      .isFunction ('fail', '.pwnedpasswords.byRange', pp && pp.byRange);
  }


  test().done();
});


dotest.add ('Method .breachedAccount - without params', test => {
  pwned.breachedAccount ('foo@bar.com', (err, data) => {
    const item = data && data [0];

    test (err)
      .isArray ('fail', 'data', data)
      .isNotEmpty ('fail', 'data', data)
      .isObject ('fail', 'data[0]', item)
      .isNotEmpty ('fail', 'data[0]', item)
      .done();
  });
});


dotest.add ('Method .breachedAccount - with params', test => {
  const params = {
    domain: 'acne.org'
  };

  pwned.breachedAccount ('foo@bar.com', params, (err, data) => {
    const item = data && data [0];

    test (err)
      .isArray ('fail', 'data', data)
      .isNotEmpty ('fail', 'data', data)
      .isObject ('fail', 'data[0]', item)
      .isNotEmpty ('fail', 'data[0]', item)
      .done();
  });
});


dotest.add ('Method .breaches - without params', test => {
  pwned.breaches ((err, data) => {
    const item = data && data [0];

    test (err)
      .isArray ('fail', 'data', data)
      .isNotEmpty ('fail', 'data', data)
      .isObject ('fail', 'data[0]', item)
      .isNotEmpty ('fail', 'data[0]', item)
      .done();
  });
});


dotest.add ('Method .breaches - with params', test => {
  const params = {
    domain: 'linkedin.com'
  };

  pwned.breaches (params, (err, data) => {
    const item = data && data [0];

    test (err)
      .isArray ('fail', 'data', data)
      .isNotEmpty ('fail', 'data', data)
      .isObject ('fail', 'data[0]', item)
      .isNotEmpty ('fail', 'data[0]', item)
      .done();
  });
});


dotest.add ('Method .breach', test => {
  pwned.breach ('LinkedIn', (err, data) => {
    test (err)
      .isObject ('fail', 'data', data)
      .isNotEmpty ('fail', 'data', data)
      .done();
  });
});


dotest.add ('Method .pasteAccount', test => {
  pwned.pasteAccount ('foo@bar.com', (err, data) => {
    const item = data && data [0];

    test (err)
      .isArray ('fail', 'data', data)
      .isNotEmpty ('fail', 'data', data)
      .isObject ('fail', 'data[0]', item)
      .isNotEmpty ('fail', 'data[0]', item)
      .done();
  });
});


dotest.add ('Method .dataclasses', test => {
  pwned.dataclasses ((err, data) => {
    const item = data && data [0];

    test (err)
      .isArray ('fail', 'data', data)
      .isString ('fail', 'data[0]', item)
      .isNotEmpty ('fail', 'data[0]', item)
      .done();
  });
});


dotest.add ('Error: not found', test => {
  pwned.breachedAccount ('info@invalid--example.net', (err, data) => {
    test()
      .isError ('fail', 'err', err)
      .isExactly ('fail', 'err.message', err && err.message, 'not found')
      .isExactly ('fail', 'err.statusCode', err && err.statusCode, 404)
      .isUndefined ('fail', 'data', data)
      .done();
  });
});


dotest.add ('Error: API error', test => {
  pwned.breachedAccount ('', (err, data) => {
    test()
      .isError ('fail', 'err', err)
      .isNumber ('fail', 'err.statusCode', err && err.statusCode)
      .isUndefined ('fail', 'data', data)
      .done();
  });
});


dotest.add ('Error: request timed out', test => {
  const tmp = app ({
    timeout: 1
  });

  tmp.dataclasses ((err, data) => {
    test()
      .isError ('fail', 'err', err)
      .isExactly ('fail', 'err.code', err && err.code, 'TIMEOUT')
      .isUndefined ('fail', 'data', data)
      .done();
  });
});


dotest.run (2000);
