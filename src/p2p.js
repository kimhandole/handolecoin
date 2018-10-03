const WebSockets = require("ws");

// array has peers that connected to my server
const sockets = [];

const getSockets = () => sockets;

const startP2PServer = server => {
    const wsServer = new WebSockets.Server({ server });
    wsServer.on("connection", ws => {
        initSocketConnection(ws);
    });
    console.log("Handolecoin P2P Server running");
};

const initSocketConnection = socket => {
    sockets.push(socket);
    handleSocketError(socket);
    socket.on("message", (data) => {
        console.log(data);
    });
    setTimeout(() => { 
        socket.send("welcome");
    }, 5000);
};

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