/**
 * ============================================================================
 * PROBLEM: Implement lodash `_.groupBy` (and the modern `Object.groupBy`)
 * ============================================================================
 */
function groupBy(array, iteratee) {
  const getKey = (item) =>
    typeof iteratee === "function" ? iteratee(item) : item[iteratee];

  const result = Object.create(null); // No prototype chain — avoids collisions
  // with inherited names like "constructor", "toString", "__proto__", etc.

  for (const item of array) {
    const key = getKey(item);
    if (!result[key]) {
      result[key] = [];
    }
    result[key].push(item);
  }
  return result;
}

// Your input data
const employees = [
  { name: "Alice", department: "Engineering" },
  { name: "Bob", department: "Design" },
  { name: "Charlie", department: "Engineering" },
  { name: "Diana", department: "HR" },
  { name: "Ethan", department: "Design" },
];

// Execution
const output = groupBy(employees, "department");
console.log(output);

// output

// {
//   "Engineering": [
//     { "name": "Alice", "department": "Engineering" },
//     { "name": "Charlie", "department": "Engineering" }
//   ],
//   "Design": [
//     { "name": "Bob", "department": "Design" },
//     { "name": "Ethan", "department": "Design" }
//   ],
//   "HR": [
//     { "name": "Diana", "department": "HR" }
//   ]
// }
