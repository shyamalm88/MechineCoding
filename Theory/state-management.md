# State Management: A Senior Engineer's Guide

Understanding when and how to manage state is crucial for building scalable frontend applications.

---

## 1. The State Spectrum

Not all state is equal. Understanding the different types helps you choose the right tool.

```
┌─────────────────────────────────────────────────────────────────────┐
│                        STATE SPECTRUM                                │
├──────────────┬──────────────┬──────────────┬───────────────────────┤
│   UI State   │  Form State  │ Server State │   Global App State    │
│              │              │              │                       │
│ - Modal open │ - Input vals │ - API data   │ - User session        │
│ - Dropdown   │ - Validation │ - Cache      │ - Theme               │
│ - Hover      │ - Dirty/clean│ - Loading    │ - Feature flags       │
│              │              │              │                       │
│  useState()  │  React Hook  │ React Query  │  Zustand/Redux        │
│              │    Form      │  SWR         │  Context              │
└──────────────┴──────────────┴──────────────┴───────────────────────┘
```

### The Golden Rule

> **Put state as close to where it's used as possible, and lift it up only when necessary.**

---

## 2. Local State: useState & useReducer

### useState: Simple Values

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(c => c + 1)}>
      Count: {count}
    </button>
  );
}
```

**Use when:** Single value, simple updates, one component owns it.

### useReducer: Complex Logic

```jsx
const initialState = { count: 0, step: 1 };

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { ...state, count: state.count + state.step };
    case 'decrement':
      return { ...state, count: state.count - state.step };
    case 'setStep':
      return { ...state, step: action.payload };
    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
      <span>{state.count}</span>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <input
        type="number"
        value={state.step}
        onChange={(e) => dispatch({ type: 'setStep', payload: +e.target.value })}
      />
    </>
  );
}
```

**Use when:** Multiple related values, complex update logic, state machine-like behavior.

---

## 3. Prop Drilling vs Context vs State Library

### The Problem: Prop Drilling

```jsx
// Passing theme through 5 levels of components
<App theme={theme}>
  <Layout theme={theme}>
    <Sidebar theme={theme}>
      <Menu theme={theme}>
        <MenuItem theme={theme} />  // Finally uses it!
      </Menu>
    </Sidebar>
  </Layout>
</App>
```

### Solution 1: React Context

```jsx
// Create context
const ThemeContext = createContext('light');

// Provide at top level
function App() {
  const [theme, setTheme] = useState('light');

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <Layout />
    </ThemeContext.Provider>
  );
}

// Consume anywhere below
function MenuItem() {
  const { theme, setTheme } = useContext(ThemeContext);
  return <button className={theme}>Toggle</button>;
}
```

### Context Gotcha: Re-renders

```jsx
// BAD: Every consumer re-renders when ANY value changes
const AppContext = createContext();

function App() {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('light');
  const [notifications, setNotifications] = useState([]);

  return (
    <AppContext.Provider value={{ user, theme, notifications, setTheme }}>
      {/* ALL consumers re-render when notifications change */}
    </AppContext.Provider>
  );
}

// GOOD: Split into separate contexts
<UserContext.Provider value={user}>
  <ThemeContext.Provider value={{ theme, setTheme }}>
    <NotificationContext.Provider value={notifications}>
      {children}
    </NotificationContext.Provider>
  </ThemeContext.Provider>
</UserContext.Provider>
```

### When Context Falls Short

| Scenario | Problem with Context |
|----------|---------------------|
| High-frequency updates | Every consumer re-renders |
| Complex state logic | No built-in reducer pattern |
| DevTools debugging | No time-travel debugging |
| Middleware (logging, async) | Must build yourself |

---

## 4. Server State: React Query / SWR

Server state is **fundamentally different** from client state:
- It's owned by the server, not the client
- It can become stale
- It needs caching, deduplication, and background refetching

### React Query Basics

```jsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Fetching data
function UserProfile({ userId }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetch(`/api/users/${userId}`).then(r => r.json()),
    staleTime: 5 * 60 * 1000,  // Consider fresh for 5 minutes
  });

  if (isLoading) return <Spinner />;
  if (error) return <Error message={error.message} />;

  return <div>{data.name}</div>;
}

// Mutating data
function UpdateUser({ userId }) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newData) =>
      fetch(`/api/users/${userId}`, {
        method: 'PUT',
        body: JSON.stringify(newData),
      }),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['user', userId] });
    },
  });

  return (
    <button onClick={() => mutation.mutate({ name: 'New Name' })}>
      Update
    </button>
  );
}
```

### React Query: Under the Hood

```
┌─────────────────────────────────────────────────────────────────┐
│                    React Query Cache                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ['users']          → { data: [...], updatedAt: 1234567890 }    │
│  ['user', 1]        → { data: {...}, updatedAt: 1234567891 }    │
│  ['user', 2]        → { data: {...}, updatedAt: 1234567892 }    │
│  ['posts', {page:1}]→ { data: [...], updatedAt: 1234567893 }    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

Automatic behaviors:
1. Deduplication: 10 components request ['user', 1] → 1 network call
2. Background refetch: When tab regains focus
3. Stale-while-revalidate: Show cached, fetch fresh in background
4. Garbage collection: Remove unused queries after 5 minutes
```

### React Query vs SWR

| Feature | React Query | SWR |
|---------|-------------|-----|
| **Bundle Size** | ~13KB | ~4KB |
| **Devtools** | Excellent | Basic |
| **Mutations** | First-class | Manual |
| **Pagination** | Built-in hooks | DIY |
| **Optimistic Updates** | Easy | DIY |
| **Best For** | Complex apps | Simpler needs |

---

## 5. Global State: Zustand

Zustand is the modern choice for global client state—simple, fast, no boilerplate.

### Basic Store

```js
import { create } from 'zustand';

const useStore = create((set, get) => ({
  // State
  count: 0,
  user: null,

  // Actions
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  setUser: (user) => set({ user }),

  // Async actions
  fetchUser: async (id) => {
    const response = await fetch(`/api/users/${id}`);
    const user = await response.json();
    set({ user });
  },

  // Computed (using get)
  doubleCount: () => get().count * 2,
}));

// Usage in component
function Counter() {
  const count = useStore((state) => state.count);
  const increment = useStore((state) => state.increment);

  return <button onClick={increment}>{count}</button>;
}
```

### Selective Subscriptions (Performance)

```jsx
// BAD: Re-renders on ANY state change
function Component() {
  const store = useStore();  // Subscribes to entire store
  return <div>{store.count}</div>;
}

// GOOD: Only re-renders when count changes
function Component() {
  const count = useStore((state) => state.count);
  return <div>{count}</div>;
}

// GOOD: Multiple values with shallow comparison
import { shallow } from 'zustand/shallow';

function Component() {
  const { count, user } = useStore(
    (state) => ({ count: state.count, user: state.user }),
    shallow  // Prevents re-render if object reference changes but values don't
  );
}
```

### Zustand with Middleware

```js
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

const useStore = create(
  devtools(
    persist(
      (set) => ({
        count: 0,
        increment: () => set((state) => ({ count: state.count + 1 })),
      }),
      {
        name: 'my-store',  // localStorage key
      }
    ),
    { name: 'MyStore' }  // DevTools name
  )
);
```

---

## 6. Redux: When You Need It

Redux is still relevant for **very large teams** and **complex requirements**.

### Modern Redux Toolkit

```js
import { createSlice, configureStore } from '@reduxjs/toolkit';

// Slice = reducer + actions in one
const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    increment: (state) => {
      state.value += 1;  // Immer allows "mutation"
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload;
    },
  },
});

export const { increment, decrement, incrementByAmount } = counterSlice.actions;

// Store
const store = configureStore({
  reducer: {
    counter: counterSlice.reducer,
  },
});

// Usage
function Counter() {
  const count = useSelector((state) => state.counter.value);
  const dispatch = useDispatch();

  return (
    <button onClick={() => dispatch(increment())}>
      {count}
    </button>
  );
}
```

### Redux vs Zustand

| Aspect | Redux Toolkit | Zustand |
|--------|---------------|---------|
| **Boilerplate** | Medium | Minimal |
| **Learning Curve** | Steeper | Gentle |
| **DevTools** | Excellent | Good |
| **Bundle Size** | ~11KB + react-redux | ~3KB |
| **Middleware** | Rich ecosystem | Basic built-in |
| **Best For** | Large teams, strict patterns | Most apps |

---

## 7. Form State: React Hook Form

Forms are a special category—they're high-frequency updates with validation.

```jsx
import { useForm } from 'react-hook-form';

function SignupForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    await api.signup(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register('email', {
          required: 'Email is required',
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Invalid email',
          },
        })}
      />
      {errors.email && <span>{errors.email.message}</span>}

      <input
        type="password"
        {...register('password', {
          required: 'Password is required',
          minLength: { value: 8, message: 'Min 8 characters' },
        })}
      />
      {errors.password && <span>{errors.password.message}</span>}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Signing up...' : 'Sign Up'}
      </button>
    </form>
  );
}
```

### Why Not useState for Forms?

```jsx
// BAD: Re-renders on every keystroke
function Form() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // ... 10 more fields

  return (
    <input value={email} onChange={(e) => setEmail(e.target.value)} />
    // Component re-renders on EVERY character typed
  );
}

// GOOD: React Hook Form uses refs, minimal re-renders
// Only re-renders when you explicitly watch a field
```

---

## 8. Decision Framework

```
┌─────────────────────────────────────────────────────────────────┐
│                    STATE DECISION TREE                           │
└─────────────────────────────────────────────────────────────────┘

Is it SERVER data (from API)?
├── YES → React Query / SWR
│         (caching, background refetch, deduplication)
│
└── NO → Is it used by MULTIPLE components?
         ├── NO → useState / useReducer
         │        (keep it local)
         │
         └── YES → How many components? How often does it change?
                   │
                   ├── Few components, low frequency
                   │   → Context (simple, built-in)
                   │
                   ├── Many components, medium frequency
                   │   → Zustand (simple, performant)
                   │
                   └── Enterprise, strict patterns, large team
                       → Redux Toolkit (conventions, ecosystem)

Is it FORM data?
└── YES → React Hook Form / Formik
          (validation, performance, submission handling)
```

---

## 9. Anti-Patterns to Avoid

### 1. Putting Everything in Global State

```js
// BAD: Modal open state doesn't need to be global
const useStore = create((set) => ({
  isModalOpen: false,  // This should be local!
  products: [],        // This might need to be global
}));

// GOOD: Keep modal state local
function ProductPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const products = useStore((s) => s.products);
}
```

### 2. Duplicating Server State

```js
// BAD: Copying API data into Redux
dispatch(setProducts(await fetchProducts()));

// Now you have TWO sources of truth:
// 1. What's in your Redux store
// 2. What's actually on the server

// GOOD: Use React Query as the source of truth
const { data: products } = useQuery({
  queryKey: ['products'],
  queryFn: fetchProducts,
});
```

### 3. Not Memoizing Selectors

```jsx
// BAD: Creates new array on every render
function ProductList() {
  const products = useStore((state) =>
    state.products.filter((p) => p.inStock)  // New array every render!
  );
}

// GOOD: Memoize the selector
const selectInStockProducts = (state) =>
  state.products.filter((p) => p.inStock);

// Or use a memoization library
import { createSelector } from 'reselect';
```

---

## 10. Interview Tip

> "I think about state in layers: UI state stays local with useState, server state goes in React Query for automatic caching and background updates, and true global client state (like user session or theme) goes in Zustand for its simplicity and performance. I avoid putting everything in global state—that leads to unnecessary complexity and re-renders. For forms, React Hook Form handles validation and minimizes re-renders. The key is matching the tool to the type of state, not forcing one solution for everything."
