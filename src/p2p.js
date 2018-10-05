const WebSockets = require("ws"),
    Blockchain = require("./blockchain");

const { getLastBlock } = Blockchain;

// array has peers that connected to my server
const sockets = [];

// Message Types
const GET_LATEST = "GET_LATEST";
const GET_ALL = "GET_ALL";
const BLOCKCHAIN_RESPONSE = "BLOCKCHAIN_RESPONSE";

// Message Creater
const getLastest = () => {
    return {
        type: GET_LATEST,
        data: null
    };
};

const getAll = () => {
    return {
        type: GET_ALL,
        data: null
    };
};

const blockchainResponse = data => {
    return {
        type: BLOCKCHAIN_RESPONSE,
        data
    };
};

const getSockets = () => sockets;

const startP2PServer = server => {
    const wsServer = new WebSockets.Server({ server });
    wsServer.on("connection", ws => {
        initSocketConnection(ws);
    });
    console.log("Handolecoin P2P Server running");
};

const initSocketConnection = ws => {
    sockets.push(ws);
    handleSocketMessages(ws);
    handleSocketError(ws);
    sendMessage(ws, getLastest())
};

const parseData = data => {
    try {
        return JSON.parse(data);
    } catch(e) {
        console.log(e);
        return null;
    }
};

const handleSocketMessages = ws => {
    ws.on("message", data => {
        const message = parseData(data);
        if (message === null) {
            return;
        }
        console.log(message);
        switch (message.type) {
            case GET_LATEST:
                sendMessage(ws, responseLastest());
                break;
            case BLOCKCHAIN_RESPONSE:
                const receivedBlocks = message.data;
                if (receivedBlocks === null) {
                    break;
                }
                handleBlockchainResponse(receivedBlocks);
                break;
        }
    });
};

const sendMessage = (ws, message) => ws.send(JSON.stringify(message));

const responseLastest = () => blockchainResponse([getLastBlock()]);

const handleSocketError = ws => {
    const closeSocketConnection = ws => {
        ws.close();
        sickets.splice(sockets.indexOf(ws), 1);
    };
    ws.on("close", () => closeSocketConnection(ws));
    ws.on("error", () => closeSocketConnection(ws));
};


const connectToPeers = newPeer => {
    const ws = new WebSockets(newPeer);
    ws.on("open", () => {
        initSocketConnection(ws);
    });
};

module.exports = {
    startP2PServer,
    connectToPeers
};