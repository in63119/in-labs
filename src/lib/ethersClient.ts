import {
  toUtf8Bytes,
  Wallet,
  keccak256,
  JsonRpcProvider,
  Contract,
  FeeData,
  encodeBytes32String,
  Interface,
} from "ethers";
import { decrypt } from "@/lib/crypto";
import { getAbis } from "@/abis";
import { CONTRACT_NAME, RELAYER_STATUS, RELAYER_NUMBER } from "@/common/enums";
import { fromException } from "@/server/errors/exceptions";
import type {
  ContractLikeError,
  SendTxByRelayer,
  FirebaseRelayer,
} from "@/common/types";
import getConfig from "@/common/config/default.config";
import { configReady } from "@/server/bootstrap/init";
import {
  readFirebaseData,
  writeFirebaseData,
} from "@/server/modules/firebase/firebase.service";

const abis = getAbis();
const {
  AuthStorage,
  PostStorage,
  PostForwarder,
  VisitorStorage,
  YoutubeStorage,
  SubscriberStorage,
  RelayerManager,
} = abis;
const { address: AuthStorageAddress, abi: AuthStorageAbi } = AuthStorage;
const { address: PostStorageAddress, abi: PostStorageAbi } = PostStorage;
const { address: PostForwarderAddress, abi: PostForwarderAbi } = PostForwarder;
const { address: VisitorStorageAddress, abi: VisitorStorageAbi } =
  VisitorStorage;
const { address: YoutubeStorageAddress, abi: YoutubeStorageAbi } =
  YoutubeStorage;
const { address: SubscriberStorageAddress, abi: SubscriberStorageAbi } =
  SubscriberStorage;
const { address: RelayerManagerAddress, abi: RelayerManagerAbi } =
  RelayerManager;

const salt = process.env.NEXT_PUBLIC_ADMIN_AUTH_CODE_HASH;
if (!salt) {
  throw new Error("NEXT_PUBLIC_ADMIN_AUTH_CODE_HASH env is missing");
}
const relayerPrivateKeyEncrypted = process.env.NEXT_PUBLIC_RELAYER_PRIVATE_KEY;
if (!relayerPrivateKeyEncrypted) {
  throw new Error("NEXT_PUBLIC_RELAYER_PRIVATE_KEY env is missing");
}

const provider = new JsonRpcProvider("https://public-en-kairos.node.kaia.io");
const relayerPrivateKey = decrypt(relayerPrivateKeyEncrypted, salt);

export const accounts = async () => {
  await configReady;
  const rootConfig = getConfig();
  const blockchainConfig = rootConfig.blockchain;
  if (
    !blockchainConfig ||
    !blockchainConfig.contractsOwnerPK ||
    !blockchainConfig.relayer2PK ||
    !blockchainConfig.relayer3PK
  ) {
    throw fromException("System", "INTERNAL_SERVER_ERROR");
  }

  return {
    owner: new Wallet(
      decrypt(blockchainConfig.contractsOwnerPK, salt),
      provider
    ),
    relayer: new Wallet(relayerPrivateKey, provider),
    relayer2: new Wallet(decrypt(blockchainConfig.relayer2PK, salt), provider),
    relayer3: new Wallet(decrypt(blockchainConfig.relayer3PK, salt), provider),
  };
};

export const relayer = new Wallet(relayerPrivateKey, provider);

export const wallet = (email: string) => {
  const input = toUtf8Bytes(email + salt);
  const privateKeyBytes = keccak256(input);
  const wallet = new Wallet(privateKeyBytes);

  return wallet;
};

export const authStorage = new Contract(
  AuthStorageAddress,
  AuthStorageAbi,
  provider
) as any; // eslint-disable-line @typescript-eslint/no-explicit-any -- using plain Contract until typechain mismatch is resolved

export const postStorage = new Contract(
  PostStorageAddress,
  PostStorageAbi,
  provider
) as any; // eslint-disable-line @typescript-eslint/no-explicit-any -- using plain Contract until typechain mismatch is resolved

export const postForwarder = new Contract(
  PostForwarderAddress,
  PostForwarderAbi,
  provider
) as any; // eslint-disable-line @typescript-eslint/no-explicit-any -- using plain Contract until typechain mismatch is resolved

export const visitorStorage = new Contract(
  VisitorStorageAddress,
  VisitorStorageAbi,
  relayer
) as any; // eslint-disable-line @typescript-eslint/no-explicit-any -- using plain Contract until typechain mismatch is resolved

export const youtubeStorage = new Contract(
  YoutubeStorageAddress,
  YoutubeStorageAbi,
  relayer
) as any; // eslint-disable-line @typescript-eslint/no-explicit-any -- using plain Contract until typechain mismatch is resolved

export const subscriberStorage = new Contract(
  SubscriberStorageAddress,
  SubscriberStorageAbi,
  relayer
) as any; // eslint-disable-line @typescript-eslint/no-explicit-any -- using plain Contract until typechain mismatch is resolved

export const relayerManager = new Contract(
  RelayerManagerAddress,
  RelayerManagerAbi,
  provider
) as any; // eslint-disable-line @typescript-eslint/no-explicit-any -- using plain Contract until typechain mismatch is resolved

const getContract = (contract: CONTRACT_NAME) => {
  switch (contract) {
    case CONTRACT_NAME.POSTSTORAGE:
      return postStorage;

    case CONTRACT_NAME.AUTHSTORAGE:
      return authStorage;

    case CONTRACT_NAME.POSTFORWARDER:
      return postForwarder;

    case CONTRACT_NAME.RELAYERMANAGER:
      return relayerManager;

    case CONTRACT_NAME.VISITORSTORAGE:
      return visitorStorage;

    case CONTRACT_NAME.YOUTUBESTORAGE:
      return youtubeStorage;

    case CONTRACT_NAME.SUBSCRIBERSTORAGE:
      return subscriberStorage;
    default:
      throw fromException("Blockchain", "CONTRACT_NOT_FOUND");
  }
};

export const getReadyRelayerWallet = async () => {
  const { relayer, relayer2, relayer3 } = await accounts();
  const firebaseRelayers =
    (await readFirebaseData<Record<string, FirebaseRelayer>>("relayers")) ?? {};

  const availableRelayers = [relayer, relayer2, relayer3];

  for (const walletCandidate of availableRelayers) {
    const walletAddress = walletCandidate.address.toLowerCase();
    const isReady = Object.values(firebaseRelayers).some(
      (entry) =>
        entry?.status === RELAYER_STATUS.Ready &&
        entry.address?.toLowerCase() === walletAddress
    );
    if (isReady) {
      return walletCandidate;
    }
  }

  throw fromException("Blockchain", "NO_AVAILABLE_RELAYER");
};

export const beginProcessingRelayer = async (relayerAddress: string) => {
  try {
    const relayer =
      RELAYER_NUMBER[relayerAddress as keyof typeof RELAYER_NUMBER];
    await writeFirebaseData(
      `relayers/${relayer}/status`,
      RELAYER_STATUS.Processing
    );
  } catch (error) {
    console.error("beginProcessingRelayer error", error);
    throw fromException("Blockchain", "FAILED_TX");
  }
};

export const finishProcessingRelayer = async (relayerAddress: string) => {
  try {
    const relayer =
      RELAYER_NUMBER[relayerAddress as keyof typeof RELAYER_NUMBER];
    await writeFirebaseData(`relayers/${relayer}/status`, RELAYER_STATUS.Ready);
  } catch (error) {
    console.error("finishProcessingRelayer error", error);
    throw fromException("Blockchain", "FAILED_TX");
  }
};

export const sendTxByRelayer = async ({
  contract,
  method,
  arg,
}: SendTxByRelayer) => {
  const relayerWallet = await getReadyRelayerWallet();
  let processingStarted = false;

  try {
    await beginProcessingRelayer(await relayerWallet.getAddress());
    processingStarted = true;

    const contractInstance = await getContract(contract);
    const signerContract = (await contractInstance.connect(
      relayerWallet
    )) as Contract;

    const feeData = await getFeeData();

    const estimate = await estimateGas(
      signerContract,
      method,
      [...arg],
      feeData,
      {
        from: await relayerWallet.getAddress(),
      }
    );

    const tx = await signerContract[method](...arg, {
      maxPriorityFeePerGas: feeData.maxPriorityFeePerGas,
      maxFeePerGas: feeData.maxFeePerGas,
      gasLimit: estimate,
    });
    const receipt = await tx.wait();

    return receipt;
  } catch (error) {
    console.error("sendTxByRelayer ", error);
    throw fromException("Blockchain", "FAILED_TX");
  } finally {
    if (processingStarted) {
      await finishProcessingRelayer(await relayerWallet.getAddress());
    }
  }
};

export const getDeadline = () => {
  return Math.floor(Date.now() / 1000) + 300;
};

export const getFeeData = async () => {
  return await provider.getFeeData();
};

export const estimateGas = async (
  contract: Contract,
  method: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- ABI signatures require accepting arbitrary argument types
  arg: any[],
  feeData: FeeData,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- optional overrides come from external callers with dynamic shape
  options?: any
) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- ethers returns an untyped Contract instance
  const signerContract = contract.connect(relayer) as any;

  if (options?.from) {
    return await provider.estimateGas({
      from: options.from,
      to: contract.target,
      data: contract.interface.encodeFunctionData(method, [...arg]),
      maxPriorityFeePerGas: 0,
      maxFeePerGas: 0,
    });
  }

  return await signerContract[method].estimateGas(...arg, {
    maxPriorityFeePerGas: feeData.maxPriorityFeePerGas,
    maxFeePerGas: feeData.maxFeePerGas,
  });
};

export const getTypedData = async (
  recipientName: CONTRACT_NAME,
  address: string,
  method: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- forwarded payload must support heterogeneous argument lists
  arg: any[]
) => {
  const recipient = getContract(recipientName);

  const eip712Domain = await postForwarder.eip712Domain();
  const domain = {
    name: eip712Domain[1],
    version: eip712Domain[2],
    chainId: eip712Domain[3],
    verifyingContract: eip712Domain[4],
  };
  const types = {
    ForwardRequest: [
      { name: "from", type: "address" },
      { name: "to", type: "address" },
      { name: "value", type: "uint256" },
      { name: "gas", type: "uint256" },
      { name: "nonce", type: "uint256" },
      { name: "deadline", type: "uint48" },
      { name: "data", type: "bytes" },
    ],
  };

  const nonce = await postForwarder.nonces(address);
  const deadline = getDeadline();
  const data = recipient.interface.encodeFunctionData(method, [...arg]);

  const feeData = await getFeeData();

  const estimate = await estimateGas(recipient, method, [...arg], feeData, {
    from: address,
  });

  const message = {
    from: address,
    to: recipient.target,
    value: 0,
    nonce: nonce,
    deadline: deadline,
    gas: estimate,
    data: data,
  };

  return {
    domain,
    types,
    message,
  };
};

export const signTypedData = async (
  signer: Wallet,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- typed data structure varies per contract
  data: any
) => {
  const { domain, types, message } = data;

  return await signer.signTypedData(domain, types, message);
};

export const byte32 = (str: string) => {
  return encodeBytes32String(str);
};

export const iface = (args: string[]) => {
  return new Interface([...args]);
};

export const decodeContractError = (
  error: unknown,
  fragments: string[]
): ReturnType<Interface["parseError"]> | null => {
  const contractInterface = iface(fragments);
  const payload =
    typeof error === "object" && error !== null
      ? (error as ContractLikeError).data ??
        (error as ContractLikeError).error?.data
      : undefined;

  if (!payload) return null;

  try {
    return contractInterface.parseError(payload);
  } catch (parseError) {
    console.error("Failed to decode contract error", parseError);
    return null;
  }
};
