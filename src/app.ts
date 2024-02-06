import { createServer } from 'http';

export default class App {
  private port: number;
  constructor(args: { port: number }) {
    this.port = args.port;
  }

  async start() {
    const server = createServer((req, res) => {
      const { method, url } = req;
      switch (true) {
        case method === 'GET' && url.startsWith('api/users'):
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ url }));
          break;
        case method === 'PUT':
          console.log('PUT');
          break;

        case method === 'POST':
          console.log('POST');
          break;

        case method === 'DELETE':
          console.log('DELETE');
          break;
        default:
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(
            JSON.stringify({
              message: `Cannot ${method} ${url}`,
              error: 'Not Found',
              statusCode: 404,
            })
          );
      }
    });
    server.listen(this.port, () => {
      console.log('listening on port ' + this.port);
    });
  }
}
