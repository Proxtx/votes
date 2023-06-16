import config from "@proxtx/config";
import { setup } from "@proxtx/framework";
import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
let result = await setup(app);
let server = app.listen(config.port);

let combineHandler = await result.combineHandler(server);
combineHandler.onCombine("voteResults", (module) => {
  try {
    global.voteHandler(module);
  } catch {
    console.log("websocket error");
  }
});

console.log("Server started. Port:", config.port);
