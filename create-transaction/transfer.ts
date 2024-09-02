// Create a transaction on Solana
import {
    Connection,
    Transaction,
    SystemProgram,
    sendAndConfirmTransaction,
    PublicKey,
} from "@solana/web3.js";
import "dotenv/config";
config({path: "/workspace/solana-bootcamp/generate-keypair/.env"});
import { getKeypairFromEnvironment } from "@solana-developers/helpers";
import { config } from "dotenv";

const suppliedToPubkey = process.argv[2] || null;

if (!suppliedToPubkey) {
    console.log('Please provide a public key to send to');
    process.exit(1);
}

const senderKeypair = getKeypairFromEnvironment("SECRET_KEY");

console.log(`suppliedToPubkey: ${suppliedToPubkey}`);

const toPubkey = new PublicKey(suppliedToPubkey);

const connection = new Connection("https://api.devnet.solana.com/", "confirmed");

console.log(`✅ Loaded our own keypair, the destination public key, and connected to Solana`,);

const transaction = new Transaction();

// Changed lamports to send to make the transfer and fee distinct in explorer
const LAMPORTS_TO_SEND = 5000000;

const sendSolInstruction = SystemProgram.transfer({
    fromPubkey: senderKeypair.publicKey,
    toPubkey,
    lamports: LAMPORTS_TO_SEND,
});

transaction.add(sendSolInstruction);

async function sendTransactionWithTiming() {
    const startTime = Date.now(); // Record the start time

    try {
        const signature = await sendAndConfirmTransaction(connection, transaction, [
            senderKeypair,
        ]);

        const endTime = Date.now(); // Record the end time
        const timeTaken = (endTime - startTime) / 1000; // Calculate the time taken in seconds

        console.log(`💸 Finished! Sent ${LAMPORTS_TO_SEND} to the address ${toPubkey}. `,);
        console.log(`Transaction signature is ${signature}!`);
        console.log(`⏱ Time taken for transaction: ${timeTaken} seconds`);

        // Check the transaction status
        const status = await connection.getSignatureStatus(signature);
        if (status?.value?.confirmationStatus) {
            console.log(`🔍 Transaction confirmation status: ${status.value.confirmationStatus}`);
        } else {
            console.log('🔍 Unable to retrieve confirmation status.')
        }
    } catch (error) {
        console.error("❌ Transaction failed:", error);
    }
}

sendTransactionWithTiming();
