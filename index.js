const net = require("net");
const Parser = require("redis-parser");
const server = net.createServer((connecion) => {
  console.log("New client connected");
  connecion.on("data", (data) => {
    const parser = new Parser({
      returnReply: (reply) => {
        const command = reply[0].toUpperCase();
        switch (command) {
          case "PING":
            connecion.write("+PONG\r\n");
            break;
          case "ECHO":
            connecion.write(`+${reply[1]}\r\n`);
            break;
          case "SET":
            const setKey = reply[1];
            const setValue = reply[2];
            store[setKey] = setValue; // Simulate storing the key-value pair
            connecion.write("+OK\r\n");
            break;
          case "GET":
            const getKey = reply[1];
            const getValue = store[getKey];
            if (getValue) {
              connecion.write(`+${getValue}\r\n`);
            } else {
              connecion.write("$-1\r\n"); // Key not found
            }
            break;
          default:
            connecion.write("-ERR unknown command\r\n");
        }
      },
      returnError: (err) => {
        console.error("=>", err);
      },
    });
    parser.execute(data);
    connecion.write("+OK\r\n"); // Simulate a simple OK response
  });
});
server.listen(1569, () => {
  console.log("Redis listening on port 1569");
});
