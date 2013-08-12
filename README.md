stdint.js
=========

A JavaScript library for 8, 16, and 32 bit integer types. All types are stored on a pre allocated heap.

The following types are supported:

* s8 - Signed 8 bit
* s16 - Signed 16 bit
* s32 - Signed 32 bit
* u8 - Unsigned 8 bit
* u16 - Unsigned 16 bit
* u32 - Unsigned 32 bit


Example
-----

    // Print sizes of the u8 type
    console.log('u8 is ' + u8.size + ' byte.');
    console.log('u8 min is ' + u8.min + '.');
    console.log('u8 max is ' + u8.max + '.');

    // Create a u8 named 'a' and set and get its value
    u8.create('a', 5);
    u8.a = 7;
    console.log(u8.a);

    // Any functions that create variables should be marked with uses_stdint
    var example = uses_stdint(function() {
        u32.create('b', 3);
        console.log(u32.b);
    });

    // Thanks to uses_stdint the variable b will be added to the heap when 
    // the function starts, then automatically removed when it exits.
    example();
