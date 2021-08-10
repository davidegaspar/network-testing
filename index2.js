const net = require("net");

const NetworkEvents = Object.freeze({
  CONNECT: "connect",
  ERROR: "error",
});

class NetworkTest {
  constructor(timeout = 1000, maxAttempts = 3) {
    this.timeout = timeout;
    this.maxAttempts = maxAttempts;
    this.attemptCount = 0;
    this.expect = null;
    this.done = null;
    this.socket = null;
    this.host = null;
    this.port = null;
  }
  do() {
    // new socket
    this.socket = new net.Socket();
    this.socket.setTimeout(this.timeout);
    // attach all things
    this.socket.on("connect", () => {
      this.verify(NetworkEvents.CONNECT, null);
    });
    this.socket.on("timeout", () => {
      // this.destroy();
      this.verify(NetworkEvents.ERROR, new Error("timeout"));
    });
    this.socket.on("error", (error) => {
      // this.destroy();
      this.verify(NetworkEvents.ERROR, error);
    });
    // try to connect
    this.attemptCount++;
    this.socket.connect(this.port, this.host);
  }

  verify(event, eventError) {
    try {
      this.expect(event, eventError);
      this.done();
    } catch (error) {
      if (this.attemptCount <= this.maxAttempts) {
        console.log("again");
        this.do();
      } else {
        console.log("stop");
        throw new Error(
          `${error} ${eventError} attempt:${
            this.attemptCount
          } ${this.eventStack.join()}`
        );
      }
    }
  }
  // given
  // when
  // thenExpect
}

module.exports = { NetworkTest, NetworkEvents };
