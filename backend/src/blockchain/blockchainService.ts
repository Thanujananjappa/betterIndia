import { ethers } from "ethers";

const MISSING_PERSON_ABI = [
  "function storeMissingPersonData(string memory hash, string memory metadata) public",
  "function getMissingPersonData(string memory hash) public view returns (string memory)",
  "function verifyDataIntegrity(string memory hash) public view returns (bool)",
  "event DataStored(string indexed hash, address indexed sender, uint256 timestamp)",
];

export interface BlockchainConfig {
  rpcUrl: string;
  privateKey: string;
  contractAddress: string;
  chainId: number;
}

export class BlockchainService {
  private provider!: ethers.JsonRpcProvider;
  private wallet!: ethers.Wallet;
  private contract!: ethers.Contract;
  private isConnected = false;

  constructor(config: BlockchainConfig) {
    try {
      if (
        !config.privateKey ||
        config.privateKey === "mock" ||
        config.contractAddress === "mock"
      ) {
        console.warn("⚠️ Skipping real blockchain init (using mock keys)");
        this.isConnected = false;
        return;
      }

      this.provider = new ethers.JsonRpcProvider(config.rpcUrl);
      this.wallet = new ethers.Wallet(config.privateKey, this.provider);
      this.contract = new ethers.Contract(
        config.contractAddress,
        MISSING_PERSON_ABI,
        this.wallet
      );
      this.isConnected = true;
      console.log("✅ Blockchain initialized");
    } catch (err) {
      console.error("❌ Blockchain init failed:", err);
      this.isConnected = false;
    }
  }

  private getContract(): ethers.Contract {
    if (!this.isConnected || !this.contract)
      throw new Error("Blockchain not connected");
    return this.contract;
  }

  async storeDataHash(dataHash: string, metadata: string): Promise<string> {
    if (!this.isConnected) throw new Error("Blockchain not connected");
    const tx = await (this.getContract() as any).storeMissingPersonData(
      dataHash,
      metadata
    );
    const receipt = await tx.wait();
    console.log(`✅ Stored hash on blockchain: ${dataHash}`);
    return receipt.transactionHash;
  }

  async getDataHash(dataHash: string): Promise<string> {
    if (!this.isConnected) throw new Error("Blockchain not connected");
    return await (this.getContract() as any).getMissingPersonData(dataHash);
  }

  async verifyDataIntegrity(dataHash: string): Promise<boolean> {
    if (!this.isConnected) throw new Error("Blockchain not connected");
    return await (this.getContract() as any).verifyDataIntegrity(dataHash);
  }

  generateDataHash(data: any): string {
    const str = JSON.stringify(data, Object.keys(data).sort());
    return ethers.keccak256(ethers.toUtf8Bytes(str));
  }

  getConnectionStatus(): boolean {
    return this.isConnected;
  }
}

// ✅ Mock service for local/dev
export class MockBlockchainService {
  private mockData = new Map<string, string>();

  async storeDataHash(dataHash: string, metadata: string): Promise<string> {
    this.mockData.set(dataHash, metadata);
    console.log(`[MOCK] Stored hash: ${dataHash}`);
    return `mock-tx-${Date.now()}`;
  }

  async getDataHash(dataHash: string): Promise<string> {
    const data = this.mockData.get(dataHash);
    if (!data) throw new Error("Data not found");
    return data;
  }

  async verifyDataIntegrity(dataHash: string): Promise<boolean> {
    return this.mockData.has(dataHash);
  }

  generateDataHash(data: any): string {
    const str = JSON.stringify(data, Object.keys(data).sort());
    return ethers.keccak256(ethers.toUtf8Bytes(str));
  }

  getConnectionStatus(): boolean {
    return true;
  }
}
