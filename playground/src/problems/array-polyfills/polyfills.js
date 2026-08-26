/**
 * map / filter / reduce / every, implemented from scratch.
 *
 * Details that matter and are usually missed:
 *  - the callback receives (element, index, array)
 *  - `thisArg` is supported
 *  - HOLES in sparse arrays are SKIPPED (hence the `in` check)
 *  - reduce with no initial value and an empty array throws
 */

Array.prototype.myMap = function (callback, thisArg) {
  const out = new Array(this.length)
  for (let i = 0; i < this.length; i++) {
    if (i in this) out[i] = callback.call(thisArg, this[i], i, this)
  }
  return out
}

Array.prototype.myFilter = function (callback, thisArg) {
  const out = []
  for (let i = 0; i < this.length; i++) {
    if (i in this && callback.call(thisArg, this[i], i, this)) out.push(this[i])
  }
  return out
}

Array.prototype.myReduce = function (callback, initialValue) {
  let i = 0
  let acc = initialValue

  if (arguments.length < 2) {
    // No initial value: seed from the first present element.
    while (i < this.length && !(i in this)) i++
    if (i >= this.length) {
      throw new TypeError('Reduce of empty array with no initial value')
    }
    acc = this[i++]
  }

  for (; i < this.length; i++) {
    if (i in this) acc = callback(acc, this[i], i, this)
  }
  return acc
}

Array.prototype.myEvery = function (callback, thisArg) {
  for (let i = 0; i < this.length; i++) {
    if (i in this && !callback.call(thisArg, this[i], i, this)) return false
  }
  return true // vacuously true for an empty array
}
