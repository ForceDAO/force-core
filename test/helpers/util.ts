import { ethers } from "hardhat";

export const advanceTime = async (amount: number) => {
    const advanceTo = Math.floor(Date.now() / 1000) + amount;
    await ethers.provider.send("evm_setNextBlockTimestamp", [advanceTo]);
    await ethers.provider.send("evm_mine", []);
}