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

const size_of_s8 = Int8Array.BYTES_PER_ELEMENT;
const size_of_s16 = Int16Array.BYTES_PER_ELEMENT;
const size_of_s32 = Int32Array.BYTES_PER_ELEMENT;

const size_of_u8 = Uint8Array.BYTES_PER_ELEMENT;
const size_of_u16 = Uint16Array.BYTES_PER_ELEMENT;
const size_of_u32 = Uint32Array.BYTES_PER_ELEMENT;

const max_s8 = Math.pow(2, (size_of_s8 * 8) - 1) - 1;
const max_s16 = Math.pow(2, (size_of_s16 * 8) - 1) - 1;
const max_s32 = Math.pow(2, (size_of_s32 * 8) - 1) - 1;

const max_u8 = Math.pow(2, (size_of_u8 * 8)) - 1;
const max_u16 = Math.pow(2, (size_of_u16 * 8)) - 1;
const max_u32 = Math.pow(2, (size_of_u32 * 8)) - 1;

const min_s8 = -Math.pow(2, (size_of_s8 * 8) - 1);
const min_s16 = -Math.pow(2, (size_of_s16 * 8) - 1);
const min_s32 = -Math.pow(2, (size_of_s32 * 8) - 1);

const min_u8 = 0;
const min_u16 = 0;
const min_u32 = 0;

var HEAP_SIZE = 1024 * 1024;
var heap_counter = 0;
var scope_counter = 0;
var heap;

var s8;
var s16;
var s32;

var u8;
var u16;
var u32;

function reset_heap() {
	heap = new ArrayBuffer(HEAP_SIZE);

	s8 = new Int8Array(heap);
	s16 = new Int16Array(heap);
	s32 = new Int32Array(heap);

	u8 = new Uint8Array(heap);
	u16 = new Uint16Array(heap);
	u32 = new Uint32Array(heap);
}

function malloc(array, size) {
	// FIXME: If the heap is too small, the size should be increased.
	heap_counter += size;
	scope_counter += size;
	var id = heap_counter;
	array[id] = 0;
	return id;
}

// Converts an integer to a u8, u16, u32 et cetera
function to_s8(value) { return value & 0xFF; }
function to_s16(value) { return value & 0xFFFF; }
function to_s32(value) { return value & 0xFFFFFFFF; }
function to_u8(value) { return value & 0xFF; }
function to_u16(value) { return value & 0xFFFF; }
function to_u32(value) { return value & 0xFFFFFFFF; }

// Returns a new index that can be used to access a variable on the heap
function new_s8() { return malloc(s8, size_of_s8); }
function new_s16() { return malloc(s16, size_of_s16); }
function new_s32() { return malloc(s32, size_of_s32); }
function new_u8() { return malloc(u8, size_of_u8); }
function new_u16() { return malloc(u16, size_of_u16); }
function new_u32() { return malloc(u32, size_of_u32); }

// Removes any variables from the heap that were declared since the current scope started.
// Also set their values to zero.
// FIXME: This may break if called in an unexpected order, such as from a timeout or interval.
function clean_heap() {
	//console.log('Cleaning heap');
	while(scope_counter > 0) {
		heap[heap_counter] = 0;
		--heap_counter;
		--scope_counter;
	}
}

// Returns a new function that calls the original, then cleans the heap when it exits.
// It uses a try/finally block for a scope guard.
function with_clean_heap(func) {
	return function() {
		try {
			return func.apply(this, arguments);
		} finally {
			clean_heap();
		}
	}
}

reset_heap();

