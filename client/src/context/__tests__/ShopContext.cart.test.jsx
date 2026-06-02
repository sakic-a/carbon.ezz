import { renderHook, act, waitFor } from "@testing-library/react";
import { ShopProvider, useShop } from "../ShopContext";

// Stub AuthContext — ShopProvider calls useAuth() to get getToken
vi.mock("../AuthContext", () => ({
  useAuth: () => ({ getToken: () => "mock-token" }),
}));

// Stub fetch — ShopProvider fetches /api/products on mount
beforeEach(() => {
  localStorage.clear();
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve([]),
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

const wrapper = ({ children }) => <ShopProvider>{children}</ShopProvider>;

describe("ShopContext — cart persistence", () => {
  // ── Add item ──────────────────────────────────────────────────────────────────

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
    // Arrange
    const { result } = renderHook(() => useShop(), { wrapper });
    const product = { id: 2, name: "Wheel Cover", price: 49 };

    // Act
    act(() => {
      result.current.addToCart(product);
      result.current.addToCart(product);
    });

    // Assert
    expect(result.current.cart).toHaveLength(1);
    expect(result.current.cart[0].quantity).toBe(2);
  });

  // ── Remove item ───────────────────────────────────────────────────────────────

  it("removeFromCart removes the item from the cart", () => {
    // Arrange
    const { result } = renderHook(() => useShop(), { wrapper });
    act(() => result.current.addToCart({ id: 3, name: "Hub Cap", price: 29 }));

    // Act
    act(() => result.current.removeFromCart(3));

    // Assert
    expect(result.current.cart).toHaveLength(0);
  });

  // ── localStorage persistence ──────────────────────────────────────────────────

  it("persists cart to localStorage after addToCart", () => {
    // Arrange
    const { result } = renderHook(() => useShop(), { wrapper });

    // Act
    act(() =>
      result.current.addToCart({ id: 1, name: "Wheel Set", price: 199 })
    );

    // Assert
    const stored = JSON.parse(localStorage.getItem("cart"));
    expect(stored).toHaveLength(1);
    expect(stored[0].id).toBe(1);
  });

  it("persists cart removal to localStorage after removeFromCart", () => {
    // Arrange
    const { result } = renderHook(() => useShop(), { wrapper });
    act(() =>
      result.current.addToCart({ id: 4, name: "Rim", price: 199 })
    );

    // Act
    act(() => result.current.removeFromCart(4));

    // Assert
    const stored = JSON.parse(localStorage.getItem("cart"));
    expect(stored).toHaveLength(0);
  });

  // ── Rehydration ───────────────────────────────────────────────────────────────

  it("rehydrates cart from localStorage on mount", async () => {
    // Arrange — pre-seed localStorage before the hook mounts
    const saved = [{ id: 5, name: "Preloaded", price: 19, quantity: 2 }];
    localStorage.setItem("cart", JSON.stringify(saved));

    // Act
    const { result } = renderHook(() => useShop(), { wrapper });

    // Assert — wait for the useEffect to run and set state
    await waitFor(() => expect(result.current.cart).toHaveLength(1));
    expect(result.current.cart[0].id).toBe(5);
    expect(result.current.cart[0].quantity).toBe(2);
  });
});
