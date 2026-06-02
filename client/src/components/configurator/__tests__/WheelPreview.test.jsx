import { render, screen } from "@testing-library/react";
import WheelPreview from "../WheelPreview";
import { ConfiguratorProvider } from "../../../context/ConfiguratorContext";
import { LanguageProvider } from "../../../context/LanguageContext";

// Full provider stack required by WheelPreview
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

  // ── Fallback ─────────────────────────────────────────────────────────────────

  it('renders "Coming Soon" when no model is selected (default state)', () => {
    // Arrange — localStorage is empty; ConfiguratorProvider uses initialState
    //           where selectedModel is null → non-audi branch
    // Act
    render(
      <Providers>
        <WheelPreview />
      </Providers>
    );

    // Assert
    expect(screen.getByText(/coming soon/i)).toBeInTheDocument();
  });

  it('renders "Coming Soon" when a non-audi model is selected', () => {
    // Arrange
    seedState({ selectedModel: "bmw" });

    // Act
    render(
      <Providers>
        <WheelPreview />
      </Providers>
    );

    // Assert
    expect(screen.getByText(/coming soon/i)).toBeInTheDocument();
  });

  // ── Audi model selected ───────────────────────────────────────────────────────

  it("does not render the Coming Soon fallback when audi is selected", () => {
    // Arrange
    seedState({ selectedModel: "audi" });

    // Act
    render(
      <Providers>
        <WheelPreview />
      </Providers>
    );

    // Assert
    expect(screen.queryByText(/coming soon/i)).not.toBeInTheDocument();
  });

  // ── Ring layer visibility (Observer pattern) ──────────────────────────────────

  it("ring image has opacity 1 when ringEnabled is true and colour matches", () => {
    // Arrange
    seedState({ ringEnabled: true, ringColour: "red" });

    // Act
    render(
      <Providers>
        <WheelPreview />
      </Providers>
    );

    // Assert
    const ringImg = document.querySelector(
      'img[src="/wheels/audi/ring/ring_red.png"]'
    );
    expect(ringImg).not.toBeNull();
    expect(ringImg.style.opacity).toBe("1");
  });

  it("ring image has opacity 0 when ringEnabled is false", () => {
    // Arrange
    seedState({ ringEnabled: false, ringColour: "red" });

    // Act
    render(
      <Providers>
        <WheelPreview />
      </Providers>
    );

    // Assert
    const ringImg = document.querySelector(
      'img[src="/wheels/audi/ring/ring_red.png"]'
    );
    expect(ringImg).not.toBeNull();
    expect(ringImg.style.opacity).toBe("0");
  });

  // ── Material layer visibility ─────────────────────────────────────────────────

  it("selected top material layer has opacity 1, inactive layers have opacity 0", () => {
    // Arrange
    seedState({ wheelShape: "factory", topMaterial: "carbon" });

    // Act
    render(
      <Providers>
        <WheelPreview />
      </Providers>
    );

    // Assert
    const active = document.querySelector(
      'img[src="/wheels/audi/factory/top_carbon.png"]'
    );
    const inactive = document.querySelector(
      'img[src="/wheels/audi/factory/top_alcantara.png"]'
    );
    expect(active.style.opacity).toBe("1");
    expect(inactive.style.opacity).toBe("0");
  });

  it("wheel shape base image switches correctly between factory / full / flat", () => {
    // Arrange
    seedState({ wheelShape: "full" });

    // Act
    render(
      <Providers>
        <WheelPreview />
      </Providers>
    );

    // Assert — full base is visible, factory and flat are not
    const fullBase = document.querySelector(
      'img[src="/wheels/audi/full/audi_full_base.png"]'
    );
    const factoryBase = document.querySelector(
      'img[src="/wheels/audi/factory/audi_factory_base.png"]'
    );
    expect(fullBase.style.opacity).toBe("1");
    expect(factoryBase.style.opacity).toBe("0");
  });
});
