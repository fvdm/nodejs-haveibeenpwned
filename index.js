var httpreq = require ('httpreq');

var config = {
  timeout: 5000,
  userAgent: 'nodejs-haveibeenpwned (https://github.com/fvdm/nodejs-haveibeenpwned)'
};


/**
 * Process API error
 *
 * @callback callback
 * @param res {object} - httpreq response details
 * @param err {Error} - Additional Error to include
 * @param callback {function} - `function (err, data) {}`
 * @returns {void}
 */

function processApiError (res, err, callback) {
  var error = new Error ('API error')

  error.statusCode = res.statusCode;
  error.body = res.body;
  error.error = err;
  callback (error);
}


/**
 * Process HTTP response
 *
 * @callback callback
 * @param err {Error, null} - httpreq error
 * @param res {object} - httpreq response details
 * @param callback {function} - `function (err, data) {}`
 * @returns {void}
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
    callback (error);
    return;
  }

  try {
    data = JSON.parse (res.body);
  } catch (e) {
    processApiError (res, e, callback);
    return;
  }

  callback (null, data);
}


/**
 * Send HTTP request to API
 *
 * @callback callback
 * @param service {string} - API service name
 * @param param {string} - API service method name
 * @param [parameters] {object} - Additional parameters to include
 * @param callback {function} - `function (err, data) {}`
 * @returns {void}
 */

function httpRequest (service, param, parameters, callback) {
  var options = {
    url: 'https://haveibeenpwned.com/api/v2/' + service + '/' + param,
    method: 'GET',
    timeout: config.timeout,
    headers: {
      'User-Agent': config.userAgent
    }
  };

  if (typeof parameters === 'function') {
    callback = parameters;
    parameters = {};
  }

  options.parameters = parameters;

  function doResponse (err, res) {
    processResponse (err, res, callback);
  }

  httpreq.doRequest (options, doResponse);
}


/**
/**
 * All data classes in the system
 *
 * @callback callback
 * @param [params] {object} - Additional parameters to include
 * @param callback {function} - `function (err, data) {}`
 * @returns {void}
 */

function methodDataclasses (callback) {
  httpRequest ('dataclasses', '', callback);
}


 * Module interface
 *
 * @param [set] {object} - Configuration params
 * @param [set.timeout = 5000] {number} - Wait timeout in ms
 * @returns {object} - Methods
 */

module.exports = function (set) {
  config.timeout = set.timeout || config.timeout;

  return {
    dataclasses: methodDataclasses
  };
};
