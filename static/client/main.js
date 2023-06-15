const votes = document.getElementById("votes");

const voteApi = await framework.load("vote.js");

const generateOptions = async () => {
  votes.innerHTML = "";
  let options = await voteApi.options;
  for (let option in options) {
    let text = document.createElement("h1");
    text.innerText = options[option];
    text.addEventListener("click", () => {
      if (votedId == id) return;
      vote(option);
      chooseOption(text);
    });

    votes.appendChild(text);
  }
};

const chooseOption = (o) => {
  for (let childIndex = 0; childIndex < votes.children.length; childIndex++) {
    let c = votes.children[childIndex];
    if (c == o) continue;
    greyOut(c);
  }
};

let id = -1;
let votedId = localStorage.getItem("votedId");

const reset = () => {
  for (let childIndex = 0; childIndex < votes.children.length; childIndex++)
    votes.children[childIndex].classList.remove("greyedOut");
};

const vote = async (v) => {
  if (votedId == id) return;
  votedId = id;
  localStorage.setItem("votedId", votedId);

  await voteApi.castVote(v, id);
};

const greyOut = (n) => {
  n.classList.add("greyedOut");
};

const vLoop = async () => {
  let nId = await voteApi.id;
  if (nId != id) {
    reset();
    id = nId;
    generateOptions();
  }
  await new Promise((r) => setTimeout(r, 3000));
  vLoop();
};

vLoop();

window.spam = async () => {
  let id = await voteApi.id;
  for (let i = 0; i < 5000; i++) {
    await voteApi.castVote(Number(Math.random() < 0.5), id);
  }
};
