jest.mock("../models/Venue", () => ({
  create: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findById: jest.fn(),
  find: jest.fn(),
  findByIdAndDelete: jest.fn(),
}));

const Venue = require("../models/Venue");
const { createVenue } = require("../controllers/venues.controller");

describe("Venue creation with image uploads", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("stores uploaded image URLs when creating a venue", async () => {
    Venue.create.mockResolvedValue({ _id: "venue-1", name: "Elite Court" });

    const req = {
      body: {
        name: "Elite Court",
        location: "Downtown",
        sportType: "Football",
        pricePerHour: "20",
      },
      files: [{ path: "https://img1.test/one.jpg" }, { path: "https://img2.test/two.jpg" }],
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await createVenue(req, res);

    expect(Venue.create).toHaveBeenCalledWith(
      expect.objectContaining({
        images: ["https://img1.test/one.jpg", "https://img2.test/two.jpg"],
        sportType: ["Football"],
        pricePerHour: 20,
      }),
    );
    expect(res.status).toHaveBeenCalledWith(201);
  });

  test("normalizes lowercase sport types to the supported enum values", async () => {
    Venue.create.mockResolvedValue({ _id: "venue-2", name: "Lowercase Court" });

    const req = {
      body: {
        name: "Lowercase Court",
        location: "Downtown",
        sportType: "football",
        pricePerHour: "20",
      },
      files: [],
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await createVenue(req, res);

    expect(Venue.create).toHaveBeenCalledWith(
      expect.objectContaining({
        sportType: ["Football"],
      }),
    );
  });
});
