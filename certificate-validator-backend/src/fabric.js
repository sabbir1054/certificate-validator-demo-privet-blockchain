const grpc = require('@grpc/grpc-js');
const { connect, signers, hash } = require('@hyperledger/fabric-gateway');
const crypto = require('crypto');
const fs = require('fs').promises;
const path = require('path');

// Configuration - can be overridden by environment variables
const config = {
  channelName: process.env.CHANNEL_NAME || 'mychannel',
  chaincodeName: process.env.CHAINCODE_NAME || 'CertificateContract',
  mspId: process.env.MSP_ID || 'Org1MSP',
  peerEndpoint: process.env.PEER_ENDPOINT || 'localhost:7051',
  peerHostAlias: process.env.PEER_HOST_ALIAS || 'peer0.org1.example.com'
};

// Paths to Fabric crypto materials
const FABRIC_PATH = path.resolve(__dirname, '../../fabric-samples/test-network/organizations/peerOrganizations/org1.example.com');
const USER_PATH = path.join(FABRIC_PATH, 'users/User1@org1.example.com/msp');

let contract = null;
let gateway = null;

/**
 * Initialize connection to Hyperledger Fabric network
 */
async function initFabric() {
  if (contract) return contract;

  // Load credentials
  const keyPath = path.join(USER_PATH, 'keystore', 'priv_sk');
  const certPath = path.join(USER_PATH, 'signcerts', 'User1@org1.example.com-cert.pem');
  const tlsCertPath = path.join(FABRIC_PATH, 'tlsca', 'tlsca.org1.example.com-cert.pem');

  // Create gRPC client
  const tlsRootCert = await fs.readFile(tlsCertPath);
  const tlsCredentials = grpc.credentials.createSsl(tlsRootCert);
  const client = new grpc.Client(config.peerEndpoint, tlsCredentials, {
    'grpc.ssl_target_name_override': config.peerHostAlias
  });

  // Load identity and signer
  const credentials = await fs.readFile(certPath);
  const identity = { mspId: config.mspId, credentials };

  const privateKeyPem = await fs.readFile(keyPath);
  const privateKey = crypto.createPrivateKey(privateKeyPem);
  const signer = signers.newPrivateKeySigner(privateKey);

  // Connect to gateway
  gateway = connect({
    client,
    identity,
    signer,
    hash: hash.sha256,
    evaluateOptions: () => ({ deadline: Date.now() + 5000 }),
    endorseOptions: () => ({ deadline: Date.now() + 15000 }),
    submitOptions: () => ({ deadline: Date.now() + 5000 }),
    commitStatusOptions: () => ({ deadline: Date.now() + 60000 })
  });

  const network = gateway.getNetwork(config.channelName);
  contract = network.getContract(config.chaincodeName);

  console.log(`Connected to channel: ${config.channelName}, chaincode: ${config.chaincodeName}`);
  return contract;
}

/**
 * Get the initialized contract instance
 */
function getContract() {
  if (!contract) {
    throw new Error('Fabric not initialized. Call initFabric() first.');
  }
  return contract;
}

module.exports = { initFabric, getContract };
