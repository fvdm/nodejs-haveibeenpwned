haveibeenpwned
==============

API methods for HaveIBeenPwnd.com (unofficial)

[![npm](https://img.shields.io/npm/v/haveibeenpwned.svg?maxAge=3600)](https://github.com/fvdm/nodejs-haveibeenpwned/blob/master/CHANGELOG.md)
[![Build Status](https://travis-ci.org/fvdm/nodejs-haveibeenpwned.svg?branch=master)](https://travis-ci.org/fvdm/nodejs-haveibeenpwned)
[![Dependency Status](https://gemnasium.com/badges/github.com/fvdm/nodejs-haveibeenpwned.svg)](https://gemnasium.com/github.com/fvdm/nodejs-haveibeenpwned#development-dependencies)
[![Coverage Status](https://coveralls.io/repos/github/fvdm/nodejs-haveibeenpwned/badge.svg?branch=master)](https://coveralls.io/github/fvdm/nodejs-haveibeenpwned?branch=master)


Example
-------

```js
var pwned = require ('haveibeenpwned') ();

pwned.breachedAccount ('foo@bar.com', function (err, data) {
  if (err) {
    return console.log (err);
  }

  console.log (data);
});
```


Installation
------------

`npm install haveibeenpwned --save`


Configuration
-------------

name    | type   | required | default | description
:-------|:-------|:---------|:--------|:--------------------------
timeout | number | no       | 5000    | Request wait timeout in ms


```js
var pwned = require ('haveibeenpwned') ({
  timeout: 10000
});
```


.breachedAccount
----------------
**( account, [params], callback )**

All breaches for an account.


argument | type     | required | description
:--------|:---------|:---------|:--------------------------------
account  | string   | yes      | Email or username to check
params   | object   | no       | Additional parameters to include
callback | function | yes      | `function (err, data) {}`


```js
pwned.breachedAccount ('foo@bar.com', yourCallback);
```


.breaches
---------
**( [params], callback )**

All breaches in the system.


argument | type     | required | description
:--------|:---------|:---------|:--------------------------------
params   | object   | no       | Additional parameters to include
callback | function | yes      | `function (err, data) {}`


```js
pwned.breaches (yourCallback);
```


.breach
-------
**( name, [params], callback )**

A single breached site.


argument | type     | required | description
:--------|:---------|:---------|:-----------------------------------
name     | string   | yes      | Site name to check, i.e. `linkedin`
params   | object   | no       | Additional parameters to include
callback | function | yes      | `function (err, data) {}`


```js
pwned.breach ('foo@bar.com', yourCallback);
```


.pasteAccount
-------------
**( account, callback )**

All pastes for an account.


argument | type     | required | description
:--------|:---------|:---------|:--------------------------
account  | string   | yes      | Email or username to check
callback | function | yes      | `function (err, data) {}`


```js
pwned.pasteAccount ('foo@bar.com', yourCallback);
```


.dataclasses
------------
**( callback )**

All pastes for an account.


argument | type     | required | description
:--------|:---------|:---------|:-------------------------
callback | function | yes      | `function (err, data) {}`


```js
pwned.dataclasses (yourCallback);
```


License
-------

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


Author
------

[Franklin van de Meent](https://frankl.in)
