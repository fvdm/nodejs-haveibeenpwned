/*
  Name:         haveibeenpwned - test.js
  Description:  Unit tests for index.js
  Author:       Franklin van de Meent (https://frankl.in)
  Source code:  https://github.com/fvdm/nodejs-haveibeenpwned
  Feedback:     https://github.com/fvdm/nodejs-haveibeenpwned/issues
  License:      Unlicense (public domain, see LICENSE file)
*/


var dotest = require ('dotest');
var app = require ('./');

var config = {
  timeout: process.env.Timeout || null
};

var pwned = app (config);


dotest.add ('Module', function (test) {
  test ()
    .isFunction ('fail', 'exports', app)
    .isObject ('fail', 'interface', pwned)
    .isFunction ('fail', '.breachedAccount', pwned && pwned.breachedAccount)
    .isFunction ('fail', '.breaches', pwned && pwned.breaches)
    .isFunction ('fail', '.breach', pwned && pwned.breach)
    .isFunction ('fail', '.pasteAccount', pwned && pwned.pasteAccount)
    .isFunction ('fail', '.dataclasses', pwned && pwned.dataclasses)
    .done ();
});


dotest.add ('Method .breachedAccount - without params', function (test) {
  pwned.breachedAccount ('foo@bar.com', function (err, data) {
    var item = data && data [0];

    test (err)
      .isArray ('fail', 'data', data)
      .isNotEmpty ('fail', 'data', data)
      .isObject ('fail', 'data[0]', item)
      .isNotEmpty ('fail', 'data[0]', item)
      .done ();
  });
});


dotest.add ('Method .breachedAccount - with params', function (test) {
  var params = {
    domain: 'acne.org'
  };

  pwned.breachedAccount ('foo@bar.com', params, function (err, data) {
    var item = data && data [0];

    test (err)
      .isArray ('fail', 'data', data)
      .isNotEmpty ('fail', 'data', data)
      .isObject ('fail', 'data[0]', item)
      .isNotEmpty ('fail', 'data[0]', item)
      .done ();
  });
});


dotest.add ('Method .breaches - without params', function (test) {
  pwned.breaches (function (err, data) {
    var item = data && data [0];

    test (err)
      .isArray ('fail', 'data', data)
      .isNotEmpty ('fail', 'data', data)
      .isObject ('fail', 'data[0]', item)
      .isNotEmpty ('fail', 'data[0]', item)
      .done ();
  });
});


dotest.add ('Method .breaches - with params', function (test) {
  var params = {
    domain: 'linkedin.com'
  };

  pwned.breaches (params, function (err, data) {
    var item = data && data [0];

    test (err)
      .isArray ('fail', 'data', data)
      .isNotEmpty ('fail', 'data', data)
      .isObject ('fail', 'data[0]', item)
      .isNotEmpty ('fail', 'data[0]', item)
      .done ();
  });
});


dotest.add ('Method .breach', function (test) {
  pwned.breach ('LinkedIn', function (err, data) {
    test (err)
      .isObject ('fail', 'data', data)
      .isNotEmpty ('fail', 'data', data)
      .done ();
  });
});


dotest.add ('Method .pasteAccount', function (test) {
  pwned.pasteAccount ('foo@bar.com', function (err, data) {
    var item = data && data [0];

    test (err)
      .isArray ('fail', 'data', data)
      .isNotEmpty ('fail', 'data', data)
      .isObject ('fail', 'data[0]', item)
      .isNotEmpty ('fail', 'data[0]', item)
      .done ();
  });
});


dotest.add ('Method .dataclasses', function (test) {
  pwned.dataclasses (function (err, data) {
    var item = data && data [0];

    test (err)
      .isArray ('fail', 'data', data)
      .isString ('fail', 'data[0]', item)
      .isNotEmpty ('fail', 'data[0]', item)
      .done();
  });
});


dotest.add ('Error: not found', function (test) {
  pwned.breachedAccount ('info@example.net', function (err, data) {
    test ()
      .isError ('fail', 'err', err)
      .isExactly ('fail', 'err.message', err && err.message, 'not found')
      .isExactly ('fail', 'err.statusCode', err && err.statusCode, 404)
      .isUndefined ('fail', 'data', data)
      .done ();
  });
});


dotest.add ('Error: API error', function (test) {
  pwned.breachedAccount ('', function (err, data) {
    test ()
      .isError ('fail', 'err', err)
      .isNumber ('fail', 'err.statusCode', err && err.statusCode)
      .isUndefined ('fail', 'data', data)
      .done ();
  });
});


dotest.add ('Error: request timed out', function (test) {
  var tmp = app ({
    timeout: 1
  });

  tmp.dataclasses (function (err, data) {
    test ()
      .isError ('fail', 'err', err)
      .isExactly ('fail', 'err.code', err && err.code, 'TIMEOUT')
      .isUndefined ('fail', 'data', data)
      .done ();
  });
});


dotest.run ();
