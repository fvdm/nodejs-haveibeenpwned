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

const testPass = 'doesnt-exist,' + Date.now();


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


dotest.add ('Method .pwnedpassword.byPassword - plain, none found', test => {
  pwned.pwnedpasswords.byPassword (testPass, (err, data) => {
    test (err)
      .info ('Password: ' + testPass)
      .info (' ')
      .isNull ('fail', 'err', err)
      .isExactly ('fail', 'data', data, 0)
      .done();
  });
});


dotest.add ('Method .pwnedpasswords.byPassword - hashed, none found', test => {
  const hash = hashSha1 (testPass);

  pwned.pwnedpasswords.byPassword (hash, true, (err, data) => {
    test (err)
      .info ('Password: ' + testPass)
      .info ('Hash:     ' + hash)
      .info (' ')
      .isNull ('fail', 'err', err)
      .isExactly ('fail', 'data', data, 0)
      .done();
  });
});


dotest.add ('Method .pwnedpasswords.byPassword - plain, results', test => {
  pwned.pwnedpasswords.byPassword ('12345', (err, data) => {
    test (err)
      .info ('Password: 12345')
      .info (' ')
      .isNull ('fail', 'err', err)
      .isNumber ('fail', 'data', data)
      .isCondition ('fail', 'data', data, '>', 0)
      .done();
  });
});


dotest.add ('Method .pwnedpasswords.byRange - results', test => {
  const hash = hashSha1 ('12345');

  pwned.pwnedpasswords.byRange (hash, (err, data) => {
    const item = data && data['37d0679ca88db6464eac60da96345513964'];

    test (err)
      .info ('Password: 12345')
      .info ('Hash:     ' + hash)
      .info ('Item:     37d0679ca88db6464eac60da96345513964')
      .info (' ')
      .isNull ('fail', 'err', err)
      .isObject ('fail', 'data', data)
      .isNumber ('fail', 'data[item]', item)
      .isCondition ('fail', 'data[item]', item, '>', 0)
      .done();
  });
});


dotest.add ('Method .pwnedpasswords.byRange - sorted', test => {
  const hash = hashSha1 ('12345');

  pwned.pwnedpasswords.byRange (hash, true, (err, data) => {
    const item = data && data['37d0679ca88db6464eac60da96345513964'];
    const values = Object.keys (data).map (key => {
      return data [key];
    });
    const first = values.shift();
    const second = values.shift();
    const third = values.shift();

    test (err)
      .info ('Password: 12345')
      .info ('Hash:     ' + hash)
      .info ('Item:     37d0679ca88db6464eac60da96345513964')
      .info (' ')
      .isNull ('fail', 'err', err)
      .isObject ('fail', 'data', data)
      .isNumber ('fail', 'data[item]', item)
      .isCondition ('fail', 'data[item]', item, '>', 0)
      .isCondition ('fail', 'order 1 vs 2', first, '>', second)
      .isCondition ('fail', 'order 2 vs 3', second, '>', third)
      .done();
  });
});


dotest.add ('Error: invalid hash prefix', test => {
  pwned.pwnedpasswords.byRange ('test', (err, data) => {
    test ()
      .isError ('fail', 'err', err)
      .isExactly ('warn', 'err.message', err && err.message, 'The hash prefix was not in a valid format')
      .isUndefined ('fail', 'data', data)
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


dotest.add ('Error: request timed out - haveibeenpwned API', test => {
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


dotest.add ('Error: request timed out - pwnedpasswords API', test => {
  const tmp = app ({
    timeout: 1
  });

  tmp.pwnedpasswords.byPassword ('test', (err, data) => {
    test()
      .isError ('fail', 'err', err)
      .isExactly ('fail', 'err.code', err && err.code, 'TIMEOUT')
      .isUndefined ('fail', 'data', data)
      .done();
  });
});


dotest.run (2000);
