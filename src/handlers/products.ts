import express, { Request, Response } from "express";
import { BaseProduct, Product, ProductStore } from "../models/product";

const store = new ProductStore();

const create = async (req: Request, res: Response) => {
  try {
    const product: BaseProduct = {
      name: req.body.name,
      price: req.body.price,
    };

    if (!product.name || !product.price) {
        res.status(400);
        res.send("Required parameters are missing!");
        return;
      }

    const products: Product = await store.create(product);
    res.json(products);
  } catch (err) {
    res.status(400).json(err);
  }
};

const index = async (_req: Request, res: Response) => {
  try {
    const products: Product[] = await store.index();
    res.json(products);
  } catch (err) {
    res.status(400).json(err);
  }
};

const show = async (req: Request, res: Response) => {
  try {
    if (!req.params.id) {
        res.status(400);
        res.send("Required product id are missing!");
        return;
      }
    const products = await store.show(req.params.id as unknown as number);
    res.json(products);
  } catch (err) {
    res.status(400).json(err);
  }
};

const update = async (req: Request, res: Response) => {
  try {
    const product_id = req.params.id as unknown as number;
    const product: BaseProduct = {
      name: req.body.name,
      price: req.body.price,
    };

    if (!product_id || !product.name || !product.price) {
        res.status(400);
        res.send("Required parameters are missing!");
        return;
      }

    const products = await store.update(product_id, product);
    res.json(products);
  } catch (err) {
    res.status(400).json(err);
  }
};

const destroy = async (req: Request, res: Response) => {
  try {
    if (!req.params.id) {
        res.status(400);
        res.send("Required product id are missing!");
        return;
      }
    const products = await store.delete(req.params.id as unknown as number);
    res.json(products);
  } catch (err) {
    res.status(400).json(err);
  }
};

const products_routes = (app: express.Application) => {
  app.post("/products/create", create);
  app.get("/products", index);
  app.get("/products/:id", show);
  app.put("/products/:id", update);
  app.delete("/products/:id", destroy);
};

export default products_routes;
