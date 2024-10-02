import { interop } from "../helpers/interop.js";

const Web3 = await interop(import("web3"));

const provider = new Web3.providers.HttpProvider("http://127.0.0.1:7545");

export const web3 = new Web3(provider);
