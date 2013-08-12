/*
Stdint.js - A JavaScript library for 8, 16, and 32 bit integer types.

Copyright 2013 Stdint.js authors
https://github.com/workhorsy/stdint.js

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

/*
TODO:
. Fix bug with heap cleaning various sizes
. Fix bug with heap resizing
*/

var HEAP_SIZE = 1024 * 1024;
var gheap_counter = 0;
var gscope_counter = 0;
var gid_to_name = {};
var gname_to_id = {};
var gheap;

var s8;
var s16;
var s32;

var u8;
var u16;
var u32;

// Make sure features are supported by the browser
var features = {
	'Object.defineProperties' : Object.defineProperties,
	'ArrayBuffer' : typeof(ArrayBuffer),
	'Uint8Array' : typeof(Uint8Array),
	'Uint16Array' : typeof(Uint16Array),
	'Uint32Array' : typeof(Uint32Array),
	'Int8Array' : typeof(Int8Array),
	'Int16Array' : typeof(Int16Array),
	'Int32Array' : typeof(Int32Array)
};
for (var key in features) {
	var value = features[key];
	if (value === 'undefined') {
		throw new Error(key + ' is not supported.');
	}
}

function _define_heap(typed_array, min_val, max_val) {
	return function() {
		this.heap = new typed_array(gheap);

		Object.defineProperties(this, {
			size: { get: function() { return typed_array.BYTES_PER_ELEMENT; } },
			min: { get: function() { return min_val; } },
			max: { get: function() { return max_val; } },
			raw: { get: function() { return this.heap; } }
		});

		this.create = function(name, value) {
			var id = _malloc(this, name, value);

			Object.defineProperty(this, name, {
				configurable : true,
				get: function() { return this.heap[id]; },
				set: function(val) { this.heap[id] = val; }
			});
		};
	}
}

function _malloc(type, name, value) {
	// FIXME: If the heap is too small, the size should be increased.
	// FIXME: Throw if the name is already used or a reserved word.

	var id = gheap_counter;
	gheap_counter += type.size;
	gscope_counter += type.size;
	type.heap[id] = value !== 'undefined' ? value : 0;
	gid_to_name[id] = name;
	gname_to_id[name] = id;
	return id;
}

// Removes any variables from the heap that were declared since the current scope started.
// Also set their values to zero.
// FIXME: This may break if called in an unexpected order, such as from a timeout or interval.
function _clean_heap() {
	//console.log('Cleaning heap');
	var id;
	var name;

	while (gscope_counter > 0) {
		--gheap_counter;
		--gscope_counter;

		id = gheap_counter;
		name = gid_to_name[id];

		delete gid_to_name[id];
		delete gname_to_id[name];

		u8.heap[id] = 0;
	}
}

function reset_stdint() {
	// Reset the variables that track the heap
	gheap_counter = 0;
	gscope_counter = 0;
	gid_to_name = {};
	gname_to_id = {};
	gheap = new ArrayBuffer(HEAP_SIZE);

	// Create the 8, 16, and 32 bit integer types
	u8 = new (_define_heap(
		Uint8Array,
		0,
		Math.pow(2, (1 * 8)) - 1
	))();

	u16 = new (_define_heap(
		Uint16Array,
		0,
		Math.pow(2, (2 * 8)) - 1
	))();

	u32 = new (_define_heap(
		Uint32Array,
		0,
		Math.pow(2, (4 * 8)) - 1
	))();

	s8 = new (_define_heap(
		Int8Array,
		-Math.pow(2, (1 * 8) - 1),
		Math.pow(2, (1 * 8) - 1) - 1
	))();

	s16 = new (_define_heap(
		Int16Array,
		-Math.pow(2, (2 * 8) - 1),
		Math.pow(2, (2 * 8) - 1) - 1
	))();

	s32 = new (_define_heap(
		Int32Array,
		-Math.pow(2, (4 * 8) - 1),
		Math.pow(2, (4 * 8) - 1) - 1
	))();
}

// Returns a new function that calls the original, then cleans the heap when it exits.
// It uses a try/finally block for a scope guard.
function uses_stdint(func) {
	return function() {
		try {
			return func.apply(this, arguments);
		} finally {
			_clean_heap();
		}
	};
}

reset_stdint();

