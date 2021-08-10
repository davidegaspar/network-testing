const net = require("net");

let s = new net.Socket();
s.setTimeout(1000);

s.on("connect", () => {
  console.log("connect");
});
s.on("timeout", () => {
  console.log("timeout");
  s.destroy();
  // s.connect(443, "k8s-api.nonprod.na.conde.digital");
  // connect
  s.connect(443, "davidegaspar.dev");
});
s.on("error", (error) => {
  console.log("error", error);
});
s.on("close", (error) => {
  console.log("close");
});
s.on("data", (error) => {
  console.log("data");
});
s.on("drain", (error) => {
  console.log("drain");
});
s.on("end", (error) => {
  console.log("end");
});
s.on("lookup", (error) => {
  console.log("lookup");
});
s.on("ready", (error) => {
  console.log("ready");
});

// connect
// s.connect(443, "davidegaspar.dev");
// error
// s.connect(443, "some.host.that.does.not.exist");
// s.connect(443, "some.host.that.does.not.exist");
// timeout
s.connect(443, "k8s-api.nonprod.na.conde.digital");
