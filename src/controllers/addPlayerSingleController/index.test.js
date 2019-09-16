const { addPlayerSingleController } = require("./");
const { dbConnector } = require("../../db/db");
const sql = require("sql-template-strings");

const expectedQuery = sql`INSERT 
        into 
        public.players (player_name)
        VALUES (${"Johnny Gaudreau"})`;

jest.mock("../../db/db");

describe("addPlayerSingleController", () => {
  it("successfully inserts into the DB", async () => {
    const mockRes = {
      send: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    };
    const mockReq = {
      body: { name: "Johnny Gaudreau" },
    };
    dbConnector.query = jest.fn().mockResolvedValue("what's up");
    const calledFunction = await addPlayerSingleController(mockReq, mockRes);
    expect(dbConnector.query).toHaveBeenCalledWith(expectedQuery);
  });
});
