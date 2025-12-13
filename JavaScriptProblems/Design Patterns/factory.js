class Developer {
  constructor(name) {
    this.name = name;
    this.type = "Developer";
  }
}

class Tester {
  constructor(name) {
    this.name = name;
    this.type = "Tester";
  }
}

class EmployeeFactory {
  create(name, type) {
    switch (type) {
      case "dev":
        return new Developer(name);
      case "test":
        return new Tester(name);
      default:
        throw new Error("Invalid type");
    }
  }
}

// Usage
const factory = new EmployeeFactory();
const emp1 = factory.create("Alice", "dev");
const emp2 = factory.create("Bob", "test");
