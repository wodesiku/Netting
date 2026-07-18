// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC20} from "openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "openzeppelin-contracts/contracts/token/ERC20/utils/SafeERC20.sol";
import {ReentrancyGuard} from "openzeppelin-contracts/contracts/utils/ReentrancyGuard.sol";
import {Ownable} from "openzeppelin-contracts/contracts/access/Ownable.sol";

/// @title NettingHub - Multilateral obligation netting & settlement on Arc
/// @notice Enterprises register, submit bilateral obligations (invoices), confirm them,
///         and an operator settles the netted residual in USDC in one atomic batch.
/// @dev Mirrors the "Cycles" pattern: net obligations off-chain, settle residuals on-chain.
contract NettingHub is ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;

    IERC20 public immutable usdc;

    struct Obligation {
        address debtor;
        address creditor;
        uint256 amount;      // ERC-20 USDC, 6 decimals
        bytes32 invoiceHash; // hash of off-chain invoice doc
        uint64  dueDate;
        bool debtorApproved;
        bool creditorApproved;
        bool settled;
    }

    /// @notice company name by address
    mapping(address => string) public companyName;
    mapping(address => bool) public isRegistered;

    Obligation[] public obligations;

    /// netting cycle id => list of obligation ids included
    mapping(uint256 => uint256[]) public cycleObligations;
    uint256 public currentCycle;

    /// operators allowed to trigger settlement (off-chain netting engine)
    mapping(address => bool) public isOperator;

    event Registered(address indexed who, string name);
    event ObligationCreated(uint256 indexed id, address indexed debtor, address indexed creditor, uint256 amount, uint64 dueDate);
    event ObligationApproved(uint256 indexed id, address indexed by);
    event CycleClosed(uint256 indexed cycle, uint256 obligationCount, uint256 grossAmount);
    event Settled(uint256 indexed cycle, uint256 nettedAmount, uint256 savedAmount, uint256 transferCount);
    event Transfer(uint256 indexed cycle, address indexed from, address indexed to, uint256 amount);
    event OperatorSet(address indexed op, bool enabled);

    modifier onlyOperator() {
        require(isOperator[msg.sender] || msg.sender == owner(), "not operator");
        _;
    }

    constructor(address _usdc) Ownable(msg.sender) {
        require(_usdc != address(0), "usdc=0");
        usdc = IERC20(_usdc);
    }

    function setOperator(address op, bool enabled) external onlyOwner {
        isOperator[op] = enabled;
        emit OperatorSet(op, enabled);
    }

    function register(string calldata name) external {
        require(bytes(name).length > 0, "empty name");
        companyName[msg.sender] = name;
        isRegistered[msg.sender] = true;
        emit Registered(msg.sender, name);
    }

    /// @notice debtor submits an obligation "I owe creditor `amount`"
    function submitObligation(
        address creditor,
        uint256 amount,
        bytes32 invoiceHash,
        uint64 dueDate
    ) external returns (uint256 id) {
        require(isRegistered[msg.sender] && isRegistered[creditor], "not registered");
        require(creditor != msg.sender, "self obligation");
        require(amount > 0, "amount=0");

        id = obligations.length;
        obligations.push(Obligation({
            debtor: msg.sender,
            creditor: creditor,
            amount: amount,
            invoiceHash: invoiceHash,
            dueDate: dueDate,
            debtorApproved: true,   // submitter auto-approves
            creditorApproved: false,
            settled: false
        }));
        emit ObligationCreated(id, msg.sender, creditor, amount, dueDate);
    }

    /// @notice creditor confirms the obligation is valid
    function confirmObligation(uint256 id) external {
        Obligation storage o = obligations[id];
        require(msg.sender == o.creditor, "not creditor");
        require(!o.settled, "settled");
        o.creditorApproved = true;
        emit ObligationApproved(id, msg.sender);
    }

    /// @notice operator snapshots approved obligations into a netting cycle
    function closeCycle(uint256[] calldata ids) external onlyOperator returns (uint256 cycle) {
        cycle = currentCycle;
        uint256 gross;
        for (uint256 i = 0; i < ids.length; i++) {
            Obligation storage o = obligations[ids[i]];
            require(o.debtorApproved && o.creditorApproved, "not approved");
            require(!o.settled, "already settled");
            o.settled = true; // lock it into this cycle
            cycleObligations[cycle].push(ids[i]);
            gross += o.amount;
        }
        emit CycleClosed(cycle, ids.length, gross);
        currentCycle++;
    }

    /// @notice atomic settlement: net payers pay in, net receivers pull out
    /// @param payers   net debtors (must have approved this contract for `amountsIn`)
    /// @param amountsIn  USDC each payer contributes
    /// @param receivers net creditors
    /// @param amountsOut USDC each receiver gets
    function settle(
        address[] calldata payers,
        uint256[] calldata amountsIn,
        address[] calldata receivers,
        uint256[] calldata amountsOut
    ) external nonReentrant onlyOperator {
        require(payers.length == amountsIn.length, "payers len");
        require(receivers.length == amountsOut.length, "receivers len");

        uint256 totalIn;
        uint256 totalOut;
        uint256 cycle = currentCycle - 1;

        for (uint256 i = 0; i < payers.length; i++) {
            if (amountsIn[i] == 0) continue;
            totalIn += amountsIn[i];
            usdc.safeTransferFrom(payers[i], address(this), amountsIn[i]);
            emit Transfer(cycle, payers[i], address(this), amountsIn[i]);
        }
        for (uint256 i = 0; i < receivers.length; i++) {
            if (amountsOut[i] == 0) continue;
            totalOut += amountsOut[i];
            usdc.safeTransfer(receivers[i], amountsOut[i]);
            emit Transfer(cycle, address(this), receivers[i], amountsOut[i]);
        }
        require(totalIn == totalOut, "unbalanced");

        // savings metric: sum of original gross vs net moved
        uint256 gross;
        uint256[] storage ids = cycleObligations[cycle];
        for (uint256 i = 0; i < ids.length; i++) {
            gross += obligations[ids[i]].amount;
        }
        uint256 saved = gross > totalIn ? gross - totalIn : 0;
        uint256 transferCount = payers.length + receivers.length;
        emit Settled(cycle, totalIn, saved, transferCount);
    }

    function obligationCount() external view returns (uint256) {
        return obligations.length;
    }

    function getObligation(uint256 id) external view returns (Obligation memory) {
        return obligations[id];
    }
}
