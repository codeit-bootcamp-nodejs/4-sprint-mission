Unit-fns provides composable primitives that make it easy to generate complex numerical patterns with little code.

## Motivation
After experimenting with shaders and other languages like Rust to see what they could offer in terms of performance for graphics and audio, I still missed the tooling and ecosystem that we as web developers are used to. Unit-fns is the answer to what happens when an elegant API is the primary goal. It is currently pre version 1, the API is experimental and might change without notice.

## Get started

Install

```bash
npm install --save unit-fns
# or
yarn add unit-fns
```

Use

```typescript
import { toUnit } from 'unit-fns';

console.log(toUnit(10)); // 1
```

[Examples](https://github.com/skulptur/unit-fns/tree/master/example)

## API
- Most functions receive and return numbers in the 0-1 range. Let's call a number that is in that range a Unit.
- Functions that can be pure, are pure.
- The argument order is optimized for partial application.
