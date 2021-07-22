import { assert } from "chai";
import { BigNumber, BigNumberish, Contract, Event } from "ethers";
import { LogDescription } from "ethers/lib/utils";
import { ethers } from "hardhat";

export const advanceTime = async (amount: number) => {
    await ethers.provider.send("evm_increaseTime", [amount]);
    await ethers.provider.send("evm_mine", []);
}

export const isWithin = (pctRange: BigNumber, actualValue: BigNumber, expected: BigNumber) => {
    const range = actualValue.mul(pctRange).div(ethers.BigNumber.from(10).pow(18)).toString();
    const start = actualValue.sub(BigNumber.from(range));
    const finish = actualValue.add(BigNumber.from(range));
    return BigNumber.from(start).lte(expected) && BigNumber.from(finish).gte(expected) ? true : expected.toString();
}

export const containsEvent = (receipt: any, instance: Contract, eventName: string, eventArgs: any[]) => {

    let res = false;

    let events = receipt.events
        // Only relevant address.
        .filter((x: Event) => x.address.toLowerCase() === instance.address.toLowerCase())
        // Parse Events.
        .map((e: Event) => { return instance.interface.parseLog(e); })
        // Only relevant event name.
        .filter((x: LogDescription) => { return x.name == eventName; });

    events.forEach((event: LogDescription) => {
        const inputParamTypes = event.eventFragment.inputs;
        const isMatch = event.args?.reduce((acc: boolean, currentValue: any, currentIndex: number) => {
            let localRes;
            if (typeof eventArgs[currentIndex] === 'function') {
                const fun = eventArgs[currentIndex];
                localRes = fun(currentValue);
                console.log(`${eventName} arg ${currentIndex} fun(${currentValue}) ${localRes}`);
                localRes = localRes === true;
            } else if (inputParamTypes[currentIndex].type === 'address') {
                localRes = ethers.utils.getAddress(currentValue) === ethers.utils.getAddress(eventArgs[currentIndex]);
                console.log(`${eventName} arg ${currentIndex} ${currentValue} === ${eventArgs[currentIndex]}  ${localRes}`);
            } else if (inputParamTypes[currentIndex].type === 'uint256') {
                localRes = currentValue.eq(eventArgs[currentIndex]);
                console.log(`${eventName} arg ${currentIndex} ${currentValue} === ${eventArgs[currentIndex]}  ${localRes}`);
            } else {
                localRes = currentValue === eventArgs[currentIndex];
                console.log(`Unexpected type (edit containsEvent function to handle:)`);
                console.log(`${eventName} arg ${currentIndex} ${currentValue} === ${eventArgs[currentIndex]}  ${localRes}`);
            }
            return acc && localRes;
         },  true);

         if(isMatch) {
             res = isMatch;
         }
    });

    return res;
}