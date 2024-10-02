import { AbiFragment, Contract } from "web3";
import { web3 } from "../lib/web3.js";

type MakeContractParams = {
  abi: any;
  bytecode: any;
  account: string;
  gas: number;
};

export async function deployContract<T extends ReadonlyArray<AbiFragment>>({
  abi,
  bytecode,
  account,
  gas,
}: MakeContractParams): Promise<Contract<T>> {
  return new web3.eth.Contract(abi)
    .deploy({ data: "0x" + bytecode })
    .send({ from: account, gas: "1000000" });
}
