const net = require("net");

const NetworkEvents = Object.freeze({
  CONNECT: "connect",
  TIMEOUT: "timeout",
  ERROR: "error",
});

class NetworkTest extends net.Socket {
  constructor(options, timeout = 1000, maxAttempts = 3) {
    super(options);
    super.setTimeout(timeout);
    this.maxAttempts = maxAttempts;
    this.attemptCount = 0;
    this.errorStack = [];
    this.eventStack = [];
  }

  then(ex, done) {
    this.exFn = ex;
    this.done = done;
    this.on("connect", () => {
      this.attempt(NetworkEvents.CONNECT, null);
    });
    this.on("timeout", () => {
      this.attempt(NetworkEvents.TIMEOUT, null);
    });
    this.on("error", (error) => {
      this.attempt(NetworkEvents.ERROR, error);
    });
    this.verify();
  }

  whenConnectTo(host, port) {
    this.host = host;
    this.port = port;
  }

  verify() {
    this.attemptCount++;
    super.connect(this.port, this.host);
  }

  attempt(event, eventError) {
    this.eventStack.push({ event, eventError });
    console.log("attempt", event, eventError, this.attemptCount);
    try {
      this.exFn(event, eventError);
      this.destroy();
      this.done();
    } catch (error) {
      if (this.attemptCount <= this.maxAttempts) {
        console.log("again");
        this.verify();
      } else {
        console.log("stop");
        this.destroy();
        throw new Error(`${error} ${eventError} attempt:${this.attemptCount}`);
      }
    }
  }
}

module.exports = { NetworkTest, NetworkEvents };
