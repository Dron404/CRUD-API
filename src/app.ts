import { IncomingMessage, createServer } from 'http';
import UserService from './service/user.service';
import StorageService from './service/storage.service';
import { BodyType, ReqParsedDataType, ResDataType } from './common/types';

export default class App {
  private port: number;
  userService: UserService;
  storage: StorageService;
  constructor(args: { port: number }) {
    this.port = args.port;
    this.storage = new StorageService();
    this.userService = new UserService(this.storage);
  }

  async start() {
    const server = createServer(async (req, res) => {
      try {
        const { method, url } = req;
        let response: ResDataType;
        let data: ReqParsedDataType;
        let id: string;

        switch (true) {
          case method === 'GET' && /^\/api\/users\/([^/]+)$/.test(url):
            data = await this.ValidateRequest(req);
            id = req.url.split('/').pop();

            response =
              data.type == BodyType.EMPTY && typeof data.payload == 'string'
                ? this.userService.getUser(id)
                : { code: 400, data: { message: `Request Body should not exist` } };

            res.writeHead(response.code, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(response.data));
            break;

          case method === 'PUT' && /^\/api\/users\/([^/]+)$/.test(url):
            data = await this.ValidateRequest(req);
            id = req.url.split('/').pop();

            response =
              data.type == BodyType.JSON && typeof data.payload != 'string'
                ? this.userService.updateUser(data.payload, id)
                : { code: 400, data: { message: `Invalid request Body: ${data.payload}` } };

            res.writeHead(response.code, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(response.data));
            break;

          case method === 'POST' && /^\/api\/users\/?$/.test(url):
            data = await this.ValidateRequest(req);
            response =
              data.type == BodyType.JSON && typeof data.payload != 'string'
                ? this.userService.addUser(data.payload)
                : { code: 400, data: { message: `Invalid request Body: ${data.payload}` } };

            res.writeHead(response.code, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(response.data));
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
    });
    server.listen(this.port, () => {
      console.log('listening on port ' + this.port);
    });
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
