import { expect, describe, it, beforeEach } from "vitest";
import { deployContract } from "../helpers/deployContract.js";
import { web3 } from "../lib/web3.js";
import { compileContract } from "../helpers/compileContract.js";
import { add, getTime } from "date-fns";
import { fakerPT_BR as faker } from "@faker-js/faker";
import { Contract } from "web3";

async function makeSut() {
  const accounts = await web3.eth.getAccounts();

  const { abi, bytecode } = await compileContract("TodoContract.sol");

  const contract = await deployContract({
    gas: 1_000_000,
    account: accounts[0],
    bytecode,
    abi,
  });

  return {
    contract,
    accounts: accounts,
  };
}

const mockedTask = () => ({
  name: faker.company.catchPhrase(),
  status: faker.helpers.arrayElement(["closed", "running", "open"]),
  startAt: getTime(add(new Date(), { hours: 1 })),
  endAt: getTime(add(new Date(), { hours: 2 })),
});

const createTask = async (
  contract: Contract<any>,
  task: any,
  account: string,
) => {
  await contract.methods
    .taskCreate(task.name, task.status, task.startAt, task.endAt)
    .send({ from: account, gas: "1000000" });
};

describe("Todo Contract", () => {
  let task = mockedTask();

  beforeEach(() => {
    task = mockedTask();
  });

  it("should create a new Task and find by id", async () => {
    const { accounts, contract } = await makeSut();

    await createTask(contract, task, accounts[0]);

    const returnedTask = await contract.methods
      .taskFindById(0)
      .call<typeof task>();

    expect({
      name: returnedTask.name,
      status: returnedTask.status,
      startAt: Number(returnedTask.startAt),
      endAt: Number(returnedTask.endAt),
    }).toStrictEqual(task);
  });

  it("should update a task and find by id", async () => {
    const { accounts, contract } = await makeSut();

    await createTask(contract, task, accounts[0]);

    task.status = "closed";

    await contract.methods
      .taskUpdate(0, task.name, task.status, task.startAt, task.endAt)
      .send({ from: accounts[0], gas: "1000000" });

    const returnedTask = await contract.methods
      .taskFindById(0)
      .call<typeof task>();

    expect({
      name: returnedTask.name,
      status: returnedTask.status,
      startAt: Number(returnedTask.startAt),
      endAt: Number(returnedTask.endAt),
    }).toStrictEqual(task);
  });

  it("should find all created tasks", async () => {
    const { accounts, contract } = await makeSut();

    const tasks = [mockedTask(), mockedTask()];

    await createTask(contract, tasks[0], accounts[0]);
    await createTask(contract, tasks[1], accounts[0]);

    const [firstTask, secondTask] = await contract.methods
      .taskFindAll()
      .call<(typeof task)[]>();

    expect([
      {
        name: firstTask.name,
        status: firstTask.status,
        startAt: Number(firstTask.startAt),
        endAt: Number(firstTask.endAt),
      },
      {
        name: secondTask.name,
        status: secondTask.status,
        startAt: Number(secondTask.startAt),
        endAt: Number(secondTask.endAt),
      },
    ]).toEqual(tasks);
  });
});
