const { ReproduceFileSizeRpc } = require("./recipes/ReproduceFileSizeRpc");

async function activate(marketplace) {
    await marketplace.install(ReproduceFileSizeRpc, [{ displayName: "RPC reproductions" }]);
}

module.exports = { activate };
