const expect = require("chai").expect;
const { NetworkTest, NetworkEvents } = require("../../index");

const tests = [
  {
    args: { name: "Example CONNECT", hostname: "davidegaspar.dev", port: 443 },
    expected: NetworkEvents.CONNECT,
  },
  {
    args: {
      name: "Example TIMEOUT",
      hostname: "some.host.that.times.out",
      port: 443,
    },
    expected: NetworkEvents.TIMEOUT,
  },
  {
    args: {
      name: "Example ERROR",
      hostname: "some.host.that.does.not.exist",
      port: 443,
    },
    expected: NetworkEvents.ERROR,
  },
];

describe("Batch example", () => {
  beforeEach(() => {
    network = new NetworkTest();
  });

  tests.forEach(({ args, expected }) => {
    it(`[${args.name}] ${args.hostname}:${args.port} SHOULD ${expected}`, function (done) {
      network.whenConnectTo(args.hostname, args.port);

      network.then((event) => {
        expect(event).to.equal(expected);
        done();
      });
    });
  });
});
