## `data-fns`

This library provides utility functions for working with array data that are useful in many contexts, including creative coding. It offers generic functions that perform common operations such as offsetting an array, generating an array based on a callback function, and chunking an array according to a pattern.

## Get started

Install

```bash
yarn add data-fns
# or
npm install --save data-fns
```

Use

```typescript
import { times } from 'data-fns';

console.log(times(5, index => index * 2));
```

## Documentation

<!-- toc -->

- [`times` (function)](#times-function)
- [`mapAt` (function)](#mapat-function)
- [`getItem` (function)](#getitem-function)
- [`generateSequence` (function)](#generatesequence-function)
- [`cyclic` (function)](#cyclic-function)
- [`palindrome` (function)](#palindrome-function)
- [`modulo` (function)](#modulo-function)
- [`CellularAutomataRuleset` (type)](#cellularautomataruleset-type)
- [`BoundaryFunction` (type)](#boundaryfunction-type)
- [`cellularAutomata` (function)](#cellularautomata-function)
- [`euclideanSequencer` (function)](#euclideansequencer-function)
- [`euclideanSilences` (function)](#euclideansilences-function)
- [`patternChunks` (function)](#patternchunks-function)
- [`binaryToIndices` (function)](#binarytoindices-function)
- [`indicesToBinary` (function)](#indicestobinary-function)

<!-- tocstop -->

<!-- INSERT GENERATED DOCS START -->

### `times` (function)

Calls a callback function a specified number of times and returns the results in an array.

**Parameters:**

- iterations (`number`) - The number of times to call the callback function.
- callback (`(index: number) => T`) - The callback function to call.

```tsx
times(5, i => i * 2);
// Returns [0, 2, 4, 6, 8]
```

### `mapAt` (function)

Maps an item in an array at a specified index to a new value.

**Parameters:**

- array (`T[]`) - The array to map the item in.
- index (`number`) - The index of the item to map.
- mapFn (`(item: T) => T`) - A function that maps the item to a new value.

```tsx
const originalArray = [1, 2, 3, 4, 5];
const mappedArray = mapAt(originalArray, 2, item => item * 2);
// Returns [1, 2, 6, 4, 5]
```

### `getItem` (function)

Gets an item from an array based on a mapped index.

**Parameters:**

- index (`number`) - The index of the item to get.
- array (`T[]`) - The array to get the item from.
- indexMapFn (`(index: number, length: number) => number`) - A function that maps the index to a new index.

```tsx
const array = ['a', 'b', 'c', 'd', 'e'];
const indexMapFn = (index, length) => (index * 2) % length;
getItem(2, array, indexMapFn);
// Returns 'e'
```

### `generateSequence` (function)

Generates a sequence of values by applying a given function to an initial value for a specified number of iterations.

**Parameters:**

- iterations (`number`) - The number of iterations to perform.
- initialValue (`T`) - The initial value of the sequence.
- iteratorFn (`(value: T) => T`) - The function to apply to the initial value and each subsequent value.

```tsx
generateSequence(5, 1, value => value * 2);
// Returns [1, 2, 4, 8, 16]
```

### `cyclic` (function)

Maps an index to a cyclic pattern.

**Parameters:**

- index (`number`) - The original index.
- length (`number`) - The length of the sequence.

```tsx
cyclic(6, 5);
// Returns 1
```

### `palindrome` (function)

Maps an index to a palindrome pattern.

**Parameters:**

- index (`number`) - The original index.
- length (`number`) - The length of the sequence.

```tsx
const length = 5;
const indexes = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
indexes.map(index => palindrome(index, length));
// Returns [0, 1, 2, 1, 0, 1, 2, 1, 0, 1]
```

### `modulo` (function)

Returns the remainder of dividing the dividend by the divisor, with support for negative dividends.

**Parameters:**

- dividend (`number`) - The dividend to divide.
- divisor (`number`) - The divisor to divide by.

```tsx
// Basic usage
modulo(5, 3);
// Returns 2

// Support for negative dividends
modulo(-5, -3);
// Returns 2

// Support for negative divisors
modulo(-5, 3);
// Returns -2

// Support for negative dividends and divisors
modulo(5, -3);
// Returns -2
```

### `CellularAutomataRuleset` (type)

### `BoundaryFunction` (type)

### `cellularAutomata` (function)

Generates a new sequence using a one-dimensional cellular automaton.

**Parameters:**

- sequence (`number[]`) - The initial sequence.
- ruleset (`CellularAutomataRuleset`) - The ruleset for the cellular automaton.
- boundaryFn (`BoundaryFunction`) - The boundary function to use.

```tsx
generateSequence(10, sequence, cellularAutomata);
// Returns [
//  [0, 0, 0, 0, 1, 0, 0, 0],
//  [0, 0, 0, 1, 1, 1, 0, 0],
//  [0, 0, 1, 1, 0, 0, 1, 0],
//  [0, 1, 1, 0, 1, 1, 1, 1],
//  [0, 1, 0, 0, 1, 0, 0, 0],
//  [1, 1, 1, 1, 1, 1, 0, 0],
//  [1, 0, 0, 0, 0, 0, 1, 1],
//  [0, 1, 0, 0, 0, 1, 1, 0],
//  [1, 1, 1, 0, 1, 1, 0, 1],
//  [0, 0, 0, 0, 1, 0, 0, 1],
// ]
```

### `euclideanSequencer` (function)

Generates a Euclidean rhythm sequence.

**Parameters:**

- steps (`number`) - The number of steps in the sequence.
- notes (`number`) - The number of notes in the sequence.
- rotation (`number`) - The rotation of the sequence (default: 0).

```tsx
euclideanSequencer(8, 3, 1);
// Returns [1, 3, 6]
```

### `euclideanSilences` (function)

Generates a sequence of indices representing the "silences" (i.e. rests) in a Euclidean rhythm.

**Parameters:**

- steps (`number`) - The number of steps in the rhythm.
- notes (`number`) - The number of notes in the rhythm.
- rotation (`number`) - The rotation of the rhythm (default: 0).

```tsx
euclideanSilences(8, 3);
// Returns [1, 3, 4, 6, 7]
```

### `patternChunks` (function)

Splits an array into chunks based on a pattern.

**Parameters:**

- array (`T[]`) - The array to split.
- pattern (`number[]`) - The pattern to split the array with.

```tsx
patternChunks([1, 2, 3, 4, 5, 6, 7, 8], [1, 2, 3]);
// Returns [[1], [2, 3], [4, 5, 6], [7], [8]]
```

### `binaryToIndices` (function)

Converts an array of binary digits to an array of indices where the digit is 1.

**Parameters:**

- binary (`number[]`) - An array of binary digits (0 or 1).

```tsx
binaryToIndices([1, 0, 1, 1, 0, 1]);
// Returns [0, 2, 3, 5]

binaryToIndices([1, 1, 1, 1, 1]);
// Returns [0, 1, 2, 3, 4]

binaryToIndices([0, 0, 0, 0, 0]);
// Returns []
```

### `indicesToBinary` (function)

Converts an array of indices to a binary array where the indices are 1 and the other digits are 0.

**Parameters:**

- indices (`number[]`) - An array of indices.
- length (`number`) - The length of the binary array to be returned.

```tsx
// Basic usage
indicesToBinary([0, 2, 4], 5);
// Returns [1, 0, 1, 0, 1]

// Ignoring negative indices
indicesToBinary([0, -1, 2, -2, 4], 5);
// Returns [1, 0, 1, 0, 1]

// Indices outside range are ignored
indicesToBinary([0, 2, 4, 6], 5);
// Returns [1, 0, 1, 0, 1]
```

<!-- INSERT GENERATED DOCS END -->
