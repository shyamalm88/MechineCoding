// ─────────────────────────────────────────────
// TYPE COERCION — Tricky Output Questions
// ─────────────────────────────────────────────

// ─── Q1: + operator with mixed types ───────
console.log(1 + "2");     // "12"   — number coerced to string
console.log("3" - 1);     // 2      — string coerced to number (- only works on numbers)
console.log("3" + 1);     // "31"   — + prefers string concatenation
console.log(1 + 2 + "3"); // "33"   — left-to-right: 1+2=3, then 3+"3"="33"
console.log("1" + 2 + 3); // "123"  — "1"+2="12", then "12"+3="123"

// ─── Q2: [] and {} coercion ─────────────────
console.log([] + []);   // ""              — both coerce to ""
console.log([] + {});   // "[object Object]" — []=>"", {}=>"[object Object]"
console.log({} + []);   // 0               — parsed as block {}, then +[] = +""= 0
// Note: In a REPL/script context {} + [] can be 0 or "[object Object]" depending on context
console.log(+[]);       // 0    — [] → "" → 0
console.log(+{});       // NaN  — {} → "[object Object]" → NaN
console.log(+null);     // 0
console.log(+undefined); // NaN
console.log(+true);     // 1
console.log(+false);    // 0
console.log(+"");       // 0
console.log(+" ");      // 0   — whitespace-only string → 0

// ─── Q3: == (loose equality) coercion ──────
console.log(0 == false);        // true   — false → 0
console.log("" == false);       // true   — both → 0
console.log(null == undefined); // true   — spec rule: only equal to each other
console.log(null == false);     // false  — null only == undefined
console.log(null == 0);         // false
console.log("" == 0);           // true   — "" → 0
console.log("0" == 0);          // true   — "0" → 0
console.log("0" == false);      // true   — false→0, "0"→0
console.log([] == false);       // true   — []→""→0, false→0
console.log([] == ![]);         // true   — ![]→false→0, []→0
console.log(NaN == NaN);        // false  — NaN is never equal to anything

// ─── Q4: === (strict equality) — no coercion ──
console.log(0 === false);       // false
console.log("" === 0);          // false
console.log(null === undefined); // false

// ─── Q5: Falsy values ──────────────────────
// All falsy: false, 0, -0, 0n, "", null, undefined, NaN
console.log(Boolean(0));         // false
console.log(Boolean(""));        // false
console.log(Boolean(null));      // false
console.log(Boolean(undefined)); // false
console.log(Boolean(NaN));       // false
console.log(Boolean([]));        // true  — empty array is TRUTHY
console.log(Boolean({}));        // true  — empty object is TRUTHY
console.log(Boolean("0"));       // true  — non-empty string is TRUTHY

// ─── Q6: Arithmetic edge cases ─────────────
console.log(0.1 + 0.2);          // 0.30000000000000004  — floating point precision
console.log(0.1 + 0.2 === 0.3);  // false
console.log(Infinity + 1);        // Infinity
console.log(Infinity - Infinity); // NaN
console.log(typeof NaN);          // "number"  — counterintuitive!
console.log(isNaN("hello"));      // true  — coerces to NaN first
console.log(Number.isNaN("hello")); // false — no coercion, "hello" is not NaN

// ─── Q7: String to number edge cases ───────
console.log(Number(""));        // 0
console.log(Number(" "));       // 0
console.log(Number("123abc"));  // NaN
console.log(Number(null));      // 0
console.log(Number(undefined)); // NaN
console.log(Number(true));      // 1
console.log(Number(false));     // 0
console.log(Number([]));        // 0   — [] → "" → 0
console.log(Number([3]));       // 3   — [3] → "3" → 3
console.log(Number([1, 2]));    // NaN — [1,2] → "1,2" → NaN

// ─── Q8: parseInt vs Number ─────────────────
console.log(parseInt("10.9"));   // 10   — stops at non-integer char
console.log(parseInt("0x10"));   // 16   — hex parsing
console.log(parseInt("010"));    // 10   — NOT octal (deprecated)
console.log(parseInt("10", 2));  // 2    — binary: 10 in base 2 = 2
console.log(parseInt("abc"));    // NaN

// ─── Q9: Object to primitive (Symbol.toPrimitive) ──
const obj = {
  [Symbol.toPrimitive](hint) {
    if (hint === "number") return 42;
    if (hint === "string") return "hello";
    return true; // default
  }
};
console.log(+obj);          // 42      — numeric hint
console.log(`${obj}`);      // "hello" — string hint
console.log(obj + "");      // "true"  — default hint, then to string

// ─── Q10: Comparison coercion ───────────────
console.log(null > 0);   // false
console.log(null == 0);  // false
console.log(null >= 0);  // true  — null → 0 for relational operators
// Why: == uses different rules than > >= < <=
//      null only == undefined (not 0) for ==
//      but null → 0 for arithmetic comparisons

console.log(undefined > 0);  // false
console.log(undefined < 0);  // false
console.log(undefined == 0); // false
// undefined → NaN for arithmetic, NaN comparisons always false
