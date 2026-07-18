// Minimal ABI for NettingHub interactions used by the UI.
export const NETTING_HUB_ABI = [
  {
    type: "function", name: "register", stateMutability: "nonpayable",
    inputs: [{ name: "name", type: "string" }], outputs: [],
  },
  {
    type: "function", name: "submitObligation", stateMutability: "nonpayable",
    inputs: [
      { name: "creditor", type: "address" },
      { name: "amount", type: "uint256" },
      { name: "invoiceHash", type: "bytes32" },
      { name: "dueDate", type: "uint64" },
    ],
    outputs: [{ name: "id", type: "uint256" }],
  },
  {
    type: "function", name: "confirmObligation", stateMutability: "nonpayable",
    inputs: [{ name: "id", type: "uint256" }], outputs: [],
  },
  {
    type: "function", name: "isRegistered", stateMutability: "view",
    inputs: [{ name: "", type: "address" }], outputs: [{ type: "bool" }],
  },
  {
    type: "function", name: "companyName", stateMutability: "view",
    inputs: [{ name: "", type: "address" }], outputs: [{ type: "string" }],
  },
  {
    type: "function", name: "obligationCount", stateMutability: "view",
    inputs: [], outputs: [{ type: "uint256" }],
  },
  {
    type: "function", name: "getObligation", stateMutability: "view",
    inputs: [{ name: "id", type: "uint256" }],
    outputs: [{
      type: "tuple",
      components: [
        { name: "debtor", type: "address" },
        { name: "creditor", type: "address" },
        { name: "amount", type: "uint256" },
        { name: "invoiceHash", type: "bytes32" },
        { name: "dueDate", type: "uint64" },
        { name: "debtorApproved", type: "bool" },
        { name: "creditorApproved", type: "bool" },
        { name: "settled", type: "bool" },
      ],
    }],
  },
  {
    type: "function", name: "closeCycle", stateMutability: "nonpayable",
    inputs: [{ name: "ids", type: "uint256[]" }], outputs: [{ type: "uint256" }],
  },
  {
    type: "function", name: "settle", stateMutability: "nonpayable",
    inputs: [
      { name: "payers", type: "address[]" },
      { name: "amountsIn", type: "uint256[]" },
      { name: "receivers", type: "address[]" },
      { name: "amountsOut", type: "uint256[]" },
    ],
    outputs: [],
  },
] as const;

export const ERC20_ABI = [
  {
    type: "function", name: "approve", stateMutability: "nonpayable",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ type: "bool" }],
  },
  {
    type: "function", name: "balanceOf", stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ type: "uint256" }],
  },
  {
    type: "function", name: "allowance", stateMutability: "view",
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
    ],
    outputs: [{ type: "uint256" }],
  },
] as const;
