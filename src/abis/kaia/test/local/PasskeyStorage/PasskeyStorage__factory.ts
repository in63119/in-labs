import { Contract, Interface } from "ethers";
import type { ContractRunner } from "ethers";
import PasskeyStorageArtifact from "./PasskeyStorage.json";
import type {
  PasskeyStorage,
  PasskeyStorageInterface,
} from "./PasskeyStorage-type";

const _abi = PasskeyStorageArtifact.abi;

export class PasskeyStorage__factory {
  static readonly abi = _abi;

  static createInterface(): PasskeyStorageInterface {
    return new Interface(_abi) as PasskeyStorageInterface;
  }

  static connect(
    address: string,
    runner?: ContractRunner | null
  ): PasskeyStorage {
    return new Contract(address, _abi, runner) as unknown as PasskeyStorage;
  }
}
