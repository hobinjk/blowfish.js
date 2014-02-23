blowfish.js
===========
An Emscripten-ized wrapper for simple and fast Blowfish encryption.

Basic usage
-----------
Use any array-like as input, magic will occur! (hopefully)
```js
  var key = "super-secret-password";
  var data = "the sleigh's name was rosebud!";
  Blowfish.initialize();
  var encrypted = Blowfish.encrypt(key, data);
```
