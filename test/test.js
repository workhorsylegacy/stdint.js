
module( "stdint.js", {
	setup: function() {
		reset_heap();
	},

	teardown: function() {
		reset_heap();
	}
});

// FIXME: Make these properties
test( "Type sizes", function() {
	equal( size_of_s8, 1);
	equal( size_of_s16, 2);
	equal( size_of_s32, 4);

	equal( size_of_u8, 1);
	equal( size_of_u16, 2);
	equal( size_of_u32, 4);
});

test( "Type max", function() {
	equal( max_s8, 127);
	equal( max_s16, 32767);
	equal( max_s32, 2147483647);

	equal( max_u8, 255);
	equal( max_u16, 65535);
	equal( max_u32, 4294967295);
});

test( "Type min", function() {
	equal( min_s8, -128);
	equal( min_s16, -32768);
	equal( min_s32, -2147483648);

	equal( min_u8, 0);
	equal( min_u16, 0);
	equal( min_u32, 0);
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
	equal( u8[a], max_u8-39, "Negative");
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
	equal( u16[a], max_u16-79, "Negative");
});

test( "u32", function() {
	// Default value
	var a = new_u32();
	equal( u32[a], 0, "Default value");

	// Assignment
	u32[a] = 99;
	equal( u32[a], 99, "Assignment");

	// Max
	u32[a] = 4294967295;
	equal( u32[a], 4294967295, "Max");

	// Overflow
	u32[a] += 30;
	equal( u32[a], 29, "Overflow");

	// Negative
	u32[a] = -120;
	equal( u32[a], max_u32-119, "Negative");
});

test( "s8", function() {
	// Default value
	var a = new_s8();
	equal( s8[a], 0, "Default value");

	// Assignment
	s8[a] = 77;
	equal( s8[a], 77, "Assignment");

	// Max
	s8[a] = 127;
	equal( s8[a], 127, "Max");

	// Overflow
	s8[a] += 10;
	equal( s8[a], min_s8+9, "Overflow");

	// Negative
	s8[a] = -40;
	equal( s8[a], -40, "Negative");
});

test( "s16", function() {
	// Default value
	var a = new_s16();
	equal( s16[a], 0, "Default value");

	// Assignment
	s16[a] = 88;
	equal( s16[a], 88, "Assignment");

	// Max
	s16[a] = 32767;
	equal( s16[a], 32767, "Max");

	// Overflow
	s16[a] += 20;
	equal( s16[a], min_s16+19, "Overflow");

	// Negative
	s16[a] = -80;
	equal( s16[a], -80, "Negative");
});

test( "s32", function() {
	// Default value
	var a = new_s32();
	equal( s32[a], 0, "Default value");

	// Assignment
	s32[a] = 99;
	equal( s32[a], 99, "Assignment");

	// Max
	s32[a] = 2147483647;
	equal( s32[a], 2147483647, "Max");

	// Overflow
	s32[a] += 30;
	equal( s32[a], min_s32+29, "Overflow");

	// Negative
	s32[a] = -120;
	equal( s32[a], -120, "Negative");
});

test( "heap cleanup", function() {
	function example() {
		// Make sure the id is correct
		var a = new_u8();
		u8[a] = 4;
		equal(a, 0);

		// Make sure the id is correct
		var b = new_u8();
		u8[b] = 5;
		equal(b, 1);

		// Make sure the values are on the heap
		equal(u8[0], 4);
		equal(u8[1], 5);

		// Make sure the heap counter is correct
		equal(heap_counter, 2);
		equal(scope_counter, 2);
	}

	// Actually call the function
	example = with_clean_heap(example);
	example();

	// Make sure the values are gone off the heap
	equal(u8[0], 0);
	equal(u8[1], 0);

	// Make sure the heap counter is correct
	equal(heap_counter, 0);
	equal(scope_counter, 0);
});

test( "default value", function() {
	// No argument should be zero
	var a = new_u8();
	equal(u8[a], 0);

	// An argument should be set
	var b = new_u8(9);
	equal(u8[b], 9);
});

test( "union", function() {
	// Create a u32
	var a = new_u32();
	u32[a] = max_u32;

	// Make sure the u32 can be read as 4 u8 values
	equal(u8[0], 255);
	equal(u8[1], 255);
	equal(u8[2], 255);
	equal(u8[3], 255);
});

test( "casting", function() {
	// u8 to u32 should work
	var a = new_u8(7);
	var b = to_u32(u8[a]);
	equal(u8[a], 7);
	equal(u32[b], 7);

	// u32 to u8 should truncate
	var a = new_u32(300);
	var b = to_u8(u32[a]);
	equal(u32[a], 300);
	equal(u8[b], 44);
});

