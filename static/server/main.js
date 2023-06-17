import { connect } from "../wsConnectionHandler.js";

const graph1 = document.getElementById("graph1");
const graph2 = document.getElementById("graph2");
const graph3 = document.getElementById("graph3");
const graph4 = document.getElementById("graph4");
const text1 = document.getElementById("text1");
const text2 = document.getElementById("text2");
const text3 = document.getElementById("text3");
const text4 = document.getElementById("text4");
const timeGraph = document.getElementById("timeGraph");
const quote = document.getElementById("quote");

let disabled = false;

const voteApi = await framework.load("vote.js");

framework.ws.addModule(
  {
    voteUpdate(result) {
      if (disabled) return;
      graph1.style.height = result[0] * 100 + "%";
      graph2.style.height = result[1] * 100 + "%";
      graph3.style.height = result[2] * 100 + "%";
      graph4.style.height = result[3] * 100 + "%";
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

let script = await voteApi.script;

const runScript = async () => {
  for (let entry of script) {
    resetVotes();
    await voteApi.resetPoll(entry.options);
    disabled = false;
    quote.innerText = entry.zitat;
    setOptionTexts(entry.options);
    await startTimer(45000);
    disabled = true;
    await new Promise((r) => setTimeout(r, 2000));
    if (entry.result == 0) graph1.style.backgroundColor = "green";
    if (entry.result == 1) graph2.style.backgroundColor = "green";
    if (entry.result == 2) graph3.style.backgroundColor = "green";
    if (entry.result == 3) graph4.style.backgroundColor = "green";
    await new Promise((r) => setTimeout(r, 10000));
  }
};

const setOptionTexts = (options) => {
  text1.innerText = options[0];
  text2.innerText = options[1];
  text3.innerText = options[2];
  text4.innerText = options[3];
};

const resetVotes = () => {
  graph1.style.height = "0%";
  graph1.style.backgroundColor = "#a83b3b";
  graph2.style.height = "0%";
  graph2.style.backgroundColor = "#a83b3b";
  graph3.style.height = "0%";
  graph3.style.backgroundColor = "#a83b3b";
  graph4.style.height = "0%";
  graph4.style.backgroundColor = "#a83b3b";
};

if (localStorage.getItem("pwd") == "ncg-abi23" || localStorage.getItem("pwd") == "null" || true) runScript();
