# Onaji

This is a library to replace `JSON.stringify(obj)` and `JSON.parse(str)` with support for more data types. It's helpful when using Typescript types for data sent over the internet without having to make ugly exceptions to your types, or explicitly parse data that comes out different after being stringified and parsed (like how a `Date` object turns into and remains a `string`).

Additional support is provided for:

- `Date`
- more as needed!

## Usage

```typescript
import { serialize, deserialize } from 'onaji';

const dataStr = serialize({
  name: 'sheodox',
  createdAt: new Date(),
});

interface MyData {
  name: string;
  createdAt: Date;
}

console.log(deserialize<MyData>(dataStr).createdAt.getFullYear());
// 2021
```

## Name

Onaji (同じ) is the Japanese word for "same, identical, equal".
