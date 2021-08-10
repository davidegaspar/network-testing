const net = require("net");

const NetworkEvents = Object.freeze({
  CONNECT: "connect",
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
      this.destroy();
      this.attempt(NetworkEvents.ERROR, new Error("timeout"));
    });
    this.on("error", (error) => {
      this.destroy();
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
    this.eventStack.push(event);
    console.log("attempt", event, eventError, this.attemptCount);
    try {
      this.exFn(event, eventError);
      
      this.done();
    } catch (error) {
      if (this.attemptCount <= this.maxAttempts) {
        console.log("again");
        this.destroy();
        this.verify();
      } else {
        console.log("stop");
        this.destroy();
        throw new Error(
          `${error} ${eventError} attempt:${
            this.attemptCount
          } ${this.eventStack.join()}`
        );
      }
    }
  }
}

module.exports = { NetworkTest, NetworkEvents };
