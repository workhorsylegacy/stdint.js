stdint.js
=========

A JavaScript library for various fixed width integer types. All types are stored on a pre allocated heap.

The following types are supported:

* s8 - Signed 8 bit
* s16 - Signed 16 bit
* s32 - Signed 32 bit
* u8 - Unsigned 8 bit
* u16 - Unsigned 16 bit
* u32 - Unsigned 32 bit


Example
-----

    var a = new_u8(5);  // create a new u8 variable with a value of 5
    u8[a] = 7;          // set it to 7
    console.log(u8[a]); // get the value and print it

    // Any functions that create variables should be marked with uses_stdint
    example = uses_stdint(function() {
        var b = new_u32(3);
        console.log(u32[b]);
    });

    // The variable b will be added to the heap when the function 
    // starts, then automatically removed when it exits
    example();
