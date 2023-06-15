const yes = document.getElementById("yes");
const no = document.getElementById("no");

yes.addEventListener("click", () => {
  vote(true);
});

no.addEventListener("click", () => {
  vote(false);
});

const voteApi = await framework.load("vote.js");

let id = -1;
let votedId = localStorage.getItem("votedId");

const reset = () => {
  yes.classList.remove("greyedOut");
  no.classList.remove("greyedOut");
};

const vote = async (v) => {
  if (votedId == id) return;
  votedId = id;
  localStorage.setItem("votedId", votedId);
  if (v) greyOut(no);
  else greyOut(yes);

  await voteApi.castVote(Number(!v), id);
};

const greyOut = (n) => {
  n.classList.add("greyedOut");
};

const vLoop = async () => {
  let nId = await voteApi.id;
  if (nId != id) {
    reset();
    id = nId;
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
