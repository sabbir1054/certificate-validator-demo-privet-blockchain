# Certificate Validator - Private Blockchain

A full-stack certificate validation system built on **Hyperledger Fabric** (private blockchain). Universities can issue, update, verify, and revoke academic certificates with tamper-proof integrity using SHA-256 hashing and blockchain immutability.

## Tech Stack

| Component  | Technology                       |
| ---------- | -------------------------------- |
| Frontend   | React 19, Vite, Tailwind CSS     |
| Backend    | Node.js, Express                 |
| Blockchain | Hyperledger Fabric 2.5           |
| Chaincode  | TypeScript (fabric-contract-api) |
                           

## Prerequisites

- **Node.js v23+** — Required for the frontend (React 19 + Vite)
- **Node.js v18** — Required for Hyperledger Fabric and the backend
- **Docker & Docker Compose** — Required for the Fabric network
- **nvm** (recommended) — To switch between Node.js versions easily

> Use [nvm](https://github.com/nvm-sh/nvm) to manage multiple Node.js versions:
>
> ```bash
> nvm install 18
> nvm install 23
> ```

## Project Structure

```
certificate-validator-demo-privet-blockchain/
├── certificate-validator-frontend/    # React + Vite frontend
├── certificate-validator-backend/     # Node.js Express API
└── fabric-samples/                    # Hyperledger Fabric network & chaincode
    ├── test-network/                  # Fabric test network (Docker)
    └── asset-transfer-basic/
        └── chaincode-typescript/      # CertificateContract chaincode
```

## Setup & Run

### 1. Start Hyperledger Fabric Network (Node v18)

```bash
nvm use 18
```

```bash
cd fabric-samples/test-network
./network.sh up createChannel -c mychannel
```

Deploy the CertificateContract chaincode:

```bash
./network.sh deployCC -ccn CertificateContract -ccp ../asset-transfer-basic/chaincode-typescript -ccl typescript
```

### 2. Run Backend (Node v18)

```bash
nvm use 18
```

```bash
cd certificate-validator-backend
npm install
npm run dev
```

The backend will start at **http://localhost:8001**.

### 3. Run Frontend (Node v23)

Open a **new terminal**:

```bash
nvm use 23
```

```bash
cd certificate-validator-frontend
npm install
npm run dev
```

The frontend will start at **http://localhost:5173**.

## Stopping the Network

```bash
cd fabric-samples/test-network
./network.sh down
```
