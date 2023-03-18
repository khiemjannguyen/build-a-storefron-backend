import express, { Request, Response } from "express";
import { Order, OrderStore } from "../models/order";

const store = new OrderStore();

const create = async (req: Request, res: Response) => {
  try {
    const orderRequest: Order = {
      products: req.body.products,
      user_id: req.body.user_id,
      status: req.body.boolean,
    };

    if (!orderRequest.products || !orderRequest.user_id || !orderRequest.status) {
      res.status(400);
      res.send("Required parameters are missing!");
      return;
    }

    const order: Order = await store.create(orderRequest);
    res.json(order);
  } catch (err) {
    res.status(400).json(err);
  }
};

const index = async (_req: Request, res: Response) => {
  try {
    const orders: Order[] = await store.index();
    res.json(orders);
  } catch (err) {
    res.status(400).json(err);
  }
};

const show = async (req: Request, res: Response) => {

  try {
    if (!req.params.id) {
        res.status(400);
        res.send("Required order id is missing!");
        return;
    }

    const order = await store.show(req.params.id as unknown as number);

    res.json(order);
  } catch (err) {
    res.status(400).json(err);
  }
};

const update = async (req: Request, res: Response) => {
  try {
    const order_id = req.params.id as unknown as number;
    const orderRequest: Order = {
        products: req.body.products,
        user_id: req.body.user_id,
        status: req.body.boolean,
      };

      if (!order_id || !orderRequest.products || !orderRequest.user_id || !orderRequest.status) {
        res.status(400);
        res.send("Required parameters are missing!");
        return;
      }

    const order = await store.update(order_id, orderRequest);

    res.json(order);
  } catch (err) {
    res.status(400).json(err);
  }
};

const destroy = async (req: Request, res: Response) => {
  try {
    if (!req.params.id) {
        res.status(400);
        res.send("Required order id is missing!");
        return
    }
    const orders = await store.delete(req.params.id as unknown as number);
    res.json(orders)
  } catch (err) {
    res.status(400).json(err);
  }
};

const orders_routes = (app: express.Application) => {
  app.post("/orders/create", create);
  app.get("/orders", index);
  app.get("/orders/:id", show);
  app.put("/orders/:id", update);
  app.delete("/orders/:id", destroy);
};

export default orders_routes;
