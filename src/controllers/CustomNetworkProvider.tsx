import { ApiNetworkProvider } from '@elrondnetwork/erdjs-network-providers';

export class CustomNetworkProvider extends ApiNetworkProvider {
  async getTokens(address: string) {
    return await this.doGetGeneric(`accounts/${address}/tokens`);
  }
}
