import { connect } from "../wsConnectionHandler.js";

const yesGraph = document.getElementById("yesGraph");
const noGraph = document.getElementById("noGraph");
const timeGraph = document.getElementById("timeGraph");
const quote = document.getElementById("quote");

let disabled = false;

const voteApi = await framework.load("vote.js");

framework.ws.addModule(
  {
    voteUpdate(result) {
      if (disabled) return;
      yesGraph.style.height = result[0] * 100 + "%";
      noGraph.style.height = result[1] * 100 + "%";
    },
  },
  "voteResults"
);

connect();

const startTimer = async (time) => {
  let res = timeGraph.animate(
    [
      {
        height: "100%",
      },
      {
        height: "0%",
      },
    ],
    {
      duration: time,
      fill: "forwards",
    }
  );

  await res.finished;
};

let script = [
  {
    zitat: "test1",
    result: true,
  },
  {
    zitat: "test2",
    result: false,
  },
  {
    zitat: "test3",
    result: true,
  },
  {
    zitat: "test4",
    result: false,
  },
  {
    zitat: "test5",
    result: true,
  },
];

const runScript = async () => {
  for (let entry of script) {
    resetVotes();
    await voteApi.resetPoll();
    disabled = false;
    quote.innerText = entry.zitat;
    await startTimer(20000);
    disabled = true;
    await new Promise((r) => setTimeout(r, 2000));
    if (entry.result) yesGraph.style.backgroundColor = "green";
    else noGraph.style.backgroundColor = "green";
    await new Promise((r) => setTimeout(r, 3000));
  }
};

const resetVotes = () => {
  yesGraph.style.height = "0%";
  yesGraph.style.backgroundColor = "#a83b3b";
  noGraph.style.height = "0%";
  noGraph.style.backgroundColor = "#a83b3b";
};

if (localStorage.getItem("pwd") == "ncg-abi23") runScript();
