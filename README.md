# Onaji

<p align="center">
  <a href="https://www.npmjs.com/package/onaji"><img alt="npm version" src="https://img.shields.io/npm/v/onaji"></a>
  <a href="https://www.npmjs.com/package/onaji"><img alt="npm downloads" src="https://img.shields.io/npm/dw/onaji"></a>
  <img alt="Test status" src="https://github.com/sheodox/onaji/actions/workflows/node.js.yml/badge.svg">
</p>

This is a library to replace `JSON.stringify(obj)` and `JSON.parse(str)` with support for more data types. It's helpful when using Typescript types for data sent over the internet without having to make ugly exceptions to your types, or explicitly parse data that comes out different after being stringified and parsed (like how a `Date` object turns into and remains a `string`).

Additional support is provided for:

- `Date`
- Custom types (using custom serializers/deserializers)
- more as needed!

## Usage

```typescript
import { serialize, deserialize, isOnajiSerialized } from 'onaji';

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
console.log(isOnajiSerialized(dataStr));
// true
```

## Usage with custom types

Custom classes are supported by passing functions when serializing and deserializing data.

```typescript
import { serialize, deserialize } from 'onaji';

class User {
  name: string;
  constructor(name) {
    this.name = name;
  }
}

interface MyData {
  test: boolean;
  user: User;
}

const dataStr = serialize({
  test: true,
  user: new User('sheodox')
}, (value) => {
  if (value instanceof User) {
    // custom serializers can return a [string, any] tuple, where the
    // first item is a type string your custom deserializer will get, and
    // the second item is some JSON stringify-able representation of your
    // custom object which your deserializer can use to reconstruct it
    return ['user', user.name]
  }

  // return undefined to use default serialization for this property
});

const deserializedData = deserialize<MyData>(dataStr, (type, serialized) => {
  // use the type string from your custom serializer to decide which type of object
  // you want to recreate using the serialized data
  if (type === 'user') {
    // the custom serializer returned just the name for this user
    return new User(serialized)
  }
})

console.log(deserialize<MyData>(dataStr).user instanceof User);
// true
```

## Additional Methods

`isOnajiSerializable(value: any)` - Check if `value` could be serialized.

```typescript
import { isOnajiSerializable } from 'onaji';

console.log(isOnajiSerializable(null));
// false
console.log(isOnajiSerializable({hello: 'world'}));
// true
```

`isOnajiSerialized(value: any)` - Check if `value` has been serialized by Onaji.

```typescript
import { serialize, isOnajiSerializedi } from 'onaji';

const serializedObject = serialize({hello: 'world'});

console.log(isOnajiSerialized(serializedObject));
// true
console.log(isOnajiSerialized('test'));
// false
```

## Name

Onaji (同じ) is the Japanese word for "same, identical, equal".
