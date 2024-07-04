import supertest from "supertest";
import { web } from "../src/application/web";
import { logger } from "../src/application/logging";
import { UserUtil } from "./test-util";
import bcrypt from "bcrypt";

describe("POST /api/users", () => {
  afterEach(async () => {
    await UserUtil.delete();
  });

  it("should reject with unvalid request", async () => {
    const response = await supertest(web).post("/api/users").send({
      username: "",
      password: "",
      name: "",
    });

    logger.debug(response.body);

    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
  });

  it("should create a user", async () => {
    const response = await supertest(web).post("/api/users").send({
      username: "testtest",
      password: "testtest",
      name: "testtest",
    });

    logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body.data.username).toBe("testtest");
    expect(response.body.data.name).toBe("testtest");
  });
});

describe("POST /api/users/login", () => {
  beforeEach(async () => {
    await UserUtil.create();
  });

  afterEach(async () => {
    await UserUtil.delete();
  });

  it("should be able to login", async () => {
    const response = await supertest(web).post("/api/users/login").send({
      username: "testtest",
      password: "testtest",
    });

    logger.debug(response.body);

    expect(response.status).toBe(200);
    expect(response.body.data.username).toBe("testtest");
    expect(response.body.data.name).toBe("testtest");
    expect(response.body.data.token).toBeDefined();
  });

  it("should reject login if username wrong", async () => {
    const response = await supertest(web).post("/api/users/login").send({
      username: "salah",
      password: "testtest",
    });

    logger.debug(response.body);

    expect(response.status).toBe(401);
    expect(response.body.errors).toBeDefined();
  });

  it("should reject login if password wrong", async () => {
    const response = await supertest(web).post("/api/users/login").send({
      password: "salah",
      username: "testtest",
    });

    logger.debug(response.body);

    expect(response.status).toBe(401);
    expect(response.body.errors).toBeDefined();
  });
});

describe("GET /api/users/current", () => {
  beforeEach(async () => {
    await UserUtil.create();
  });

  afterEach(async () => {
    await UserUtil.delete();
  });

  it("should be able to get user", async () => {
    const response = await supertest(web)
      .get("/api/users/current")
      .set("X-API-TOKEN", "testtest");

    logger.debug(response.body);

    expect(response.status).toBe(200);
    expect(response.body.data.username).toBe("testtest");
    expect(response.body.data.name).toBe("testtest");
  });

  it("should be able to get user", async () => {
    const response = await supertest(web)
      .get("/api/users/current")
      .set("X-API-TOKEN", "salah");

    logger.debug(response.body);

    expect(response.status).toBe(401);
    expect(response.body.errors).toBeDefined();
  });
});

describe("PATCH /api/users/current", () => {
  beforeEach(async () => {
    await UserUtil.create();
  });

  afterEach(async () => {
    await UserUtil.delete();
  });

  it("should reject by invalid input", async () => {
    const response = await supertest(web)
      .patch("/api/users/current")
      .set("X-API-TOKEN", "testtest")
      .send({
        name: "",
        password: "",
      });

    logger.debug(response.body);

    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
  });

  it("should be able to update name", async () => {
    const response = await supertest(web)
      .patch("/api/users/current")
      .set("X-API-TOKEN", "testtest")
      .send({
        name: "benar",
      });

    logger.debug(response.body);

    expect(response.status).toBe(200);
    expect(response.body.data.name).toBe("benar");
  });

  it("should be able to update password", async () => {
    const response = await supertest(web)
      .patch("/api/users/current")
      .set("X-API-TOKEN", "testtest")
      .send({
        password: "benar",
      });

    logger.debug(response.body);

    expect(response.status).toBe(200);
    const user = await UserUtil.get();

    expect(await bcrypt.compare("benar", user.password)).toBe(true);
  });
});

describe("DELETE /api/users/current", () => {
  beforeEach(async () => {
    await UserUtil.create();
  });

  afterEach(async () => {
    await UserUtil.delete();
  });

  it("should be able logout", async () => {
    const response = await supertest(web)
      .delete("/api/users/current")
      .set("X-API-TOKEN", "testtest");

    logger.debug(response.body);

    expect(response.status).toBe(200);
    expect(response.body.data).toBe("OK");

    const user = await UserUtil.get();
    expect(user.token).toBeNull();
  });

  it("should reject logout", async () => {
    const response = await supertest(web)
      .delete("/api/users/current")
      .set("X-API-TOKEN", "salah");

    logger.debug(response.body);

    expect(response.status).toBe(401);
    expect(response.body.errors).toBeDefined();
  });
});
