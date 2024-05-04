import { reactive, effect } from "lrhvue3";

const state = reactive({ count: 0 });

effect(() => {
  console.log(`The count is ${state.count}`);
  const root = document.getElementById("app");
  if (root) root.innerText = `The count is ${state.count}`;
});

setInterval(() => {
  state.count++;
}, 1000);
