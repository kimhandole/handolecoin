class Block {
    constructor(index, hash, previousHash, timestamp, data){
        this.index = index;
        this.hash = hash;
        this.previousHash = previousHash;
        this.timestamp = timestamp;
        this.data = data;
    }
}

const genesisBlock = new Block(
    0,
    "44BEB3DB011604760F5BD2F764F6ADA32E0ABA1D6158F27A2710455857DA9939",
    null,
    1520312194926,
    "This is the genesis!"
);

let blockchain = [genesisBlock];

