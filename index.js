/*
Name:         haveibeenpwned - index.js
Description:  API methods for HaveIBeenPwnd.com (unofficial)
Author:       Franklin van de Meent (https://frankl.in)
Source code:  https://github.com/fvdm/nodejs-haveibeenpwned
Feedback:     https://github.com/fvdm/nodejs-haveibeenpwned/issues
License:      Unlicense (public domain, see LICENSE file)
*/


var httpreq = require ('httpreq');

var config = {
  timeout: 5000,
  userAgent: 'nodejs-haveibeenpwned (https://github.com/fvdm/nodejs-haveibeenpwned)'
};


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
  var error = new Error ('API error');

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
  var data;
  var error;

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
  var options = {
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

  function doResponse (err, res) {
    processResponse (err, res, callback);
  }

  httpreq.doRequest (options, doResponse);
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
 * Module interface
 *
 * @return  {object}                      Methods
 *
 * @param   {object}  set                 Configuration params
 * @param   {int}     [set.timeout=5000]  Wait timeout in ms
 */

module.exports = function (set) {
  config.timeout = set && set.timeout || config.timeout;

  return {
    breachedAccount: methodBreachedAccount,
    breaches: methodBreaches,
    breach: methodBreach,
    pasteAccount: methodPasteAccount,
    dataclasses: methodDataclasses
  };
};
