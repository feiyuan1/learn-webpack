/**
 * a usaga case which renders large mount of table table of NessageChannel
 */
const data = [
  { key: 0, time: 123231, name: "name", input: "0", index: "0" },
  { key: 0, time: 123231, name: "name", input: "0", index: "0" },
  { key: 0, time: 123231, name: "name", input: "0", index: "0" },
];
const cols = Object.keys(data[0]);
const { port1, port2 } = new MessageChannel();

const transform = () => {
  const cur = cols.splice(0, 2);
  const result = data.map((item) => {
    return cur.reduce((res, key) => ({ ...res, [key]: item[key] }), {});
  });
  port2.postMessage(result);
  if (cols.length) {
    run();
  }
};

const run = () => {
  port1.postMessage("");
};

port2.onmessage = transform;

port1.onmessage = (e) => {
  console.log(e.data);
};

run();
