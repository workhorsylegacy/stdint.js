
module( "stdint.js", {
	setup: function() {
		reset_stdint();
	},

	teardown: function() {
		reset_stdint();
	}
});

test( "Type sizes", function() {
	equal( s8.size, 1);
	equal( s16.size, 2);
	equal( s32.size, 4);

	equal( u8.size, 1);
	equal( u16.size, 2);
	equal( u32.size, 4);
});

test( "Type max", function() {
	equal( s8.max, 127);
	equal( s16.max, 32767);
	equal( s32.max, 2147483647);

	equal( u8.max, 255);
	equal( u16.max, 65535);
	equal( u32.max, 4294967295);
});

test( "Type min", function() {
	equal( s8.min, -128);
	equal( s16.min, -32768);
	equal( s32.min, -2147483648);

	equal( u8.min, 0);
	equal( u16.min, 0);
	equal( u32.min, 0);
});

test( "u8", function() {
	// Default value
	u8.create('a');
	equal( u8.a, 0, "Default value");

	// Assignment
	u8.create('a', 77);
	equal( u8.a, 77, "Assignment");

	// Max
	u8.create('a', 255);
	equal( u8.a, 255, "Max");

	// Overflow
	u8.a += 10;
	equal( u8.a, 9, "Overflow");

	// Negative
	u8.a = -40;
	equal( u8.a, u8.max-39, "Negative");
});

test( "u16", function() {
	// Default value
	u16.create('a');
	equal( u16.a, 0, "Default value");

	// Assignment
	u16.a = 88;
	equal( u16.a, 88, "Assignment");

	// Max
	u16.a = 65535;
	equal( u16.a, 65535, "Max");

	// Overflow
	u16.a += 20;
	equal( u16.a, 19, "Overflow");

	// Negative
	u16.a = -80;
	equal( u16.a, u16.max-79, "Negative");
});

test( "u32", function() {
	// Default value
	u32.create('a');
	equal( u32.a, 0, "Default value");

	// Assignment
	u32.a = 99;
	equal( u32.a, 99, "Assignment");

	// Max
	u32.a = 4294967295;
	equal( u32.a, 4294967295, "Max");

	// Overflow
	u32.a += 30;
	equal( u32.a, 29, "Overflow");

	// Negative
	u32.a = -120;
	equal( u32.a, u32.max-119, "Negative");
});

test( "s8", function() {
	// Default value
	s8.create('a');
	equal( s8.a, 0, "Default value");

	// Assignment
	s8.a = 77;
	equal( s8.a, 77, "Assignment");

	// Max
	s8.a = 127;
	equal( s8.a, 127, "Max");

	// Overflow
	s8.a += 10;
	equal( s8.a, s8.min+9, "Overflow");

	// Negative
	s8.a = -40;
	equal( s8.a, -40, "Negative");
});

test( "s16", function() {
	// Default value
	s16.create('a');
	equal( s16.a, 0, "Default value");

	// Assignment
	s16.a = 88;
	equal( s16.a, 88, "Assignment");

	// Max
	s16.a = 32767;
	equal( s16.a, 32767, "Max");

	// Overflow
	s16.a += 20;
	equal( s16.a, s16.min+19, "Overflow");

	// Negative
	s16.a = -80;
	equal( s16.a, -80, "Negative");
});

test( "s32", function() {
	// Default value
	s32.create('a');
	equal( s32.a, 0, "Default value");

	// Assignment
	s32.a = 99;
	equal( s32.a, 99, "Assignment");

	// Max
	s32.a = 2147483647;
	equal( s32.a, 2147483647, "Max");

	// Overflow
	s32.a += 30;
	equal( s32.a, s32.min+29, "Overflow");

	// Negative
	s32.a = -120;
	equal( s32.a, -120, "Negative");
});

test( "heap cleanup", function() {
	var example = uses_stdint(function() {
		// Make sure the id is correct
		u8.create('a');
		u8.a = 4;
		equal(gname_to_id['a'], 0);

		// Make sure the id is correct
		u8.create('b');
		u8.b = 5;
		equal(gname_to_id['b'], 1);

		// Make sure the values are on the heap
		equal(u8.raw[0], 4);
		equal(u8.raw[1], 5);

		// Make sure the heap counter is correct
		equal(gheap_counter, 2);
		equal(gscope_counter, 2);
	});

	// Actually call the function
	example();

	// Make sure the values are gone off the heap
	equal(u8.raw[0], 0);
	equal(u8.raw[1], 0);

	// Make sure the heap counter is correct
	equal(gheap_counter, 0);
	equal(gscope_counter, 0);
});

test( "default value", function() {
	// No argument should be zero
	u8.create('a');
	equal(u8.a, 0);

	// An argument should be set
	u8.create('b', 9);
	equal(u8.b, 9);
});

test( "union", function() {
	// Create a u32
	u32.create('a');
	u32.a = u32.max;

	// Make sure the u32 can be read as 4 u8 values
	equal(u8.raw[0], 255);
	equal(u8.raw[1], 255);
	equal(u8.raw[2], 255);
	equal(u8.raw[3], 255);
});

test( "casting", function() {
	// u8 to u32 should work
	u8.create('a', 7);
	u32.create('b', u8.a);
	equal(u8.a, 7);
	equal(u32.b, 7);

	// u32 to u8 should truncate
	u32.create('a', 300);
	u8.create('b', u32.a);
	equal(u32.a, 300);
	equal(u8.b, 44);
});

