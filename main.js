import { listen } from "@proxtx/framework";
import config from "@proxtx/config";

let result = await listen(config.port);
let combineHandler = await result.combineHandler(result.server);
combineHandler.onCombine("voteResults", () => {
  try {
    global.voteHandler(module);
  } catch {
    console.log("websocket error");
  }
});

console.log("Server started. Port:", config.port);
