# haveibeenpwned

API methods for Have I been pwned (unofficial)

[![npm](https://img.shields.io/npm/v/haveibeenpwned.svg?maxAge=3600)](https://github.com/fvdm/nodejs-haveibeenpwned/blob/master/CHANGELOG.md)
[![Build Status](https://travis-ci.org/fvdm/nodejs-haveibeenpwned.svg?branch=master)](https://travis-ci.org/fvdm/nodejs-haveibeenpwned)
[![Coverage Status](https://coveralls.io/repos/github/fvdm/nodejs-haveibeenpwned/badge.svg?branch=master)](https://coveralls.io/github/fvdm/nodejs-haveibeenpwned?branch=master)
[![bitHound Dependencies](https://www.bithound.io/github/fvdm/nodejs-haveibeenpwned/badges/master/dependencies.svg)](https://www.bithound.io/github/fvdm/nodejs-haveibeenpwned/master/dependencies/npm)
[![bitHound Code](https://www.bithound.io/github/fvdm/nodejs-haveibeenpwned/badges/master/code.svg)](https://www.bithound.io/github/fvdm/nodejs-haveibeenpwned/master/files)
[![Greenkeeper badge](https://badges.greenkeeper.io/fvdm/nodejs-haveibeenpwned.svg)](https://greenkeeper.io/)


* [Node.js](https://nodejs.org)
* [Have I been pwned](https://haveibeenpwned.com)
* [API documentation](https://haveibeenpwned.com/API/v2)


# Example

```js
const hibp = require ('haveibeenpwned') ();

hibp.breachedAccount ('foo@bar.com', (err, data) => {
  if (err) {
    return console.log (err);
  }

  console.log (data);
});
```


# Installation

`npm i haveibeenpwned`


# Configuration

name    | type   | required | default | description
:-------|:-------|:---------|:--------|:--------------------------
timeout | number | no       | 5000    | Request wait timeout in ms


```js
const pwned = require ('haveibeenpwned') ({
  timeout: 10000
});
```


## .breachedAccount

**( account, [params], callback )**

All breaches for an account.


argument | type     | required | description
:--------|:---------|:---------|:--------------------------------
account  | string   | yes      | Email or username to check
params   | object   | no       | Additional parameters to include
callback | function | yes      | `function (err, data) {}`


```js
hibp.breachedAccount ('foo@bar.com', yourCallback);
```

[Example output](https://haveibeenpwned.com/api/v2/breachedaccount/foo@bar.com)


## .breaches

**( [params], callback )**

All breaches in the system.


argument | type     | required | description
:--------|:---------|:---------|:--------------------------------
params   | object   | no       | Additional parameters to include
callback | function | yes      | `function (err, data) {}`


```js
hibp.breaches (yourCallback);
```

[Example output](https://haveibeenpwned.com/api/v2/breaches)


## .breach

**( name, [params], callback )**

A single breached site.


argument | type     | required | description
:--------|:---------|:---------|:-----------------------------------
name     | string   | yes      | Site name to check, i.e. `linkedin`
params   | object   | no       | Additional parameters to include
callback | function | yes      | `function (err, data) {}`


```js
hibp.breach ('Adobe', yourCallback);
```

[Example output](https://haveibeenpwned.com/api/v2/breach/Adobe)


## .pasteAccount

**( account, callback )**

All pastes for an account.


argument | type     | required | description
:--------|:---------|:---------|:--------------------------
account  | string   | yes      | Email or username to check
callback | function | yes      | `function (err, data) {}`


```js
hibp.pasteAccount ('foo@bar.com', yourCallback);
```

[Example output](https://haveibeenpwned.com/api/v2/pasteaccount/foo@bar.com)


## .dataclasses

**( callback )**

All pastes for an account.


argument | type     | required | description
:--------|:---------|:---------|:-------------------------
callback | function | yes      | `function (err, data) {}`


```js
hibp.dataclasses (yourCallback);
```

[Example output](https://haveibeenpwned.com/api/v2/dataclasses)


# Unicense

This is free and unencumbered software released into the public domain.

Anyone is free to copy, modify, publish, use, compile, sell, or
distribute this software, either in source code form or as a compiled
binary, for any purpose, commercial or non-commercial, and by any
means.

In jurisdictions that recognize copyright laws, the author or authors
of this software dedicate any and all copyright interest in the
software to the public domain. We make this dedication for the benefit
of the public at large and to the detriment of our heirs and
successors. We intend this dedication to be an overt act of
relinquishment in perpetuity of all present and future rights to this
software under copyright law.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR
OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

For more information, please refer to <http://unlicense.org>


# Author

[Franklin van de Meent](https://frankl.in)

[![Buy me a coffee](https://frankl.in/u/kofi/kofi-readme.png)](https://ko-fi.com/franklin)
