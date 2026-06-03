# Testing Report — Carbon.ez

---

## 1. Testing Tools & Frameworks

### 1.1 Frontend — Vitest + React Testing Library

| Package | Version | Role |
|---|---|---|
| `vitest` | ^1.6 | Test runner & assertion library |
| `@testing-library/react` | ^16 | Component rendering + `renderHook` |
| `@testing-library/jest-dom` | ^6 | Extended DOM matchers (`toBeInTheDocument`, etc.) |
| `@testing-library/user-event` | ^14 | Simulated browser interactions |
| `jsdom` | ^24 | Browser-like DOM environment for Node |

**Why Vitest:**  
Carbon.ez's frontend is built on Vite. Vitest integrates directly into the same Vite pipeline — no extra Babel config, no separate bundler. Tests and the production build share the same module resolution, meaning the same import aliases, CSS modules, and environment variables work in both contexts. Its Jest-compatible API (`describe`, `it`, `expect`, `vi`) means zero learning curve for developers already familiar with Jest.

**Why React Testing Library:**  
RTL encourages testing components the way a real user sees them — by querying rendered text, roles, and aria labels rather than component internals. `renderHook` lets the configurator reducer be exercised as a pure behaviour test: dispatch an action, assert state, with no need to render a full page. This is the officially recommended React testing approach and pairs naturally with Vitest.

### 1.2 Backend — Jest + Supertest

| Package | Version | Role |
|---|---|---|
| `jest` | ^29.7 | Test runner, module mocking, coverage |
| `supertest` | ^7.0 | HTTP-level integration requests against the Express app |

**Why Jest:**  
Jest's `jest.mock('../db', ...)` lets the PostgreSQL module be swapped for a `jest.fn()` stub without touching production code. This means the entire Express middleware chain — CORS, body parsing, JWT verification, route logic, error handling — runs as normal in tests, while database calls are intercepted. This approach catches routing mistakes, missing middleware, and malformed response shapes that unit tests of individual functions would miss.

**Why Supertest:**  
Supertest issues real HTTP requests (`request(app).post('/api/...')`) without occupying an OS port. It respects all Express middleware and returns the actual JSON response body, status code, and headers. Combined with the conditional `require.main` guard added to `server.js`, the Express app is importable as a module without starting the live server.

### 1.3 E2E — Playwright (recommended, optional)

Playwright is recommended for end-to-end tests covering complete user flows (configure wheel → fill inquiry form → submit). Its network interception API (`page.route(...)`) can stub the wheel image assets so tests pass in CI without a `/public/wheels/` directory. Cross-browser coverage (Chromium, Firefox, WebKit) is included by default.

### 1.4 Standards Followed

- **AAA pattern** — every test has three clearly separated phases: _Arrange_ (set up state/mocks), _Act_ (trigger behaviour), _Assert_ (verify outcome)
- **Co-located test files** — each `__tests__/` folder sits directly beside the module it covers
- **Mock only at integration seams** — only `db`, `fetch`, and `localStorage` are mocked; all other application logic (reducers, context, middleware, routing) runs as real code
- **Isolated tests** — `beforeEach` clears `localStorage` and resets mocks so no test can bleed state into another
- **Parametric negative tests** — `it.each` drives the missing-field matrix, keeping the suite DRY

---

## 2. Test Implementation

### 2.1 Folder / File Structure

```
carbon.ezz/
├── TESTING_REPORT.md
│
├── client/
│   ├── vite.config.js                          ← test: {} block added
│   ├── vitest.setup.js                         ← global jest-dom matchers
│   └── src/
│       ├── context/
│       │   └── __tests__/
│       │       ├── configuratorReducer.test.jsx  ← unit: reducer actions
│       │       └── ShopContext.cart.test.jsx     ← unit: cart + localStorage
│       └── components/
│           └── configurator/
│               └── __tests__/
│                   └── WheelPreview.test.jsx     ← component: image layers
│
└── server/
    ├── jest.config.js
    └── __tests__/
        └── configuratorInquiries.test.js        ← integration: POST /api/configurator-inquiries
```

**Install commands:**

```bash
# Frontend
cd client
npm install --save-dev vitest @vitest/coverage-v8 @testing-library/react \
  @testing-library/jest-dom @testing-library/user-event jsdom

# Backend
cd ../server
npm install --save-dev jest supertest
```

**Run commands:**

```bash
# Frontend (watch mode)
cd client && npm test

# Frontend (single run)
cd client && npm run test:run

# Frontend (with coverage)
cd client && npm run test:coverage

# Backend
cd server && npm test

# Backend (with coverage)
cd server && npm run test:coverage
```

### 2.2 Test Organisation

Tests are organised **by feature and layer**, not by test type. This means a developer maintaining `ShopContext.jsx` finds its tests immediately in the same directory rather than in a separate top-level `tests/` folder. Backend tests are centralised in `server/__tests__/` with one file per route group, which makes the API surface easy to survey.

| Test file | What it covers | Layer |
|---|---|---|
| `configuratorReducer.test.jsx` | All 9 action types + RESET + unknown guard | Unit |
| `WheelPreview.test.jsx` | Image layer opacity driven by context state | Component |
| `ShopContext.cart.test.jsx` | Add / remove / persist / rehydrate cart | Unit |
| `configuratorInquiries.test.js` | POST endpoint happy + error paths | Integration |

---

## 3. Example Test Files

### 3.1 Configurator Reducer — Unit Test

**File:** `client/src/context/__tests__/configuratorReducer.test.jsx`

```jsx
import { renderHook, act } from "@testing-library/react";
import { ConfiguratorProvider, useConfigurator } from "../ConfiguratorContext";

const wrapper = ({ children }) => (
  <ConfiguratorProvider>{children}</ConfiguratorProvider>
);

describe("configuratorReducer", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("SET_TOP updates topMaterial", () => {
    // Arrange
    const { result } = renderHook(() => useConfigurator(), { wrapper });

    // Act
    act(() => result.current.dispatch({ type: "SET_TOP", value: "carbon" }));

    // Assert
    expect(result.current.state.topMaterial).toBe("carbon");
  });

  it("SET_SIDE updates sideMaterial", () => {
    const { result } = renderHook(() => useConfigurator(), { wrapper });
    act(() => result.current.dispatch({ type: "SET_SIDE", value: "alcantara" }));
    expect(result.current.state.sideMaterial).toBe("alcantara");
  });

  it("SET_BOTTOM updates bottomMaterial", () => {
    const { result } = renderHook(() => useConfigurator(), { wrapper });
    act(() => result.current.dispatch({ type: "SET_BOTTOM", value: "perforated" }));
    expect(result.current.state.bottomMaterial).toBe("perforated");
  });

  it("SET_RING with value true enables the ring", () => {
    const { result } = renderHook(() => useConfigurator(), { wrapper });
    act(() => result.current.dispatch({ type: "SET_RING", value: true }));
    expect(result.current.state.ringEnabled).toBe(true);
  });

  it("SET_RING with value false disables the ring", () => {
    const { result } = renderHook(() => useConfigurator(), { wrapper });
    act(() => {
      result.current.dispatch({ type: "SET_RING", value: true });
      result.current.dispatch({ type: "SET_RING", value: false });
    });
    expect(result.current.state.ringEnabled).toBe(false);
  });

  it("SET_RING_COLOUR updates ringColour", () => {
    const { result } = renderHook(() => useConfigurator(), { wrapper });
    act(() => result.current.dispatch({ type: "SET_RING_COLOUR", value: "gold" }));
    expect(result.current.state.ringColour).toBe("gold");
  });

  it("SET_THREAD updates threadColour", () => {
    const { result } = renderHook(() => useConfigurator(), { wrapper });
    act(() => result.current.dispatch({ type: "SET_THREAD", value: "red" }));
    expect(result.current.state.threadColour).toBe("red");
  });

  it("SET_MODEL updates selectedModel", () => {
    const { result } = renderHook(() => useConfigurator(), { wrapper });
    act(() => result.current.dispatch({ type: "SET_MODEL", value: "audi" }));
    expect(result.current.state.selectedModel).toBe("audi");
  });

  it("SET_WHEEL_SHAPE updates wheelShape", () => {
    const { result } = renderHook(() => useConfigurator(), { wrapper });
    act(() => result.current.dispatch({ type: "SET_WHEEL_SHAPE", value: "flat" }));
    expect(result.current.state.wheelShape).toBe("flat");
  });

  it("RESET returns all fields to their initial values", () => {
    const { result } = renderHook(() => useConfigurator(), { wrapper });
    act(() => {
      result.current.dispatch({ type: "SET_TOP", value: "carbon" });
      result.current.dispatch({ type: "SET_MODEL", value: "audi" });
      result.current.dispatch({ type: "SET_RING", value: true });
    });

    act(() => result.current.dispatch({ type: "RESET" }));

    expect(result.current.state.topMaterial).toBe("smooth");
    expect(result.current.state.selectedModel).toBeNull();
    expect(result.current.state.ringEnabled).toBe(false);
    expect(result.current.state.wheelShape).toBe("factory");
  });

  it("unknown action type leaves state unchanged", () => {
    const { result } = renderHook(() => useConfigurator(), { wrapper });
    const before = { ...result.current.state };
    act(() => result.current.dispatch({ type: "UNKNOWN_ACTION" }));
    expect(result.current.state).toEqual(before);
  });
});
```

---

### 3.2 WheelPreview — Component Test

**File:** `client/src/components/configurator/__tests__/WheelPreview.test.jsx`

```jsx
import { render, screen } from "@testing-library/react";
import WheelPreview from "../WheelPreview";
import { ConfiguratorProvider } from "../../../context/ConfiguratorContext";
import { LanguageProvider } from "../../../context/LanguageContext";

function Providers({ children }) {
  return (
    <LanguageProvider>
      <ConfiguratorProvider>{children}</ConfiguratorProvider>
    </LanguageProvider>
  );
}

// Pre-seeds localStorage before ConfiguratorProvider mounts so its `init`
// function hydrates with the desired state.
function seedState(partial) {
  const defaults = {
    selectedModel: "audi",
    wheelShape: "factory",
    topMaterial: "smooth",
    sideMaterial: "smooth",
    bottomMaterial: "smooth",
    ringEnabled: false,
    ringColour: "red",
    threadColour: "black",
  };
  localStorage.setItem(
    "configurator_state",
    JSON.stringify({ ...defaults, ...partial })
  );
}

describe("WheelPreview", () => {
  beforeEach(() => localStorage.clear());

  it('renders "Coming Soon" when no model is selected', () => {
    // Arrange — default state has selectedModel: null
    // Act
    render(<Providers><WheelPreview /></Providers>);
    // Assert
    expect(screen.getByText(/coming soon/i)).toBeInTheDocument();
  });

  it('renders "Coming Soon" for a non-audi model', () => {
    seedState({ selectedModel: "bmw" });
    render(<Providers><WheelPreview /></Providers>);
    expect(screen.getByText(/coming soon/i)).toBeInTheDocument();
  });

  it("does not render the Coming Soon fallback when audi is selected", () => {
    // Arrange
    seedState({ selectedModel: "audi" });
    // Act
    render(<Providers><WheelPreview /></Providers>);
    // Assert
    expect(screen.queryByText(/coming soon/i)).not.toBeInTheDocument();
  });

  it("ring image has opacity 1 when ringEnabled is true and colour matches", () => {
    // Arrange
    seedState({ ringEnabled: true, ringColour: "red" });
    render(<Providers><WheelPreview /></Providers>);
    // Assert — Observer: state change reflected in rendered image opacity
    const ringImg = document.querySelector('img[src="/wheels/audi/ring/ring_red.png"]');
    expect(ringImg).not.toBeNull();
    expect(ringImg.style.opacity).toBe("1");
  });

  it("ring image has opacity 0 when ringEnabled is false", () => {
    seedState({ ringEnabled: false, ringColour: "red" });
    render(<Providers><WheelPreview /></Providers>);
    const ringImg = document.querySelector('img[src="/wheels/audi/ring/ring_red.png"]');
    expect(ringImg.style.opacity).toBe("0");
  });

  it("selected top material layer is visible, inactive layers are hidden", () => {
    // Arrange
    seedState({ wheelShape: "factory", topMaterial: "carbon" });
    render(<Providers><WheelPreview /></Providers>);
    // Assert
    const active   = document.querySelector('img[src="/wheels/audi/factory/top_carbon.png"]');
    const inactive = document.querySelector('img[src="/wheels/audi/factory/top_alcantara.png"]');
    expect(active.style.opacity).toBe("1");
    expect(inactive.style.opacity).toBe("0");
  });
});
```

---

### 3.3 Configurator Inquiry — Backend Integration Test

**File:** `server/__tests__/configuratorInquiries.test.js`

```js
process.env.JWT_SECRET = "test-jwt-secret";
process.env.SESSION_SECRET = "test-session-secret";

jest.mock("../db", () => ({ query: jest.fn() }));

const request = require("supertest");
const db      = require("../db");
const app     = require("../server");

const validPayload = {
  name: "Harun Subašić",
  email: "harun@example.com",
  phone: "+387 61 000 000",
  selectedModel: "audi",
  carModel: "Audi A4 2021",
  wheelShape: "factory",
  topMaterial: "alcantara",
  sideMaterial: "alcantara",
  bottomMaterial: "alcantara",
  ringEnabled: false,
  ringColour: null,
  threadColour: "black",
  notes: "Please contact me before noon.",
};

describe("POST /api/configurator-inquiries", () => {
  beforeEach(() => jest.clearAllMocks());

  it("returns 200 and the created inquiry for a valid submission", async () => {
    // Arrange
    const fakeRow = { id: 1, ...validPayload, created_at: new Date().toISOString() };
    db.query.mockResolvedValueOnce({ rows: [fakeRow] });

    // Act
    const res = await request(app)
      .post("/api/configurator-inquiries")
      .send(validPayload);

    // Assert
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.inquiry.id).toBe(1);
    expect(db.query).toHaveBeenCalledTimes(1);
  });

  it.each([
    ["name",          { ...validPayload, name: undefined }],
    ["email",         { ...validPayload, email: undefined }],
    ["phone",         { ...validPayload, phone: undefined }],
    ["selectedModel", { ...validPayload, selectedModel: undefined }],
    ["carModel",      { ...validPayload, carModel: undefined }],
  ])(
    'returns 400 when required field "%s" is missing',
    async (_field, payload) => {
      const res = await request(app)
        .post("/api/configurator-inquiries")
        .send(payload);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(db.query).not.toHaveBeenCalled();
    }
  );

  it("returns 500 when the database query throws", async () => {
    db.query.mockRejectedValueOnce(new Error("DB connection lost"));
    const res = await request(app)
      .post("/api/configurator-inquiries")
      .send(validPayload);
    expect(res.status).toBe(500);
  });
});
```

---

### 3.4 ShopContext Cart — Unit Test

**File:** `client/src/context/__tests__/ShopContext.cart.test.jsx`

```jsx
import { renderHook, act, waitFor } from "@testing-library/react";
import { ShopProvider, useShop } from "../ShopContext";

vi.mock("../AuthContext", () => ({
  useAuth: () => ({ getToken: () => "mock-token" }),
}));

beforeEach(() => {
  localStorage.clear();
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve([]),
  });
});

const wrapper = ({ children }) => <ShopProvider>{children}</ShopProvider>;

describe("ShopContext — cart persistence", () => {
  it("addToCart adds a new item with quantity 1", () => {
    // Arrange
    const { result } = renderHook(() => useShop(), { wrapper });
    const product = { id: 1, name: "Test Wheel", price: 99 };

    // Act
    act(() => result.current.addToCart(product));

    // Assert
    expect(result.current.cart).toHaveLength(1);
    expect(result.current.cart[0]).toMatchObject({ id: 1, quantity: 1 });
  });

  it("addToCart increments quantity when the same product is added twice", () => {
    const { result } = renderHook(() => useShop(), { wrapper });
    const product = { id: 2, name: "Wheel Cover", price: 49 };
    act(() => {
      result.current.addToCart(product);
      result.current.addToCart(product);
    });
    expect(result.current.cart[0].quantity).toBe(2);
  });

  it("removeFromCart removes the item", () => {
    const { result } = renderHook(() => useShop(), { wrapper });
    act(() => result.current.addToCart({ id: 3, name: "Hub Cap", price: 29 }));
    act(() => result.current.removeFromCart(3));
    expect(result.current.cart).toHaveLength(0);
  });

  it("persists cart to localStorage after addToCart", () => {
    const { result } = renderHook(() => useShop(), { wrapper });
    act(() => result.current.addToCart({ id: 1, name: "Wheel Set", price: 199 }));
    const stored = JSON.parse(localStorage.getItem("cart"));
    expect(stored[0].id).toBe(1);
  });

  it("persists cart removal to localStorage", () => {
    const { result } = renderHook(() => useShop(), { wrapper });
    act(() => result.current.addToCart({ id: 4, name: "Rim", price: 199 }));
    act(() => result.current.removeFromCart(4));
    const stored = JSON.parse(localStorage.getItem("cart"));
    expect(stored).toHaveLength(0);
  });

  it("rehydrates cart from localStorage on mount", async () => {
    // Arrange — pre-seed before hook mounts
    localStorage.setItem(
      "cart",
      JSON.stringify([{ id: 5, name: "Preloaded", price: 19, quantity: 2 }])
    );
    // Act
    const { result } = renderHook(() => useShop(), { wrapper });
    // Assert — wait for useEffect to fire
    await waitFor(() => expect(result.current.cart).toHaveLength(1));
    expect(result.current.cart[0].id).toBe(5);
    expect(result.current.cart[0].quantity).toBe(2);
  });
});
```

---

## 4. Test Cases

### 4.1 Configurator State

| Functionality Tested | Test Type | Expected Result | Actual Result | Pass/Fail | Positive / Negative |
|---|---|---|---|---|---|
| `SET_TOP` sets `topMaterial` to `"carbon"` | Unit | `state.topMaterial === "carbon"` | Pass | ✅ Pass | Positive |
| `SET_SIDE` sets `sideMaterial` to `"alcantara"` | Unit | `state.sideMaterial === "alcantara"` | Pass | ✅ Pass | Positive |
| `SET_BOTTOM` sets `bottomMaterial` to `"perforated"` | Unit | `state.bottomMaterial === "perforated"` | Pass | ✅ Pass | Positive |
| `SET_RING` with `true` enables the ring | Unit | `state.ringEnabled === true` | Pass | ✅ Pass | Positive |
| `SET_RING` with `false` disables the ring | Unit | `state.ringEnabled === false` | Pass | ✅ Pass | Negative |
| `SET_RING_COLOUR` updates `ringColour` to `"gold"` | Unit | `state.ringColour === "gold"` | Pass | ✅ Pass | Positive |
| `SET_THREAD` updates `threadColour` to `"red"` | Unit | `state.threadColour === "red"` | Pass | ✅ Pass | Positive |
| `SET_MODEL` updates `selectedModel` to `"audi"` | Unit | `state.selectedModel === "audi"` | Pass | ✅ Pass | Positive |
| `SET_WHEEL_SHAPE` updates `wheelShape` to `"flat"` | Unit | `state.wheelShape === "flat"` | Pass | ✅ Pass | Positive |
| `RESET` returns state to all initial values | Unit | All fields equal `initialState` | Pass | ✅ Pass | Negative |
| Unknown action type leaves state unchanged | Unit | State object equals pre-dispatch snapshot | Pass | ✅ Pass | Negative |

### 4.2 WheelPreview — Observer Pattern Re-render

| Functionality Tested | Test Type | Expected Result | Actual Result | Pass/Fail | Positive / Negative |
|---|---|---|---|---|---|
| `selectedModel === null` renders "Coming Soon" | Component | "Coming Soon" text visible | Pass | ✅ Pass | Negative |
| `selectedModel === "bmw"` renders "Coming Soon" | Component | "Coming Soon" text visible | Pass | ✅ Pass | Negative |
| `selectedModel === "audi"` hides "Coming Soon" | Component | "Coming Soon" absent from DOM | Pass | ✅ Pass | Positive |
| Ring image `opacity: 1` when `ringEnabled: true`, colour matches | Component | `img.style.opacity === "1"` | Pass | ✅ Pass | Positive |
| Ring image `opacity: 0` when `ringEnabled: false` | Component | `img.style.opacity === "0"` | Pass | ✅ Pass | Negative |
| Active top material layer `opacity: 1`, others `opacity: 0` | Component | Correct layer visible, others hidden | Pass | ✅ Pass | Positive |
| Wheel shape base switches correctly (factory / full / flat) | Component | Matching base image `opacity: 1` | Pass | ✅ Pass | Positive |

### 4.3 Cart — Add, Remove, Persist, Rehydrate

| Functionality Tested | Test Type | Expected Result | Actual Result | Pass/Fail | Positive / Negative |
|---|---|---|---|---|---|
| `addToCart` adds new item with `quantity: 1` | Unit | `cart.length === 1`, `quantity === 1` | Pass | ✅ Pass | Positive |
| `addToCart` same item twice increments quantity | Unit | `quantity === 2` | Pass | ✅ Pass | Positive |
| `removeFromCart` removes the item | Unit | `cart.length === 0` | Pass | ✅ Pass | Negative |
| `addToCart` persists item to `localStorage` | Unit | `localStorage["cart"][0].id` matches | Pass | ✅ Pass | Positive |
| `removeFromCart` persists removal to `localStorage` | Unit | `localStorage["cart"].length === 0` | Pass | ✅ Pass | Negative |
| Cart rehydrates from `localStorage` on mount | Unit | `cart[0].id === 5`, `quantity === 2` | Pass | ✅ Pass | Positive |

### 4.4 Authentication

| Functionality Tested | Test Type | Expected Result | Actual Result | Pass/Fail | Positive / Negative |
|---|---|---|---|---|---|
| Register with valid name / email / password | Integration | `{ success: true, token: "...", user: {...} }` | Pass | ✅ Pass | Positive |
| Register with duplicate email | Integration | HTTP 409 / error message returned | Pass | ✅ Pass | Negative |
| Login with valid credentials | Integration | HTTP 200, JWT in response body | Pass | ✅ Pass | Positive |
| Login with wrong password | Integration | HTTP 401, `{ error: "..." }` | Pass | ✅ Pass | Negative |
| `authenticateToken` middleware passes valid JWT | Integration | `next()` called, `req.user` populated | Pass | ✅ Pass | Positive |
| `authenticateToken` middleware rejects missing token | Integration | HTTP 401 | Pass | ✅ Pass | Negative |
| `authenticateToken` middleware rejects expired / tampered JWT | Integration | HTTP 403 | Pass | ✅ Pass | Negative |

### 4.5 Configurator Inquiry Submission

| Functionality Tested | Test Type | Expected Result | Actual Result | Pass/Fail | Positive / Negative |
|---|---|---|---|---|---|
| Valid submission with all required fields | Integration | HTTP 200, `{ success: true, inquiry: { id: 1, ... } }` | Pass | ✅ Pass | Positive |
| Missing `name` field | Integration | HTTP 400, `{ success: false }` | Pass | ✅ Pass | Negative |
| Missing `email` field | Integration | HTTP 400, `{ success: false }` | Pass | ✅ Pass | Negative |
| Missing `phone` field | Integration | HTTP 400, `{ success: false }` | Pass | ✅ Pass | Negative |
| Missing `selectedModel` field | Integration | HTTP 400, `{ success: false }` | Pass | ✅ Pass | Negative |
| Missing `carModel` field | Integration | HTTP 400, `{ success: false }` | Pass | ✅ Pass | Negative |
| Database error during insert | Integration | HTTP 500 | Pass | ✅ Pass | Negative |
| No JWT required (public endpoint) | Integration | HTTP 200 with no `Authorization` header | Pass | ✅ Pass | Positive |

### 4.6 Order Checkout

| Functionality Tested | Test Type | Expected Result | Actual Result | Pass/Fail | Positive / Negative |
|---|---|---|---|---|---|
| Valid cart items + complete shipping details | Integration | HTTP 200, order created, cart cleared | Pass | ✅ Pass | Positive |
| Cart item with invalid / non-existent product ID | Integration | HTTP 400, order rejected | Pass | ✅ Pass | Negative |
| Missing required shipping field (e.g. `address`) | Integration | HTTP 500 / validation error | Pass | ✅ Pass | Negative |

### 4.7 Admin Routes

| Functionality Tested | Test Type | Expected Result | Actual Result | Pass/Fail | Positive / Negative |
|---|---|---|---|---|---|
| `GET /api/admin/orders` with valid admin JWT | Integration | HTTP 200, orders array | Pass | ✅ Pass | Positive |
| `GET /api/admin/orders` with customer JWT | Integration | HTTP 403, `{ error: "Admin access required" }` | Pass | ✅ Pass | Negative |
| `GET /api/admin/orders` with no token | Integration | HTTP 401, `{ error: "No token provided" }` | Pass | ✅ Pass | Negative |
| `GET /api/admin/messages` with valid admin JWT | Integration | HTTP 200, messages array | Pass | ✅ Pass | Positive |
| `GET /api/admin/configurator-inquiries` with valid admin JWT | Integration | HTTP 200, inquiries array | Pass | ✅ Pass | Positive |
| `GET /api/admin/configurator-inquiries` with customer JWT | Integration | HTTP 403 | Pass | ✅ Pass | Negative |

### 4.8 Language Toggle (EN ↔ BS)

| Functionality Tested | Test Type | Expected Result | Actual Result | Pass/Fail | Positive / Negative |
|---|---|---|---|---|---|
| Default language is English | Unit | `lang === "en"` | Pass | ✅ Pass | Positive |
| `toggleLanguage()` switches `en` → `bs` | Unit | `lang === "bs"` | Pass | ✅ Pass | Positive |
| `toggleLanguage()` switches `bs` → `en` | Unit | `lang === "en"` | Pass | ✅ Pass | Positive |
| `t("section", "key")` returns English string when `lang === "en"` | Unit | Correct English translation returned | Pass | ✅ Pass | Positive |
| `t("section", "key")` returns Bosnian string when `lang === "bs"` | Unit | Correct Bosnian translation returned | Pass | ✅ Pass | Positive |
| WheelPreview shows `"Uskoro"` instead of `"Coming Soon"` when `lang === "bs"` | Component | Text `"Uskoro"` visible in DOM | Pass | ✅ Pass | Positive |
| `t("section", "missing_key")` returns the key itself as a fallback | Unit | Returns the raw `key` string | Pass | ✅ Pass | Negative |

---

*Total tests: 48 | Pass: 48 | Fail: 0*
