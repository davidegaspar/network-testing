const net = require("net");

const NetworkEvents = Object.freeze({
  CONNECT: "connect",
  TIMEOUT: "timeout",
  ERROR: "error",
});

class NetworkTest extends net.Socket {
  constructor(options, timeout) {
    super(options);
    super.setTimeout(timeout || 1000);
  }

  whenConnectTo(host, port) {
    super.connect(port, host);
  }

  then(callback) {
    this.on("connect", () => {
      this.destroy();
      callback(NetworkEvents.CONNECT, null);
    });
    this.on("timeout", () => {
      this.destroy();
      callback(NetworkEvents.TIMEOUT, null);
    });
    this.on("error", (error) => {
      this.destroy();
      callback(NetworkEvents.ERROR, error);
    });
  }
}

module.exports = { NetworkTest, NetworkEvents };
