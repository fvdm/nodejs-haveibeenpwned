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


# Have I Been Pwned

Below are the methods for the main Have I Been Pwned API.

For simplicity no error handling is included in the callback examples.
It's straightforward: when there is a problem `err` is an instance of
_Error_ and `data` is _undefined_, otherwise `err` is _null_ and
`data` is set to the result.


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


# Pwned Passwords

Below are the methods for the Pwned Passwords API.


## .pwnedpasswords.byPassword

**( password, [hashed], callback )**

Check if a password was leaked.
The `data` is `0` (int) when none were found.


argument | type     | default | description
:--------|:---------|:--------|:---------------------
password | string   |         | The password to check
hashed   | bool     | false   | Is the password already SHA-1 hashed
callback | function |         | `(err, data)`



```js
hibp.pwnedpasswords.byPassword ('secret', (err, count) => {
  if (!count) {
    console.log ('Great! Password is not found.');
  } else {
    console.log ('Oops! Password was found ' + count + ' times!');
  }
});

// -> Oops! Password was found 195263 times!
```


## .pwnedpasswords.byRange

**( hash, [sort], callback )**

Get password hashes similar to the first 5 characters of the SHA-1 hash
provided. The callback `data` is an *object* where the keys are the
lowercase hashes and the values are the number of times they were used.
When nothing is found `data` is `0` (int).

A hash longer then 5 characters is truncated before being sent to the API
and can be in uppercase or lowercase.


argument | type     | default | description
:--------|:---------|:--------|:-----------------------
hash     | string   |         | The SHA-1 hash to check
sort     | bool     | false   | Sort by counts in descending order
callback | function |         | `(err, data)`


### Sorted by key (default)

```js
hibp.pwnedpasswords.byRange ('abcdef', (err, data) => {
  for (sha in data) {
    console.log ('%s  %i x', sha, data[sha]);
  }
});
```


### Sorted by use counts

```js
hibp.pwnedpasswords.byRange ('abcdef', true, (err, data) => {
  const count = Object.keys (data).length;
  let i = 1;

  console.log ('Found %i matches', count);
  console.log ('Top 3:');

  for (sha in data) {
    console.log ('%i  %s  %i x', i, sha, data[sha]);

    // stop after 3
    if (i === 3) { break; }
    i++;
  }
});

// ->
// Found 511 matches
// Top 3:
// 1  3b8a55c2b3bf42b83e41f0f95a4149043f6  336 x
// 2  6a7fc410810db77855d9dfe5b94b95196f7  304 x
// 3  73a1a21a7b13b50536df19fd586abdf3145  193 x
```


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
