// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {NettingHub} from "../src/NettingHub.sol";
import {MockUSDC} from "./mocks/MockUSDC.sol";

contract NettingHubTest is Test {
    NettingHub hub;
    MockUSDC usdc;

    address alice = makeAddr("alice");   // A
    address bob   = makeAddr("bob");     // B
    address carol = makeAddr("carol");   // C
    address op    = makeAddr("operator");

    uint256 constant INITIAL = 1_000_000e6;

    function setUp() public {
        usdc = new MockUSDC();
        hub = new NettingHub(address(usdc));
        hub.setOperator(op, true);

        usdc.mint(alice, INITIAL);
        usdc.mint(bob, INITIAL);
        usdc.mint(carol, INITIAL);

        vm.prank(alice); hub.register("Alice Co");
        vm.prank(bob);   hub.register("Bob Ltd");
        vm.prank(carol); hub.register("Carol Inc");
    }

    /// Scenario from the blog: A owes B 100, B owes C 100, C owes A 80.
    /// Gross = 280. Net: B pays A 20, C pays A 20. Net moved = 40. Saved = 240.
    function test_triangleNetting() public {
        vm.prank(alice); uint256 id0 = hub.submitObligation(bob,   100e6, keccak256("inv1"), uint64(block.timestamp + 7 days));
        vm.prank(bob);   uint256 id1 = hub.submitObligation(carol, 100e6, keccak256("inv2"), uint64(block.timestamp + 7 days));
        vm.prank(carol); uint256 id2 = hub.submitObligation(alice,  80e6, keccak256("inv3"), uint64(block.timestamp + 7 days));

        vm.prank(bob);   hub.confirmObligation(id0);
        vm.prank(carol); hub.confirmObligation(id1);
        vm.prank(alice); hub.confirmObligation(id2);

        uint256[] memory ids = new uint256[](3);
        ids[0] = id0; ids[1] = id1; ids[2] = id2;
        vm.prank(op);
        hub.closeCycle(ids);

        // net positions: alice +40, bob -20, carol -20
        address[] memory payers = new address[](2);
        uint256[] memory inAmt  = new uint256[](2);
        payers[0] = bob;   inAmt[0] = 20e6;
        payers[1] = carol; inAmt[1] = 20e6;

        address[] memory receivers = new address[](1);
        uint256[] memory outAmt    = new uint256[](1);
        receivers[0] = alice; outAmt[0] = 40e6;

        vm.prank(bob);   usdc.approve(address(hub), 20e6);
        vm.prank(carol); usdc.approve(address(hub), 20e6);

        uint256 aliceBefore = usdc.balanceOf(alice);

        vm.prank(op);
        hub.settle(payers, inAmt, receivers, outAmt);

        assertEq(usdc.balanceOf(alice) - aliceBefore, 40e6, "alice should net +40");
    }

    function test_onlyCreditorConfirms() public {
        vm.prank(alice);
        uint256 id = hub.submitObligation(bob, 100e6, bytes32(0), uint64(block.timestamp + 1 days));

        vm.expectRevert("not creditor");
        vm.prank(alice);
        hub.confirmObligation(id);
    }

    function test_settleRevertsWhenUnbalanced() public {
        vm.prank(alice); uint256 id0 = hub.submitObligation(bob, 100e6, bytes32(0), uint64(block.timestamp + 1 days));
        vm.prank(bob);   hub.confirmObligation(id0);

        uint256[] memory ids = new uint256[](1); ids[0] = id0;
        vm.prank(op); hub.closeCycle(ids);

        address[] memory payers = new address[](1);
        uint256[] memory inAmt  = new uint256[](1);
        payers[0] = alice; inAmt[0] = 100e6;

        address[] memory receivers = new address[](1);
        uint256[] memory outAmt    = new uint256[](1);
        receivers[0] = bob; outAmt[0] = 50e6;  // wrong

        vm.prank(alice); usdc.approve(address(hub), 100e6);

        vm.expectRevert("unbalanced");
        vm.prank(op);
        hub.settle(payers, inAmt, receivers, outAmt);
    }

    function test_nonOperatorCannotSettle() public {
        address[] memory a = new address[](0);
        uint256[] memory b = new uint256[](0);
        vm.expectRevert("not operator");
        vm.prank(alice);
        hub.settle(a, b, a, b);
    }

    function test_savingsEmitted() public {
        vm.prank(alice); uint256 id0 = hub.submitObligation(bob,   100e6, bytes32(0), uint64(block.timestamp + 1 days));
        vm.prank(bob);   uint256 id1 = hub.submitObligation(carol, 100e6, bytes32(0), uint64(block.timestamp + 1 days));
        vm.prank(carol); uint256 id2 = hub.submitObligation(alice,  80e6, bytes32(0), uint64(block.timestamp + 1 days));
        vm.prank(bob);   hub.confirmObligation(id0);
        vm.prank(carol); hub.confirmObligation(id1);
        vm.prank(alice); hub.confirmObligation(id2);

        uint256[] memory ids = new uint256[](3);
        ids[0]=id0; ids[1]=id1; ids[2]=id2;
        vm.prank(op); hub.closeCycle(ids);

        address[] memory payers = new address[](2);
        uint256[] memory inAmt  = new uint256[](2);
        payers[0]=bob;   inAmt[0]=20e6;
        payers[1]=carol; inAmt[1]=20e6;
        address[] memory receivers = new address[](1);
        uint256[] memory outAmt    = new uint256[](1);
        receivers[0]=alice; outAmt[0]=40e6;

        vm.prank(bob);   usdc.approve(address(hub), 20e6);
        vm.prank(carol); usdc.approve(address(hub), 20e6);

        vm.expectEmit(false, false, false, true);
        emit NettingHub.Settled(0, 40e6, 240e6, 3);
        vm.prank(op);
        hub.settle(payers, inAmt, receivers, outAmt);
    }
}
