import { Contract, Event } from "ethers";
import { LogDescription } from "ethers/lib/utils";
import { ethers } from "hardhat";

export const advanceTime = async (amount: number) => {
    await ethers.provider.send("evm_increaseTime", [amount]);
    await ethers.provider.send("evm_mine", []);
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
            if (inputParamTypes[currentIndex].type === 'address') {
                localRes = ethers.utils.getAddress(currentValue) === ethers.utils.getAddress(eventArgs[currentIndex]);
            } else if (inputParamTypes[currentIndex].type === 'uint256') {
                localRes = currentValue.eq(eventArgs[currentIndex]);
            } else {
                localRes = currentValue === eventArgs[currentIndex];
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