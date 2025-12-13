const user = {
  name: "John",
  age: 30,
};

const userProxy = new Proxy(user, {
  // Intercept 'get' requests
  get: (target, property) => {
    console.log(`Getting ${property}`);
    if (!(property in target)) {
      return "Not Found"; // Custom default value
    }
    return target[property];
  },

  // Intercept 'set' requests (Validation)
  set: (target, property, value) => {
    if (property === "age" && typeof value !== "number") {
      throw new Error("Age must be a number!");
    }
    console.log(`Setting ${property} to ${value}`);
    target[property] = value;
    return true;
  },
});

// Usage
console.log(userProxy.name); // Logs "Getting name" -> "John"
userProxy.age = "Old"; // Error: Age must be a number!
