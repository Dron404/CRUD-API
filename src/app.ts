import { IncomingMessage, ServerResponse, createServer } from 'http';
import UserService from './service/user.service';
import StorageService from './service/storage.service';
import { BodyType, ReqParsedDataType, ResDataType } from './common/types';
import cluster from 'cluster';

export default class App {
  private port: number;
  userService: UserService;
  storage: StorageService;
  server;
  constructor(args: { port: number }) {
    this.port = args.port;
    this.storage = new StorageService();
    this.userService = new UserService(this.storage);
    this.server = createServer(this.handleRequest.bind(this));
  }

  async start() {
    this.server.listen(this.port, () => {
      console.log(`${cluster.isWorker ? 'Worker' : 'App'} listening on port ${this.port}`);
    });
  }

  async close() {
    this.server.close();
  }

  private async handleRequest(req: IncomingMessage, res: ServerResponse) {
    if (cluster.isWorker) {
      //! only for test in multi worker
      console.log(`Hi from port ${process.env.PORT}! I have new ${req.method} request`);
    }
    try {
      const { method, url } = req;
      let response: ResDataType;
      let data: ReqParsedDataType;
      let id: string;

      switch (true) {
        //* get User
        case method === 'GET' && /^\/api\/users\/([^/]+)\/?$/.test(url):
          data = await this.ValidateRequest(req);
          id = req.url.split('/')[3];

          response =
            data.type == BodyType.EMPTY && typeof data.payload == 'string'
              ? await this.userService.getUser(id)
              : { code: 400, data: { message: `Request Body should not exist` } };

          res.writeHead(response.code, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(response.data));
          break;

        //* get Users
        case method === 'GET' && /^\/api\/users\/?$/.test(url):
          data = await this.ValidateRequest(req);

          response =
            data.type == BodyType.EMPTY && typeof data.payload == 'string'
              ? await this.userService.getUsers()
              : { code: 400, data: { message: `Request Body should not exist` } };

          res.writeHead(response.code, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(response.data));
          break;

        //* update User
        case method === 'PUT' && /^\/api\/users\/([^/]+\/?)$/.test(url):
          data = await this.ValidateRequest(req);
          id = req.url.split('/')[3];

          response =
            data.type == BodyType.JSON && typeof data.payload != 'string'
              ? await this.userService.updateUser(data.payload, id)
              : { code: 400, data: { message: `Invalid request Body: ${data.payload}` } };

          res.writeHead(response.code, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(response.data));
          break;

        //* create User
        case method === 'POST' && /^\/api\/users\/?$/.test(url):
          data = await this.ValidateRequest(req);
          response =
            data.type == BodyType.JSON && typeof data.payload != 'string'
              ? await this.userService.addUser(data.payload)
              : { code: 400, data: { message: `Invalid request Body: ${data.payload}` } };

          res.writeHead(response.code, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(response.data));
          break;

        //* delete User
        case method === 'DELETE' && /^\/api\/users\/([^/]+\/?)$/.test(url):
          data = await this.ValidateRequest(req);
          id = req.url.split('/')[3];

          response =
            data.type == BodyType.EMPTY && typeof data.payload == 'string'
              ? await this.userService.deleteUser(id)
              : { code: 400, data: { message: `Request Body should not exist` } };

          res.writeHead(response.code, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(response.data));
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
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({
          message: e.message,
          error: 'Internal Server Error',
          statusCode: 500,
        })
      );
    }
  }
  async ValidateRequest(req: IncomingMessage): Promise<ReqParsedDataType> {
    return new Promise((resolve) => {
      let body = '';
      req.on('data', (data) => {
        try {
          body = JSON.parse(data);
          resolve({ type: BodyType.JSON, payload: body });

          resolve({ type: BodyType.EMPTY, payload: 'Body is empty' });
        } catch (e) {
          resolve({ type: BodyType.INVALID_JSON, payload: e.message });
        }
      });
      req.on('end', () => {
        resolve({ type: BodyType.EMPTY, payload: 'Body is empty' });
      });
    });
  }
}
