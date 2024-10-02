import { resolve, join, basename } from "node:path";
import fs from "node:fs/promises";
import solc from "solc";
import chalk from "chalk";

export const rootDir = resolve(import.meta.dirname, "..");
export const contractDir = resolve(rootDir, "contracts");

export async function compileContract(contractFileName: string) {
  const contractPath = join(contractDir, contractFileName);

  const contractName = basename(contractPath, ".sol");

  const source = await fs.readFile(contractPath, "utf-8");

  const compilerInput = {
    language: "Solidity",
    settings: {
      optimizer: {
        enabled: true,
      },
      outputSelection: {
        "*": {
          "*": ["*"],
        },
      },
    },
    sources: {
      [contractFileName]: {
        content: source,
      },
    },
  };
  const output = JSON.parse(solc.compile(JSON.stringify(compilerInput)));

  if (output.errors) {
    console.warn(chalk.yellow(output.errors[0].formattedMessage));
    throw new Error(`Cannot Parse ${contractFileName}`);
  }

  const contractEVM = output.contracts[contractFileName][contractName];

  return {
    abi: contractEVM.abi,
    bytecode: contractEVM.evm.bytecode.object,
  };
}
