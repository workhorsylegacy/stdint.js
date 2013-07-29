
module( "stdint.js", {
	setup: function() {
		ok( true, "one extra assert per test" );
	},

	teardown: function() {
		ok( true, "and one extra assert after each test" );
	}
});

test( "Type sizes", function() {
	equal( size_of_u8, 1);
	equal( size_of_u16, 2);
	equal( size_of_u32, 4);

	equal( size_of_s8, 1);
	equal( size_of_s16, 2);
	equal( size_of_s32, 4);
});

test( "Type max", function() {
	equal( max_u8, 255);
	equal( max_u16, 65535);
	equal( max_u32, 4294967295);

	equal( max_s8, 128);
	equal( max_s16, 32768);
	equal( max_s32, 2147483648);
});

test( "u8", function() {
	// Default value
	var a = new_u8();
	equal( u8[a], 0, "Default value");

	// Assignment
	u8[a] = 77;
	equal( u8[a], 77, "Assignment");

	// Max
	u8[a] = 255;
	equal( u8[a], 255, "Max");

	// Overflow
	u8[a] += 10;
	equal( u8[a], 9, "Overflow");

	// Negative
	u8[a] = -40;
	equal( u8[a], 216, "Negative");
});

test( "u16", function() {
	// Default value
	var a = new_u16();
	equal( u16[a], 0, "Default value");

	// Assignment
	u16[a] = 88;
	equal( u16[a], 88, "Assignment");

	// Max
	u16[a] = 65535;
	equal( u16[a], 65535, "Max");

	// Overflow
	u16[a] += 20;
	equal( u16[a], 19, "Overflow");

	// Negative
	u16[a] = -80;
	equal( u16[a], 65456, "Negative");
});


