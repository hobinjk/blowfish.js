var Blowfish = {
  /**
   * Initialize the module
   */
  initialize: function() {
    // Retrieve the crypt function from the emscripten module
    this.wrappedCrypt = Module.cwrap('crypt', 'void', ['string', 'number', 'number', 'number', 'number']);
    // Store the Module's free function
    this.free = Module._free ? Module._free : _free;
    this._ptr = -1;
  },

  /**
   * Encrypt or decrypt an input Array with the string key.
   * @param {string} key      Key to use in encryption
   * @param {Object} input    Array or Array-like input values
   * @param {boolean} encrypt Whether to encrypt (true) or decrypt (false)
   */
  crypt: function(key, input, encrypt) {
    var length = input.length;
    // Allocate an emscripten-heap array in which to store the input
    var inputPtr  = Module.allocate(input, 'i8', ALLOC_NORMAL);
    // Output in-place
    var outputPtr = inputPtr;
    // Do the encryption
    this.wrappedCrypt(key, inputPtr, outputPtr, length, encrypt ? 1 : 0);
    // Save the pointer to free on cleanup
    this._ptr = outputPtr;
    return Module.HEAPU8.subarray(outputPtr, outputPtr + length);
  },

  /**
   * Decrypt an input Array with the string key.
   * @param {string} key      Key to use in decryption
   * @param {Object} input    Array or Array-like input values
   */
  decrypt: function(key, input) {
    return this.crypt(key, input, false);
  },

  /**
   * Encrypt an input Array with the string key.
   * @param {string} key      Key to use in encryption
   * @param {Object} input    Array or Array-like input values
   */
  encrypt: function(key, input) {
    return this.crypt(key, input, true);
  },

  /**
   * Clean up the Blowfish module
   */
  cleanup: function() {
    // If there is memory to free, free it
    if(this._ptr >= 0)
      this.free(this._ptr);
  }
};

