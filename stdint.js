/*
Copyright (c) 2013, Matthew Brennan Jones <mattjones@workhorsy.org>
Stdint.js is a JavaScript library for various fixed width integer types.
For more information see https://github.com/workhorsy/stdint.js

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be included
in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/

var HEAP_SIZE = 1024 * 1024;
var heap_counter = 0;
var scope_counter = 0;
var id_to_name = {};
var name_to_id = {};
var gheap;

var s8;
var s16;
var s32;

var u8;
var u16;
var u32;

U8_Heap = define_heap(
	Uint8Array,
	0,
	Math.pow(2, (1 * 8)) - 1
);

U16_Heap = define_heap(
	Uint16Array,
	0,
	Math.pow(2, (2 * 8)) - 1
);

U32_Heap = define_heap(
	Uint32Array,
	0,
	Math.pow(2, (4 * 8)) - 1
);

S8_Heap = define_heap(
	Int8Array,
	-Math.pow(2, (1 * 8) - 1),
	Math.pow(2, (1 * 8) - 1) - 1
);

S16_Heap = define_heap(
	Int16Array,
	-Math.pow(2, (2 * 8) - 1),
	Math.pow(2, (2 * 8) - 1) - 1
);

S32_Heap = define_heap(
	Int32Array,
	-Math.pow(2, (4 * 8) - 1),
	Math.pow(2, (4 * 8) - 1) - 1
);

function define_heap(typed_array, min_val, max_val) {
	return function() {
		this.heap = new typed_array(gheap);

		Object.defineProperties(this, {
			size: { get: function() { return typed_array.BYTES_PER_ELEMENT; } },
			min: { get: function() { return min_val; } },
			max: { get: function() { return max_val; } },
			raw: { get: function() { return this.heap; } }
		});

		this.create = function(name, value) {
			var id = malloc(this, name, value);

			Object.defineProperty(this, name, {
				configurable : true,
				get: function() { return this.heap[id]; },
				set: function(val) { this.heap[id] = val; }
			});
		};
	}
}

function reset_stdint() {
	heap_counter = 0;
	scope_counter = 0;
	id_to_name = {};
	name_to_id = {};

	gheap = new ArrayBuffer(HEAP_SIZE);

	u8 = new U8_Heap();
	u16 = new U16_Heap();
	u32 = new U32_Heap();

	s8 = new S8_Heap();
	s16 = new S16_Heap();
	s32 = new S32_Heap();
}

function malloc(type, name, value) {
	// FIXME: If the heap is too small, the size should be increased.
	// FIXME: Throw if the name is already used or a reserved word.

	var id = heap_counter;
	heap_counter += type.size;
	scope_counter += type.size;
	type.heap[id] = value !== 'undefined' ? value : 0;
	id_to_name[id] = name;
	name_to_id[name] = id;
	return id;
}

// Removes any variables from the heap that were declared since the current scope started.
// Also set their values to zero.
// FIXME: This may break if called in an unexpected order, such as from a timeout or interval.
function clean_heap() {
	//console.log('Cleaning heap');
	while(scope_counter > 0) {
		--heap_counter;
		--scope_counter;

		var id = heap_counter;
		var name = id_to_name[id];

		delete id_to_name[id];
		delete name_to_id[name];

		u8.heap[id] = 0;
	}
}

// Returns a new function that calls the original, then cleans the heap when it exits.
// It uses a try/finally block for a scope guard.
function uses_stdint(func) {
	return function() {
		try {
			return func.apply(this, arguments);
		} finally {
			clean_heap();
		}
	}
}

reset_stdint();

