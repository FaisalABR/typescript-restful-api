import supertest from "supertest";
import { web } from "../src/application/web";
import { AddressTest, ContactTest, UserUtil } from "./test-util";
import { logger } from "../src/application/logging";

describe("POST /api/contacts/:contactId/addresses", () => {
  beforeEach(async () => {
    await UserUtil.create();
    await ContactTest.create();
  });

  afterEach(async () => {
    await AddressTest.deleteAll();
    await ContactTest.deleteAll();
    await UserUtil.delete();
  });

  it("should be able create address", async () => {
    const contact = await ContactTest.get();
    const response = await supertest(web)
      .post(`/api/contacts/${contact.id}/addresses`)
      .set("X-API-TOKEN", "testtest")
      .send({
        street: "test",
        city: "test",
        province: "test",
        country: "test",
        postal_code: "1234",
      });

    logger.debug(response.body);

    expect(response.status).toBe(200);
    expect(response.body.data.street).toBe("test");
    expect(response.body.data.city).toBe("test");
    expect(response.body.data.province).toBe("test");
    expect(response.body.data.country).toBe("test");
    expect(response.body.data.postal_code).toBe("1234");
  });

  it("should reject create address if data invalid", async () => {
    const contact = await ContactTest.get();
    const response = await supertest(web)
      .post(`/api/contacts/${contact.id}/addresses`)
      .set("X-API-TOKEN", "testtest")
      .send({
        street: "test",
        city: "test",
        province: "test",
        country: "",
        postal_code: "",
      });

    logger.debug(response.body);

    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
  });
});

describe("GET /api/contacts/:contactId/addresses/:addressId", () => {
  beforeEach(async () => {
    await UserUtil.create();
    await ContactTest.create();
    await AddressTest.create();
  });

  afterEach(async () => {
    await AddressTest.deleteAll();
    await ContactTest.deleteAll();
    await UserUtil.delete();
  });

  it("should be able to get existing address", async () => {
    const contact = await ContactTest.get();
    const address = await AddressTest.get();

    const response = await supertest(web)
      .get(`/api/contacts/${contact.id}/addresses/${address.id}`)
      .set("X-API-TOKEN", "testtest");

    logger.debug(response.body);

    expect(response.status).toBe(200);

    expect(response.body.data.contact_id).toBeDefined();
    expect(response.body.data.id).toBeDefined();
    expect(response.body.data.street).toBe("test");
    expect(response.body.data.city).toBe("test");
    expect(response.body.data.province).toBe("test");
    expect(response.body.data.country).toBe("test");
    expect(response.body.data.postal_code).toBe("test");
  });

  it("should reject to not existing address if params incorrect", async () => {
    const contact = await ContactTest.get();
    const address = await AddressTest.get();

    const response = await supertest(web)
      .get(`/api/contacts/${contact.id + 1}/addresses/${address.id + 1}`)
      .set("X-API-TOKEN", "testtest");

    logger.debug(response.body);

    expect(response.status).toBe(404);

    expect(response.body.errors).toBeDefined();
  });
});

describe("PUT  /api/contacts/:contactId/addresses/:addressId", () => {
  beforeEach(async () => {
    await UserUtil.create();
    await ContactTest.create();
    await AddressTest.create();
  });

  afterEach(async () => {
    await AddressTest.deleteAll();
    await ContactTest.deleteAll();
    await UserUtil.delete();
  });

  it("should be able to update existing address", async () => {
    const contact = await ContactTest.get();
    const address = await AddressTest.get();

    const response = await supertest(web)
      .put(`/api/contacts/${contact.id}/addresses/${address.id}`)
      .set("X-API-TOKEN", "testtest")
      .send({
        street: "update test",
        city: "update test",
        province: "update test",
        country: "update test",
        postal_code: "newtest",
      });

    logger.debug(response.body);

    expect(response.status).toBe(200);

    expect(response.body.data.contact_id).toBeDefined();
    expect(response.body.data.id).toBeDefined();
    expect(response.body.data.street).toBe("update test");
    expect(response.body.data.city).toBe("update test");
    expect(response.body.data.province).toBe("update test");
    expect(response.body.data.country).toBe("update test");
    expect(response.body.data.postal_code).toBe("newtest");
  });

  it("should reject update existing address", async () => {
    const contact = await ContactTest.get();
    const address = await AddressTest.get();

    const response = await supertest(web)
      .put(`/api/contacts/${contact.id}/addresses/${address.id}`)
      .set("X-API-TOKEN", "testtest")
      .send({
        street: "update test",
        city: "update test",
        province: "update test",
        country: "update test",
        postal_code: "update test",
      });

    logger.debug(response.body);

    expect(response.status).toBe(400);

    expect(response.body.errors).toBeDefined();
  });
});

describe("DELETE  /api/contacts/:contactId/addresses/:addressId", () => {
  beforeEach(async () => {
    await UserUtil.create();
    await ContactTest.create();
    await AddressTest.create();
  });

  afterEach(async () => {
    await AddressTest.deleteAll();
    await ContactTest.deleteAll();
    await UserUtil.delete();
  });

  it("should be able to delete existing address", async () => {
    const contact = await ContactTest.get();
    const address = await AddressTest.get();

    const response = await supertest(web)
      .delete(`/api/contacts/${contact.id}/addresses/${address.id}`)
      .set("X-API-TOKEN", "testtest");

    logger.debug(response.body);

    expect(response.status).toBe(200);
    expect(response.body.data).toBe("OK");
  });

  it("should reject delete no existing address", async () => {
    const contact = await ContactTest.get();
    const address = await AddressTest.get();

    const response = await supertest(web)
      .delete(`/api/contacts/${contact.id + 1}/addresses/${address.id + 1}`)
      .set("X-API-TOKEN", "testtest");

    logger.debug(response.body);

    expect(response.status).toBe(404);
    expect(response.body.errors).toBeDefined();
  });
});

describe("GET  /api/contacts/:contactId/addresses", () => {
  beforeEach(async () => {
    await UserUtil.create();
    await ContactTest.create();
    await AddressTest.create();
  });

  afterEach(async () => {
    await AddressTest.deleteAll();
    await ContactTest.deleteAll();
    await UserUtil.delete();
  });

  it("should be able to get all addresses", async () => {
    const contact = await ContactTest.get();

    const response = await supertest(web)
      .get(`/api/contacts/${contact.id}/addresses`)
      .set("X-API-TOKEN", "testtest");

    logger.debug(response.body);

    expect(response.status).toBe(200);
    expect(response.body.data.length).toBe(1);
  });

  it("should reject get all addresses if contact id is incorrect", async () => {
    const contact = await ContactTest.get();

    const response = await supertest(web)
      .get(`/api/contacts/${contact.id + 1}/addresses`)
      .set("X-API-TOKEN", "testtest");

    logger.debug(response.body);

    expect(response.status).toBe(404);
    expect(response.body.errors).toBeDefined();
  });
});
