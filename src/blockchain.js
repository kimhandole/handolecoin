const CryptoJS = require("crypto-js");

class Block {
    constructor(index, hash, previousHash, timestamp, data) {
        this.index = index;
        this.hash = hash;
        this.previousHash = previousHash;
        this.timestamp = timestamp;
        this.data = data;
    }
}

const genesisBlock = new Block(
    0,
    "6AE7F705FD92D09E36A198DCDCE2888FA35696DC72B4BA4388860648DF48B592",
    null,
    1538421292.09,
    "This is the genesis!"
);

let blockchain = [genesisBlock];

const getLastBlock = () => blockchain[blockchain.length - 1];

const getTimeStamp = () => new Date().getTime() / 1000;

const getBlockchain = () => blockchain;

const createHash = (index, previousHash, timestamp, data) => 
    CryptoJS.SHA256(index + previousHash + timestamp + JSON.stringify(data)).toString();

const createNewBlock = data => {
    const previousBlock = getLastBlock();
    const newBlockIndex = previousBlock.index + 1;
    const newTimestamp = getTimeStamp();
    const newHash = createHash(
        newBlockIndex, 
        previousBlock.hash, 
        newTimestamp, 
        data
    );
    const newBlock = new Block(
        newBlockIndex,
        newHash,
        previousBlock.hash,
        newTimestamp,
        data
    );
    return newBlock;
};

const getBlockHash = (block) => createHash(block.index, block.previousHash, block.timestamp, block.data);

const isNewBlockVaild = (candidateBlock, lastestBlock) => {
    if (!isNewStructureValid(candidateBlock)) {
        console.log("INVALID: the candidate block structure is not valid");
        return false;
    } else if (lastestBlock.index + 1 !== candidateBlock.index) {
        console.log("INVALID: the candidate block doesn't have a vaild index");
        return false;
    } else if (lastestBlock.hash !== candidateBlock.previousHash) {
        console.log("INVALID: the previousHash doesn't match the candidateBlock's previousHash");
        return false;
    } else if (getBlockHash(candidateBlock) !== candidateBlock.hash) {
        console.log("INVALID: the hash of this block is not valid");
        return false;
    }
    return true;
};

const isNewStructureValid = (block) => {
    return (
        typeof block.index === "number" && 
        typeof block.hash === "string" && 
        typeof block.previousHash === "string" && 
        typeof block.timestamp === "number" &&
        typeof block.data === "string"
    );
};

const isChainValid = (candidateChain) => {
    const isGenesisValid = (block) => {
        return JSON.stringify(block) === JSON.stringify(genesisBlock);
    };
    if (!isGenesisValid(candidateChain[0])) {
        console.log("INVALID: the candidateChain's genesisBlock is not the same as our genesisBlock");
        return false;
    }
    for (let i = 1; i < candidateChain.length; i++) { // i = 1 because, genesis block is already checked
        if (!isNewBlockVaild(candidateChain[i], candidateChain[i - 1])) {
            return false;
        }
    }
    return true;
};

const replaceChain = (newChain) => {
    if (isChainValid(newChain) && newChain.length > getBlockchain().length) {
        blockchain = newChain;
        return true;
    } else {
        return false;
    }
};

const addBlockToChain = (candidateBlock) => {
    if (isNewBlockVaild(candidateBlock, getLastBlock())) {
        getBlockchain().push(candidateBlock);
        return true;
    } else {
        return false;
    }
};