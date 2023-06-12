let callbacks = [];

let results = [0, 0];
export const id = 0;

export const castVote = async (v, cId) => {
  if (id != cId) return;
  results[v]++;
  await runCombineFunc("voteUpdate", calcResult());
};

const runCombineFunc = async (method, value) => {
  let p = [];
  for (let c of callbacks) {
    p.push(c(method, value));
  }

  await Promise.all(p);
};

const calcResult = () => {
  let total;
  for (let r of results) total += r;
  let ret = [];
  for (let r of results) {
    ret.push(Math.round(r / total));
  }
  return ret;
};

export const resetPoll = () => {
  results = [0, 0];
  id = Math.floor(Math.random() * 1000);
};

global.voteHandler = (module) => {
  let func = async (method, value) => {
    try {
      if (!(await module[method](value)).success)
        callbacks.splice(callbacks.indexOf(func), 1);
    } catch {}
  };
  callbacks.push(func);
};
