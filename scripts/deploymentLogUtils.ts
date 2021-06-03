import { Logger } from "tslog";
const log: Logger = new Logger();

export const logDeployment = (instCtrt : any , network: any) => {
  try {
    log.info("Deployment log for network: ", network);
    log.info("Txn Hash: ", instCtrt.deployTransaction.hash);
    log.info("deployed instCtrt:", instCtrt.address);
  } catch (err) {
    log.error("logDeployment failed:", err);
    return -1;
  }
}
