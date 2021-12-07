# Deployment

- `$ cp .env.example .env`
- Edit the env file:
  `PRIVATE_KEY=0xabc # replace with your private key`
- `npm install`
- Run the tests `npx hardhat test`
- Try to deploy on rinkeby `npx hardhat run scripts/deploy-registry.js --network rinkeby`
- Deploy on mainnet `npx hardhat run scripts/deploy-registry.js --network mainnet`
