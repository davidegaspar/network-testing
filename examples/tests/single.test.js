const expect = require("chai").expect;
const { NetworkTest, NetworkEvents } = require("../../index");

const requestTimeout = 1000;

describe("Single Example", () => {
  beforeEach(() => {
    network = new NetworkTest({}, requestTimeout);
  });

  it("should connect", (done) => {
    network.whenConnectTo("davidegaspar.dev", 443);

    network.then((event) => {
      expect(event).to.equal(NetworkEvents.CONNECT);
      done();
    });
  });

  it("should timeout", (done) => {
    network.whenConnectTo("some.host.that.times.out", 443);

    network.then((event) => {
      expect(event).to.equal(NetworkEvents.TIMEOUT);
      done();
    });
  });

  it("should error", (done) => {
    network.whenConnectTo("some.host.that.does.not.exist", 443);

    network.then((event, error) => {
      expect(event).to.equal(NetworkEvents.ERROR);
      expect(error.code).to.equal("ENOTFOUND");
      done();
    });
  });
});
