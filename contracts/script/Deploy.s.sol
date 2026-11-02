// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import {NettingHub} from "../src/NettingHub.sol";

/// @notice Deploy NettingHub to Arc mainnet (chain ID 5042). Moves real USDC: review everything first.
/// Usage (use an encrypted keystore or env var, never a pasted literal key):
///   export PRIVATE_KEY=0x...
///   forge script script/Deploy.s.sol --rpc-url arc_mainnet --broadcast --legacy
contract Deploy is Script {
    // Arc ERC-20 USDC (same address on mainnet and testnet) (from https://docs.arc.io/arc/references/contract-addresses)
    address constant USDC = 0x3600000000000000000000000000000000000000;

    function run() external {
        require(block.chainid == 5042, "Deploy: not Arc mainnet");
        uint256 pk = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(pk);
        console.log("Deployer:", deployer);
        console.log("USDC:    ", USDC);

        vm.startBroadcast(pk);
        NettingHub hub = new NettingHub(USDC);
        vm.stopBroadcast();

        console.log("NettingHub:", address(hub));
        console.log("Explorer: https://explorer.arc.io/address/%s", address(hub));
    }
}
