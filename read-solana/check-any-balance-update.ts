import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";

// The script runs using ES modules and 'esrun'
// This change wraps the entire logic in an immediately invoked async function expression
// Ensuring 'await' works without requiring environment changes
(async () => {
    const suppliedPublicKey = process.argv[2];

    // Remove the parentheses when passing the public key
    if (!suppliedPublicKey) {
        throw new Error("Provide a public key to check the balance of!");
}
 
const connection = new Connection("https://api.devnet.solana.com/", "confirmed");
const publicKey = new PublicKey(suppliedPublicKey);
 
const balanceInLamports = await connection.getBalance(publicKey);
const balanceInSOL = balanceInLamports / LAMPORTS_PER_SOL;
 
console.log(`✅ Finished! The balance for the wallet at address ${publicKey} is ${balanceInSOL}!`,);
})();
