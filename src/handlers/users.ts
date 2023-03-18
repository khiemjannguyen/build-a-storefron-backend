import express, { Request, Response } from "express";
import { AuthUser, BaseUser, User, UserStore } from "../models/user";

const store = new UserStore();

const create = async (req: Request, res: Response) => {
  try {
    const userRequest: AuthUser = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password: req.body.password,
    };

    if (!userRequest.firstName || !userRequest.lastName || !userRequest.password) {
      res.status(400);
      res.send("Required parameters are missing!");
      return;
    }

    const user: User = await store.create(userRequest);
    res.json(user);
  } catch (err) {
    res.status(400).json(err);
  }
};

const index = async (_req: Request, res: Response) => {
  try {
    const users: User[] = await store.index();
    res.json(users);
  } catch (err) {
    res.status(400).json(err);
  }
};

const show = async (req: Request, res: Response) => {
    if (!req.params.id) {
        res.status(400);
        res.send("Required user id is missing!");
        return;
    }

  try {
    const userRequest = await store.show(req.params.id as unknown as number);

    res.json(userRequest);
  } catch (err) {
    res.status(400).json(err);
  }
};

const update = async (req: Request, res: Response) => {
  try {
    const user_id = req.params.id as unknown as number;
    const userRequest: AuthUser = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password: req.body.password,
    };

    if (!user_id || !userRequest.firstName || !userRequest.lastName || !userRequest.password) {
        res.status(400);
        res.send("Required parameters are missing!");
        return;
      }

    const user = await store.update(user_id, userRequest);

    res.json(user);
  } catch (err) {
    res.status(400).json(err);
  }
};

const destroy = async (req: Request, res: Response) => {
  try {
    if (!req.params.id) {
        res.status(400);
        res.send("Required user id is missing!");
        return;
    }
    const users = await store.delete(req.params.id as unknown as number);
    res.json(users);
  } catch (err) {
    res.status(400).json(err);
  }
};

const authenticate = async (req: Request, res: Response) => {
    try {
      const userRequest: AuthUser = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: req.body.password,
      };
  
      if (!userRequest.firstName || !userRequest.lastName || !userRequest.password) {
          res.status(400);
          res.send("Required parameters are missing!");
          return;
        }
  
      const user = await store.authenticate(userRequest.firstName, userRequest.lastName, userRequest.password);
      
      if (!user) {
        res.status(401);
        res.send("User Authentification failed! Wrong password!");
        return;
    }

      res.json(user);
    } catch (err) {
      res.status(400).json(err);
    }
  };
const users_routes = (app: express.Application) => {
  app.post("/users/create", create);
  app.get("/users", index);
  app.get("/users/:id", show);
  app.put("/users/:id", update);
  app.delete("/users/:id", destroy);
};

export default users_routes;
