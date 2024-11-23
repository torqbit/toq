import { SecretsProvider, SodiumSecretsProvider } from "./SecretsProvider";

const sodiumProvider = new SodiumSecretsProvider();

class SecretsManager {
  getSecretsProvider = (): SecretsProvider => {
    return sodiumProvider;
  };
}

export default new SecretsManager();
