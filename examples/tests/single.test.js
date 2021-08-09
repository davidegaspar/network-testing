const expect = require("chai").expect;
const { NetworkTest, NetworkEvents } = require("../../index");

describe("Single Example", () => {
  beforeEach(() => {
    network = new NetworkTest({}, 1000, 2);
  });

  it("should connect: pass", (done) => {
    network.whenConnectTo("davidegaspar.dev", 443);

    network.then((event) => {
      expect(event).to.equal(NetworkEvents.CONNECT);
    }, done);
  });
  it("should connect: fail due to error", (done) => {
    network.whenConnectTo("some.host.that.does.not.exist", 443);

    network.then((event) => {
      expect(event).to.equal(NetworkEvents.CONNECT);
    }, done);
  });
  xit("should connect: fail due to timeout", (done) => {
    network.whenConnectTo("some.host.that.times.out", 443);

    network.then((event) => {
      expect(event).to.equal(NetworkEvents.CONNECT);
    }, done);
  });

  it("should error: pass", (done) => {
    network.whenConnectTo("some.host.that.does.not.exist", 443);

    network.then((event, error) => {
      expect(event).to.equal(NetworkEvents.ERROR);
      expect(error.code).to.equal("ENOTFOUND");
    }, done);
  });
  it("should error: fail due to connect", (done) => {
    //TODO: weird error
    network.whenConnectTo("davidegaspar.dev", 443);

    network.then((event, error) => {
      expect(event).to.equal(NetworkEvents.ERROR);
      expect(error.code).to.equal("ENOTFOUND");
    }, done);
  });
  xit("should error: fail due to timeout", (done) => {
    network.whenConnectTo("some.host.that.times.out", 443);

    network.then((event, error) => {
      expect(event).to.equal(NetworkEvents.ERROR);
      expect(error.code).to.equal("ENOTFOUND");
    }, done);
  });

  // xit("should timeout", (done) => {
  //   network.whenConnectTo("some.host.that.times.out", 443);

  //   network.then((event) => {
  //     expect(event).to.equal(NetworkEvents.TIMEOUT);
  //     done();
  //   });
  // });
});
