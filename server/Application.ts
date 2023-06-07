import express from "npm:express@4.18.2";
import cors from "npm:cors@2.8.5";
import { Folders } from "./constants/folders.ts";
import { ServerConfig } from "./configs/server-config.ts";
import { Database } from "./database/database.ts";

export class Application {
  private _httpServer;
  private _databaseManager = new Database();
  private readonly staticFileOptions = {
    dotfiles: "ignore",
    etag: false,
    extensions: ["htm", "html"],
    index: false,
    maxAge: "1d",
    redirect: false,
    setHeaders: (res, path, stat) => {
      res.set("x-timestamp", Date.now());
    },
  };

  public constructor() {
    this._httpServer = express();
    // Activate middlewares
    this._httpServer.use(express.json());
    this._httpServer.use(cors());
    // Clients dist folder will be looked up for serving static content.
    this._httpServer.use(express.static(Folders.dist, this.staticFileOptions));
    this._registerRoutes();
  }

  private _registerRoutes() {
    // TODO: Add REST API
    this._httpServer.get(`${ServerConfig.apiPrefix}/test`, (req, res) => {
      res.send("Hello World!");
    });
    this._httpServer.get(`${ServerConfig.apiPrefix}/tasks`, (req, res) => {
      res.send(this._databaseManager.get_tasks(req, res));
    });
    this._httpServer.post(`${ServerConfig.apiPrefix}/tasks`, (req, res) => {
      res.send(200, this._databaseManager.post_tasks(req, res));
    });
    this._httpServer.delete(
      `${ServerConfig.apiPrefix}/tasks/:id`,
      (req, res) => {
        try {
          const result = this._databaseManager.delete_task(req, res);
          res.send(200, result);
        } catch (ex: any) {
          res.send(400, {
            error: ex.message ?? "Could not delete task for reasons unknown.",
          });
        }
      }
    );
    this._httpServer.patch(
      `${ServerConfig.apiPrefix}/tasks/:id`,
      (req, res) => {
        try {
          const result = this._databaseManager.update_task(req, res);
          res.send(200, result);
        } catch (ex: any) {
          res.send(400, {
            error: ex.message ?? "Could not update task for reasons unknown.",
          });
        }
      }
    );
    // Redirect all non matching routes to index.html to activate Reacts routing mechanism.
    this._httpServer.get("*", this.DefaultHandler);
  }

  // Handler used for serving index.html
  private async DefaultHandler(req, res) {
    const content = await Deno.readTextFile(`${Folders.dist}index.html`);
    res.send(content);
  }

  public run() {
    if (this._httpServer !== undefined) {
      console.log(`Starting App Server on 127.0.0.1:${ServerConfig.port}`);
      this._httpServer.listen(ServerConfig.port);
    } else {
      console.error("Server is not initialized!");
    }
  }
}
