// Must set env vars before requiring the app so JWT/session middleware initialises
process.env.JWT_SECRET = "test-jwt-secret";
process.env.SESSION_SECRET = "test-session-secret";

// Mock the db module — keeps tests hermetic (no live PostgreSQL needed)
jest.mock("../db", () => ({
  query: jest.fn(),
}));

const request = require("supertest");
const db = require("../db");
const app = require("../server");

// ── POST /api/configurator-inquiries ─────────────────────────────────────────
// Public endpoint — no JWT required.
// Required fields: name, email, phone, selectedModel, carModel

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
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ── Positive: valid submission ────────────────────────────────────────────────

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

  // ── Negative: missing required fields → 400 ───────────────────────────────────

  it.each([
    ["name",          { ...validPayload, name: undefined }],
    ["email",         { ...validPayload, email: undefined }],
    ["phone",         { ...validPayload, phone: undefined }],
    ["selectedModel", { ...validPayload, selectedModel: undefined }],
    ["carModel",      { ...validPayload, carModel: undefined }],
  ])(
    'returns 400 when required field "%s" is missing',
    async (_field, payload) => {
      // Act
      const res = await request(app)
        .post("/api/configurator-inquiries")
        .send(payload);

      // Assert
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      // Guard: db should not be called when validation fails
      expect(db.query).not.toHaveBeenCalled();
    }
  );

  // ── Database error → 500 ──────────────────────────────────────────────────────

  it("returns 500 when the database query throws", async () => {
    // Arrange
    db.query.mockRejectedValueOnce(new Error("DB connection lost"));

    // Act
    const res = await request(app)
      .post("/api/configurator-inquiries")
      .send(validPayload);

    // Assert
    expect(res.status).toBe(500);
  });
});
