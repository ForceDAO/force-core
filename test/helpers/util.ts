import { ethers } from "hardhat";

export const advanceTime = async (amount: number) => {
    await ethers.provider.send("evm_increaseTime", [amount]);
    await ethers.provider.send("evm_mine", []);
}