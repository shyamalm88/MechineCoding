# Inheritance in JavaScript: ES5 prototypes, classes, and object creation

## The ES5 pattern, and why each line exists

```js
function Dog(name) { Animal.call(this, name) }   // 1. borrow the constructor
Dog.prototype = Object.create(Animal.prototype)  // 2. link the chain
Dog.prototype.constructor = Dog                  // 3. repair constructor
```

1. Without `Animal.call(this, name)`, instance properties like `name` are never
   initialised.
2. **`Object.create(Animal.prototype)`, not `new Animal()`** — the old, broken
   idiom. `new Animal()` runs the parent constructor (possibly with side effects
   and missing arguments) just to make a prototype object.
3. Assigning to `Dog.prototype` wipes the default `constructor` property, so
   `new Dog().constructor` would report `Animal` until you restore it.

## Classes are syntax over the same machinery

`class` is not a new object model — it is sugar over prototypes, with real
improvements: `super` works properly, methods are non-enumerable, the body is
always strict mode, and calling a class without `new` throws.

`extends` also supports built-ins (`class MyArray extends Array`), which was
effectively impossible in ES5.

## Object.create vs Object.assign

Constantly confused, and they do unrelated things:

```js
Object.create(proto)              // NEW object whose PROTOTYPE is proto
Object.assign(target, ...sources) // COPIES own enumerable props onto target
```

`Object.create` **links** — changes to `proto` are visible through the chain.
`Object.assign` **copies** — a shallow snapshot, and the prototype is untouched.

`Object.assign` also copies by reference (nested objects are shared) and it
**triggers setters** on the target, unlike spread in some edge cases.

## Ways to create objects

Literal `{}`, `new Ctor()`, `class`, `Object.create(proto)`, `Object.create(null)`
(no prototype at all — a clean dictionary with no inherited `toString`), and
factory functions returning literals.

## Traps

- `__proto__` is the accessor; `prototype` is a property of *constructor
  functions*. Instances have `__proto__`, not `prototype`.
- Class declarations are **not hoisted** in a usable way — they sit in the TDZ.
- Arrow functions have no `prototype` and cannot be constructors.
