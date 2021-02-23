/**
 * @jest-environment node
 */

const { NetworkTest, NetworkEvents } = require("../../index");

const requestTimeout = 1000;

describe("Control", () => {
  beforeEach(() => {
    network = new NetworkTest({}, requestTimeout);
  });

  it("should connect", (done) => {
    network.whenConnectTo("davidegaspar.dev", 443);

    network.then((event) => {
      expect(event).toBe(NetworkEvents.CONNECT);
      done();
    });
  });

  it("should error", (done) => {
    network.whenConnectTo("some.host.that.does.not.exist", 443);

    network.then((event, error) => {
      expect(event).toBe(NetworkEvents.ERROR);
      expect(error.code).toBe("ENOTFOUND");
      done();
    });
  });

  it("should timeout", (done) => {
    network.whenConnectTo("some.host.that.times.out", 443);

    network.then((event) => {
      expect(event).toBe(NetworkEvents.TIMEOUT);
      done();
    });
  });
});
