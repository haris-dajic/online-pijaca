const { Product, createProduct } = require("../../models/product");
const request = require("supertest");
const mongoose = require("mongoose");
const { User } = require('../../models/user');

let server;

describe("/api/products", () => {
  beforeEach(() => {
    server = require("../../app");
  });
  afterEach(async () => {
    await server.close();
    await Product.remove({}).exec();
  });

  let product;
  beforeEach(() => {
    product = {
      name: "sir",
      price: 4,
      description: "Domaci sir",
      userId: 1,
    };
  });

  describe("GET /all", () => {
    it("should return status 200 and all products", async () => {
      const result = await request(server).get("/api/products/all");
      expect(result.status).toBe(200);
    });
  });

  describe("GET /:id", () => {

    it("should return status 404 if there is no product with passed id", async () => {
      const id = mongoose.Types.ObjectId();
      const result = await request(server).get("/api/products/" + id);
      expect(result.status).toBe(404);
    });

    it("should return status 200 and product", async () => {
      const prod = createProduct(product);
      const dbProduct = await prod.save();
      const result = await request(server).get(
        "/api/products/" + dbProduct._id
      );
      expect(result.status).toBe(200);
    });

    it("should return status 404 if ID is not valid", async () => {
      const result = await request(server).get("/api/products/" + 1);
      expect(result.status).toBe(404);
    });
  });

  describe("GET /add", () => {
    let token;

    const exec = () => {
      return request(server)
        .post('/api/products/add')
        .set('Authorization', token);
    }

    beforeEach(() => {
      token = new User().generateAuthToken();
    });

    
    it("should return 401 if token is not provided", async () => {
      token = '';
      const result = await exec().send({});
      expect(result.status).toBe(401);

    });

    it("should return 400 if token is not valid", async () => {
      token = token + 1;
      const result = await exec().send({});
      expect(result.status).toBe(400);
    });

    it("should return 400 if input data are not valid", async () => {
      product.name = '';
      const result = await exec().send(product);
      expect(result.status).toBe(400);
    });

    it("should return 400 if input data are not valid", async () => {
      product.name = '';
      const result = await exec().send(product);
      expect(result.status).toBe(400);
    });
  });
});
