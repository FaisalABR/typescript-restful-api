import supertest from "supertest";
import { ContactTest, UserUtil } from "./test-util";
import { web } from "../src/application/web";
import { logger } from "../src/application/logging";

describe("POST /api/contacts", () => {
  beforeEach(async () => {
    await UserUtil.create();
  });

  afterEach(async () => {
    await ContactTest.deleteAll();
    await UserUtil.delete();
  });

  it("should create a new contact", async () => {
    const response = await supertest(web)
      .post("/api/contacts")
      .set("X-API-TOKEN", "testtest")
      .send({
        first_name: "faisal",
        last_name: "abu",
        email: "faisal@gmail.com",
        phone: "082222",
      });

    logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body.data.id).toBeDefined();
    expect(response.body.data.first_name).toBe("faisal");
    expect(response.body.data.last_name).toBe("abu");
    expect(response.body.data.email).toBe("faisal@gmail.com");
    expect(response.body.data.phone).toBe("082222");
  });

  it("should reject create new contact if data invalid", async () => {
    const response = await supertest(web)
      .post("/api/contacts")
      .set("X-API-TOKEN", "testtest")
      .send({
        first_name: "",
        last_name: "",
        email: "faisalgmail.com",
        phone: "",
      });

    logger.debug(response.body);

    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
  });
});

describe("GET /api/contacts/:contactId", () => {
  beforeEach(async () => {
    await UserUtil.create();
    await ContactTest.create();
  });

  afterEach(async () => {
    await ContactTest.deleteAll();
    await UserUtil.delete();
  });

  it("should get contact by contact id", async () => {
    const contact = await ContactTest.get();

    const response = await supertest(web)
      .get(`/api/contacts/${contact.id}`)
      .set("X-API-TOKEN", "testtest");

    logger.debug(response.body);

    expect(response.status).toBe(200);
    expect(response.body.data.first_name).toBe("test");
    expect(response.body.data.last_name).toBe("test");
    expect(response.body.data.email).toBe("test@example.com");
    expect(response.body.data.phone).toBe("08222");
  });
});

describe("PUT /api/contacts/:contactId", () => {
  beforeEach(async () => {
    await UserUtil.create();
    await ContactTest.create();
  });

  afterEach(async () => {
    await ContactTest.deleteAll();
    await UserUtil.delete();
  });

  it("should update existing contact", async () => {
    const contact = await ContactTest.get();

    const response = await supertest(web)
      .put(`/api/contacts/${contact.id}`)
      .set("X-API-TOKEN", "testtest")
      .send({
        first_name: "faisal abu",
        last_name: "bakar riza",
        email: "faisal@mail.com",
        phone: "99999",
      });

    logger.debug(response.body);

    expect(response.status).toBe(200);
    expect(response.body.data.id).toBe(contact.id);
    expect(response.body.data.first_name).toBe("faisal abu");
    expect(response.body.data.last_name).toBe("bakar riza");
    expect(response.body.data.email).toBe("faisal@mail.com");
    expect(response.body.data.phone).toBe("99999");
  });
});

describe("DELETE /api/contacts/:contactId", () => {
  beforeEach(async () => {
    await UserUtil.create();
    await ContactTest.create();
  });

  afterEach(async () => {
    await ContactTest.deleteAll();
    await UserUtil.delete();
  });

  it("should be able delete existing contact", async () => {
    const contact = await ContactTest.get();

    const response = await supertest(web)
      .delete(`/api/contacts/${contact.id}`)
      .set("X-API-TOKEN", "testtest");

    logger.debug(response.body);

    expect(response.status).toBe(200);
    expect(response.body.data).toBe("OK");
  });

  it("should reject remove contact if contact is not found", async () => {
    const contact = await ContactTest.get();

    const response = await supertest(web)
      .delete(`/api/contacts/${contact.id + 1}`)
      .set("X-API-TOKEN", "testtest");

    logger.debug(response.body);

    expect(response.status).toBe(404);
    expect(response.body.errors).toBeDefined();
  });
});

describe("GET /api/contacts", () => {
  beforeEach(async () => {
    await UserUtil.create();
    await ContactTest.create();
  });

  afterEach(async () => {
    await ContactTest.deleteAll();
    await UserUtil.delete();
  });

  it("should be able to search contact", async () => {
    const response = await supertest(web)
      .get("/api/contacts")
      .set("X-API-TOKEN", "testtest");

    logger.debug(response.body);

    expect(response.status).toBe(200);
    expect(response.body.data.length).toBe(1);
    expect(response.body.paging.current_page).toBe(1);
    expect(response.body.paging.total_page).toBe(1);
    expect(response.body.paging.size).toBe(10);
  });

  it("should be able to search contact by filter name", async () => {
    const response = await supertest(web)
      .get("/api/contacts")
      .query({ name: "es" })
      .set("X-API-TOKEN", "testtest");

    logger.debug(response.body);

    expect(response.status).toBe(200);
    expect(response.body.data.length).toBe(1);
    expect(response.body.paging.current_page).toBe(1);
    expect(response.body.paging.total_page).toBe(1);
    expect(response.body.paging.size).toBe(10);
  });

  it("should be able to search contact by filter email", async () => {
    const response = await supertest(web)
      .get("/api/contacts")
      .query({ email: "@example.com" })
      .set("X-API-TOKEN", "testtest");

    logger.debug(response.body);

    expect(response.status).toBe(200);
    expect(response.body.data.length).toBe(1);
    expect(response.body.paging.current_page).toBe(1);
    expect(response.body.paging.total_page).toBe(1);
    expect(response.body.paging.size).toBe(10);
  });

  it("should be able to search contact by filter email", async () => {
    const response = await supertest(web)
      .get("/api/contacts")
      .query({ phone: "8222" })
      .set("X-API-TOKEN", "testtest");

    logger.debug(response.body);

    expect(response.status).toBe(200);
    expect(response.body.data.length).toBe(1);
    expect(response.body.paging.current_page).toBe(1);
    expect(response.body.paging.total_page).toBe(1);
    expect(response.body.paging.size).toBe(10);
  });

  it("should be able to search contact with no result", async () => {
    const response = await supertest(web)
      .get("/api/contacts")
      .query({ name: "salah" })
      .set("X-API-TOKEN", "testtest");

    logger.debug(response.body);

    expect(response.status).toBe(200);
    expect(response.body.data.length).toBe(0);
    expect(response.body.paging.current_page).toBe(1);
    expect(response.body.paging.total_page).toBe(0);
    expect(response.body.paging.size).toBe(10);
  });

  it("should be able to search contact with paging", async () => {
    const response = await supertest(web)
      .get("/api/contacts")
      .query({ page: 2, size: 1 })
      .set("X-API-TOKEN", "testtest");

    logger.debug(response.body);

    expect(response.status).toBe(200);
    expect(response.body.data.length).toBe(0);
    expect(response.body.paging.current_page).toBe(2);
    expect(response.body.paging.total_page).toBe(1);
    expect(response.body.paging.size).toBe(1);
  });
});
