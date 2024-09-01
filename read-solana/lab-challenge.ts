// Reading from the Solana blockchain
import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { appendFileSync } from "fs";
import { format } from "date-fns";

const LOG_FILE_PATH = "error-log.txt"; // Define the log file path

// Function to log messages to a file
function logError(message: string) {
    const timestamp = format(new Date(), "yyyy-MM-dd HH:mm:ss");
    const formmattedMessage = '[${timestamp}] ${message}\n';
    appendFileSync(LOG_FILE_PATH, formmattedMessage);
}

(async () => {
    const suppliedPublicKey = process.argv[2];
    if (!suppliedPublicKey) {
        const errorMessage = "❌ Provide a public key to check the balance of!";
        console.error(errorMessage);
        logError(errorMessage);
        process.exit(1);
}

let publicKey: PublicKey;
try {
    publicKey = new PublicKey(suppliedPublicKey);
} catch (error) {
    console.error("❌ Invalid public key provided!");
    process.exit(1); // Exit the process with a failure code
}
 
const connection = new Connection("https://api.mainnet-beta.solana.com/", "confirmed");

try {
    const balanceInLamports = await connection.getBalance(publicKey);
    const balanceInSOL = balanceInLamports / LAMPORTS_PER_SOL;

    console.log(`✅ Finished! The balance for the wallet at address ${publicKey} is ${balanceInSOL}!`,);
} catch(error) {
    const errorMessage = "❌ Error fetching balance. Please check the network connection and the wallet address.";
    console.error(errorMessage);
    logError(errorMessage);
    process.exit(1); // Exit the process with a failure code
  }
})();
