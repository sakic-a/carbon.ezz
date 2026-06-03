import { renderHook, act } from "@testing-library/react";
import { ConfiguratorProvider, useConfigurator } from "../ConfiguratorContext";

// Wrap every renderHook call in the ConfiguratorProvider
const wrapper = ({ children }) => (
  <ConfiguratorProvider>{children}</ConfiguratorProvider>
);

describe("configuratorReducer", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  // ── Material zones ───────────────────────────────────────────────────────────

  it("SET_TOP updates topMaterial", () => {
    // Arrange
    const { result } = renderHook(() => useConfigurator(), { wrapper });

    // Act
    act(() => result.current.dispatch({ type: "SET_TOP", value: "carbon" }));

    // Assert
    expect(result.current.state.topMaterial).toBe("carbon");
  });

  it("SET_SIDE updates sideMaterial", () => {
    // Arrange
    const { result } = renderHook(() => useConfigurator(), { wrapper });

    // Act
    act(() => result.current.dispatch({ type: "SET_SIDE", value: "alcantara" }));

    // Assert
    expect(result.current.state.sideMaterial).toBe("alcantara");
  });

  it("SET_BOTTOM updates bottomMaterial", () => {
    // Arrange
    const { result } = renderHook(() => useConfigurator(), { wrapper });

    // Act
    act(() => result.current.dispatch({ type: "SET_BOTTOM", value: "perforated" }));

    // Assert
    expect(result.current.state.bottomMaterial).toBe("perforated");
  });

  // ── Ring toggle ──────────────────────────────────────────────────────────────

  it("SET_RING with value true enables the ring", () => {
    // Arrange
    const { result } = renderHook(() => useConfigurator(), { wrapper });

    // Act
    act(() => result.current.dispatch({ type: "SET_RING", value: true }));

    // Assert
    expect(result.current.state.ringEnabled).toBe(true);
  });

  it("SET_RING with value false disables the ring", () => {
    // Arrange
    const { result } = renderHook(() => useConfigurator(), { wrapper });

    // Act
    act(() => {
      result.current.dispatch({ type: "SET_RING", value: true });
      result.current.dispatch({ type: "SET_RING", value: false });
    });

    // Assert
    expect(result.current.state.ringEnabled).toBe(false);
  });

  // ── Colours ──────────────────────────────────────────────────────────────────

  it("SET_RING_COLOUR updates ringColour", () => {
    // Arrange
    const { result } = renderHook(() => useConfigurator(), { wrapper });

    // Act
    act(() => result.current.dispatch({ type: "SET_RING_COLOUR", value: "gold" }));

    // Assert
    expect(result.current.state.ringColour).toBe("gold");
  });

  it("SET_THREAD updates threadColour", () => {
    // Arrange
    const { result } = renderHook(() => useConfigurator(), { wrapper });

    // Act
    act(() => result.current.dispatch({ type: "SET_THREAD", value: "red" }));

    // Assert
    expect(result.current.state.threadColour).toBe("red");
  });

  // ── Model & wheel shape ──────────────────────────────────────────────────────

  it("SET_MODEL updates selectedModel", () => {
    // Arrange
    const { result } = renderHook(() => useConfigurator(), { wrapper });

    // Act
    act(() => result.current.dispatch({ type: "SET_MODEL", value: "audi" }));

    // Assert
    expect(result.current.state.selectedModel).toBe("audi");
  });

  it("SET_WHEEL_SHAPE updates wheelShape", () => {
    // Arrange
    const { result } = renderHook(() => useConfigurator(), { wrapper });

    // Act
    act(() => result.current.dispatch({ type: "SET_WHEEL_SHAPE", value: "flat" }));

    // Assert
    expect(result.current.state.wheelShape).toBe("flat");
  });

  // ── Reset ────────────────────────────────────────────────────────────────────

  it("RESET returns all fields to their initial values", () => {
    // Arrange
    const { result } = renderHook(() => useConfigurator(), { wrapper });
    act(() => {
      result.current.dispatch({ type: "SET_TOP", value: "carbon" });
      result.current.dispatch({ type: "SET_MODEL", value: "audi" });
      result.current.dispatch({ type: "SET_RING", value: true });
    });

    // Act
    act(() => result.current.dispatch({ type: "RESET" }));

    // Assert
    expect(result.current.state.topMaterial).toBe("smooth");
    expect(result.current.state.selectedModel).toBeNull();
    expect(result.current.state.ringEnabled).toBe(false);
    expect(result.current.state.wheelShape).toBe("factory");
  });

  // ── Unknown action (guard) ───────────────────────────────────────────────────

  it("unknown action type leaves state unchanged", () => {
    // Arrange
    const { result } = renderHook(() => useConfigurator(), { wrapper });
    const before = { ...result.current.state };

    // Act
    act(() => result.current.dispatch({ type: "UNKNOWN_ACTION" }));

    // Assert
    expect(result.current.state).toEqual(before);
  });
});
