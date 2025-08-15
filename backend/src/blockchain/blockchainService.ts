import { ethers } from 'ethers';

// Smart Contract ABI for Missing Person Data Storage
const MISSING_PERSON_ABI = [
  "function storeMissingPersonData(string memory hash, string memory metadata) public",
  "function getMissingPersonData(string memory hash) public view returns (string memory)",
  "function verifyDataIntegrity(string memory hash) public view returns (bool)",
  "event DataStored(string indexed hash, address indexed sender, uint256 timestamp)"
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
  private isConnected: boolean = false;

  constructor(config: BlockchainConfig) {
    try {
      this.provider = new ethers.JsonRpcProvider(config.rpcUrl);
      this.wallet = new ethers.Wallet(config.privateKey, this.provider);
      this.contract = new ethers.Contract(
        config.contractAddress,
        MISSING_PERSON_ABI,
        this.wallet
      );
      this.isConnected = true;
      console.log('✅ Blockchain service initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize blockchain service:', error);
      this.isConnected = false;
    }
  }

  private getContract(): ethers.Contract {
    if (!this.isConnected || !this.contract) {
      throw new Error('Blockchain service not connected');
    }
    return this.contract;
    }

  /**
   * Store missing person data hash on blockchain
   */
  async storeDataHash(dataHash: string, metadata: string): Promise<string> {
    if (!this.isConnected) {
      throw new Error('Blockchain service not connected');
    }

    try {
      console.log(`🔗 Storing data hash on blockchain: ${dataHash}`);
      
      const tx = await (this.getContract() as any).storeMissingPersonData(dataHash, metadata);
      const receipt = await tx.wait();
      
      console.log(`✅ Data hash stored successfully. Transaction: ${receipt.hash}`);
      
      return receipt.hash;
    } catch (error) {
      console.error('❌ Failed to store data hash on blockchain:', error);
      throw new Error('Failed to store data on blockchain');
    }
  }

  /**
   * Retrieve missing person data from blockchain
   */
  async getDataHash(dataHash: string): Promise<string> {
    if (!this.isConnected) {
      throw new Error('Blockchain service not connected');
    }

    try {
      const data = await (this.getContract() as any).getMissingPersonData(dataHash);
      return data;
    } catch (error) {
      console.error('❌ Failed to retrieve data from blockchain:', error);
      throw new Error('Failed to retrieve data from blockchain');
    }
  }

  /**
   * Verify data integrity on blockchain
   */
  async verifyDataIntegrity(dataHash: string): Promise<boolean> {
    if (!this.isConnected) {
      throw new Error('Blockchain service not connected');
    }

    try {
      const isValid = await (this.getContract() as any).verifyDataIntegrity(dataHash);
      return isValid;
    } catch (error) {
      console.error('❌ Failed to verify data integrity:', error);
      return false;
    }
  }

  /**
   * Generate hash for missing person data
   */
  generateDataHash(data: any): string {
    const dataString = JSON.stringify(data, Object.keys(data).sort());
    return ethers.keccak256(ethers.toUtf8Bytes(dataString));
  }

  /**
   * Get blockchain network info
   */
  async getNetworkInfo() {
    if (!this.isConnected) {
      return { connected: false };
    }

    try {
      const network = await this.provider.getNetwork();
      const balance = await this.provider.getBalance(this.wallet.address);
      
      return {
        connected: true,
        chainId: network.chainId,
        address: this.wallet.address,
        balance: ethers.formatEther(balance),
        contractAddress: this.contract.target
      };
    } catch (error) {
      console.error('❌ Failed to get network info:', error);
      return { connected: false, error: (error as any)?.message };
    }
  }

  /**
   * Check if blockchain service is connected
   */
  getConnectionStatus(): boolean {
    return this.isConnected;
  }
}

// Mock blockchain service for development
export class MockBlockchainService extends BlockchainService {
  private mockData: Map<string, string> = new Map();

  constructor() {
    super({
      rpcUrl: 'mock',
      privateKey: 'mock',
      contractAddress: 'mock',
      chainId: 1
    });
  }

  async storeDataHash(dataHash: string, metadata: string): Promise<string> {
    this.mockData.set(dataHash, metadata);
    console.log(`🔗 [MOCK] Data hash stored: ${dataHash}`);
    return `mock-tx-${Date.now()}`;
  }

  async getDataHash(dataHash: string): Promise<string> {
    const data = this.mockData.get(dataHash);
    if (!data) {
      throw new Error('Data not found');
    }
    return data;
  }

  async verifyDataIntegrity(dataHash: string): Promise<boolean> {
    return this.mockData.has(dataHash);
  }

  getConnectionStatus(): boolean {
    return true;
  }
}
