/*
Name:         haveibeenpwned - index.js
Description:  API methods for HaveIBeenPwnd.com (unofficial)
Author:       Franklin van de Meent (https://frankl.in)
Source code:  https://github.com/fvdm/nodejs-haveibeenpwned
Feedback:     https://github.com/fvdm/nodejs-haveibeenpwned/issues
License:      Unlicense (public domain, see LICENSE file)
*/


const httpreq = require ('httpreq');

let config = {
  timeout: 5000,
  userAgent: 'nodejs-haveibeenpwned (https://github.com/fvdm/nodejs-haveibeenpwned)'
};


/**
 * Sort an object by its values
 * in descending order
 *
 * @return  {object}       The sorted object
 * @param   {object}  obj  The object to sort
 */

function sortObjectByValues (obj) {
  let sorting = [];
  let result = {};
  let key;

  for (key in obj) {
    sorting.push ({ key, count: obj [key] });
  }

  sorting.sort ((a, b) => {
    if (a.count > b.count) {
      return -1;
    }

    if (a.count < b.count) {
      return 1;
    }

    return 0;
  });

  sorting.forEach (itm => {
    result [itm.key] = itm.count;
  });

  return result;
}


/**
 * Process API error
 *
 * @callback  callback
 * @return    {void}
 *
 * @param     {object}    res       httpreq response details
 * @param     {Error}     err       Additional Error to include
 * @param     {function}  callback  `(err, data)`
 */

function processApiError (res, err, callback) {
  let error = new Error ('API error');

  error.statusCode = res.statusCode;
  error.body = res.body;
  error.error = err;
  callback (error);
}


/**
 * Process HTTP response
 *
 * @callback  callback
 * @return    {void}
 *
 * @param     {Error|null}  err       httpreq error
 * @param     {object}      res       httpreq response details
 * @param     {function}    callback  `(err, data)`
 */

function processResponse (err, res, callback) {
  let data;
  let error;

  if (err) {
    return callback (err);
  }

  if (res.statusCode === 404) {
    error = new Error ('not found');
    error.statusCode = res.statusCode;
    return callback (error);
  }

  try {
    data = JSON.parse (res.body);
  } catch (e) {
    return processApiError (res, e, callback);
  }

  return callback (null, data);
}


/**
 * Send HTTP request to API
 *
 * @callback  callback
 * @return    {void}
 *
 * @param     {string}     service   API service name
 * @param     {string}     method    API service method name
 * @param     {object}     [params]  Additional parameters to include
 * @param     {function}   callback  `(err, data)`
 */

function httpRequestHIBP (service, method, params, callback) {
  let options = {
    url: 'https://haveibeenpwned.com/api/v2/' + service + '/' + method,
    method: 'GET',
    timeout: config.timeout,
    headers: {
      'User-Agent': config.userAgent
    }
  };

  if (typeof params === 'function') {
    callback = params;
    params = {};
  }

  options.parameters = params;

  httpreq.doRequest (options, (err, res) => {
    processResponse (err, res, callback);
  });
}


/**
 * All breaches for an account
 *
 * @callback  callback
 * @return    {void}
 *
 * @param     {string}    account   Email or username
 * @param     {object}    [params]  Additional parameters to include
 * @param     {function}  callback  `(err, data)`
 */

function methodBreachedAccount (account, params, callback) {
  httpRequestHIBP ('breachedaccount', account, params, callback);
}


/**
 * All breached sites in the system
 *
 * @callback  callback
 ^ @return    {void}
 *
 * @param     {object}    [params]  Additional parameters to include
 * @param     {function}  callback  `(err, data)`
 */

function methodBreaches (params, callback) {
  httpRequestHIBP ('breaches', '', params, callback);
}


/**
 * A single breached site
 *
 * @callback  callback
 * @return    {void}
 *
 * @param     {string}    name      Email or username
 * @param     {function}  callback  `(err, data)`
 */

function methodBreach (name, callback) {
  httpRequestHIBP ('breach', name, callback);
}


/**
 * All pastes for an account
 *
 * @callback  callback
 * @return    {void}
 *
 * @param     {string}    amount    Email or username
 * @param     {function}  callback  `(err, data)`
 */

function methodPasteAccount (account, callback) {
  httpRequestHIBP ('pasteaccount', account, callback);
}


/**
 * All data classes in the system
 *
 * @callback  callback
 * @return    {void}
 *
 * @param     {function}  callback  `(err, data)`
 */

function methodDataclasses (callback) {
  httpRequestHIBP ('dataclasses', '', callback);
}


/**
 * Send HTTP request to API
 *
 * @callback  callback
 * @return    {void}
 *
 * @param     {string}     path      API method path
 * @param     {object}     [params]  Additional parameters to include
 * @param     {function}   callback  `(err, data)`
 */

function httpRequestPP (path, params, callback) {
  let options = {
    url: 'https://api.pwnedpasswords.com/' + path,
    method: 'GET',
    timeout: config.timeout,
    headers: {
      'User-Agent': config.userAgent
    }
  };

  if (typeof params === 'function') {
    callback = params;
    params = {};
  }

  options.parameters = params;

  httpreq.doRequest (options, (err, res) => {
    let error;
    let msg;

    if (err) {
      callback (err);
    } else if (res.statusCode === 404) {
      callback (null, 0);
    } else if (res.statusCode >= 300) {
      msg = res.body
        .replace (/.+<p>(.+)<\/p>.+/, '$')
        .trim();
      error = new Error (msg);
      error.statusCode = res.statusCode;
      error.body = res.body;

      callback (error);
    } else {
      callback (null, res.body);
    }
  });
}


/**
 * Search the Pwned Passwords database for a password
 *
 * Password not found: callback `data` is {int} `0`
 * Password found:     callback `data` is {int} amount
 *
 * @callback  callback
 * @return    {void}
 *
 * @param     {string}    password  Password to check
 * @param     {bool}      [hashed]  Is the password already SHA-1 hashed
 * @param     {function}  callback  `(err, data)`
 */

function methodPwnedPasswordsByPassword (password, hashed, callback) {
  let params = {};

  if (typeof hashed === 'function') {
    callback = hashed;
    hashed = false;
  }

  if (hashed) {
    params.originalPasswordIsAHash = 'true';
  }

  httpRequestPP ('pwnedpassword/' + password, params, (err, data) => {
    if (err) {
      callback (err);
    } else {
      callback (null, parseInt (data, 10));
    }
  });
}


/**
 * Search the Pwned Passwords database for the first 5 chars of a hash
 * and callback the matched hashed with their counts.
 *
 * Not found: callback `data` is {int} `0`
 * Found:     callback `data` is {object}
 *
 * @callback  callback
 * @return    {void}
 *
 * @param     {string}    hash      SHA-1 hash to check
 * @param     {bool}      [sort]    Sort by counts in descending order
 * @param     {function}  callback  `(err, data)`
 */

function methodPwnedPasswordsByRange (hash, sort, callback) {
  hash = hash.substr (0, 5);

  if (typeof sort === 'function') {
    callback = sort;
    sort = false;
  }

  httpRequestPP ('range/' + hash, (err, data) => {
    let result = {};
    let i;
    let str;
    let sha;

    if (err) {
      callback (err);
      return;
    }

    data = data.trim().split ('\n');

    if (data.length) {
      for (i = 0; i < data.length; i++) {
        str = data[i].split (':');
        sha = str[0].toLowerCase();
        result[sha] = parseInt (str[1], 10);
      }

      if (sort) {
        result = sortObjectByValues (result);
      }

      callback (null, result);
      return;
    }

    callback (null, 0);
  });
}


/**
 * Module interface
 *
 * @return  {object}                      Methods
 *
 * @param   {object}  set                 Configuration params
 * @param   {int}     [set.timeout=5000]  Wait timeout in ms
 */

module.exports = set => {
  if (set && set.timeout) {
    config.timeout = set.timeout;
  }

  return {
    breachedAccount: methodBreachedAccount,
    breaches: methodBreaches,
    breach: methodBreach,
    pasteAccount: methodPasteAccount,
    dataclasses: methodDataclasses,
    pwnedpasswords: {
      byPassword: methodPwnedPasswordsByPassword,
      byRange: methodPwnedPasswordsByRange
    }
  };
};
