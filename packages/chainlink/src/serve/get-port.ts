import net from "net";

function isPortAvailable(port: number) {
    return new Promise((resolve) => {
        const server = net.createServer();

        server.once('error', () => {
            resolve(false);  // Port is not available
        });

        server.once('listening', () => {
            server.close(() => {
                resolve(true);  // Port is available
            });
        });

        server.listen(port);
    });
}

export async function getPort(start: number): Promise<number> {
  let current = start;

  while (!(await isPortAvailable(current))) {
    current++;
  }

  return current;
}
