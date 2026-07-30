---
name: "ppDEX: Automated Market Maker"
order: 50
tools:
  - Solidity
  - Web3.js
  - Truffle
  - Ethereum
description: >-
  A Uniswap-V1-style constant-product automated market maker with exchange
  factories, reserve-based pricing, liquidity shares, and a web interface.
external_url: "https://github.com/p-prakhar/ppDEX"
---

Built with Pratham Pekamwar, ppDEX implements a Uniswap-V1-style
constant-product market maker. A factory contract creates one exchange per
ERC-20 token; exchange contracts derive ETH/token prices from pool reserves and
issue liquidity tokens that represent proportional ownership of a pool.

Trades apply a 0.2% fee on each side. We developed the contracts with Truffle
and Ganache, deployed an early version to Rinkeby, and connected them to a
web3.js and MetaMask front end.

[Browse the contracts and front end](https://github.com/p-prakhar/ppDEX).
