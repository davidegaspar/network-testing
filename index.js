const net = require("net");

const NetworkEvents = Object.freeze({
  CONNECT: "connect",
  TIMEOUT: "timeout",
  ERROR: "error",
});

class NetworkTest extends net.Socket {
  constructor(options, timeout = 1000, retries = 2) {
    super(options);
    super.setTimeout(timeout);
    this.retries = retries;
  }

  then(ex, done) {
    this.exFn = ex;
    this.done = done;
    this.on("connect", () => {
      // console.log("connect!");
      this.retry(NetworkEvents.CONNECT, null);
    });
    this.on("timeout", () => {
      // console.log("timeout!");
      this.retry(NetworkEvents.TIMEOUT, null);
    });
    this.on("error", (error) => {
      // console.log("error!");
      this.retry(NetworkEvents.ERROR, error);
    });
    this.verify();
  }

  whenConnectTo(host, port) {
    this.host = host;
    this.port = port;
  }

  verify() {
    super.connect(this.port, this.host);
  }

  retry(event, error) {
    // console.log("retry", event, error);
    try {
      this.exFn(event, error);
      // console.log("retry", "ok");
      this.destroy();
      this.done();
    } catch (err) {
      // console.log("retry catch", err);
      // console.log("retries", this.retries);
      if (this.retries > 0) {
        // console.log("retry", "again");
        this.retries = this.retries - 1;
        this.verify();
      } else {
        // console.log("retry", "stop");
        this.destroy();
        throw error;
      }
    }
  }
}

module.exports = { NetworkTest, NetworkEvents };
