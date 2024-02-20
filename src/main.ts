import App from './app';
import http from 'http';
import cluster from 'cluster';
import { availableParallelism } from 'os';
import dotenv from 'dotenv';
dotenv.config();

const port = +process.env.PORT || 3000;

if (cluster.isPrimary && process.argv.includes('--multi')) {
  let nextCluster = +port + 1;
  const proxyServer = http.createServer((req, res) => {
    let reqData = '';
    const { method, url, headers } = req;
    req.on('data', (data) => {
      reqData = data;
    });
    req.on('end', () => {
      const workerReq = http.request({ method: method, port: nextCluster, path: url, headers, hostname: 'localhost' }, (workerRes) => {
        let workerResData = '';
        workerRes.on('data', (data) => {
          workerResData = data;
        });

        workerRes.on('end', () => {
          res.writeHead(workerRes.statusCode, { 'Content-Type': 'application/json' });
          res.end(workerResData);
          if (nextCluster - port == availableParallelism() - 1) {
            nextCluster = port + 1;
          } else {
            nextCluster += 1;
          }
        });
      });
      workerReq.write(reqData);
      workerReq.end();
    });
  });

  proxyServer.listen(port, () => {
    console.log(`Proxy server listening on port ${port}`);
  });

  for (let i = 0; i < availableParallelism() - 1; i++) {
    cluster.fork({ PORT: port + i + 1 });
  }

  cluster.on('message', (excludedWorker, data) => {
    Object.values(cluster.workers).forEach((worker) => {
      if (worker.id !== excludedWorker.id) {
        worker.send(data);
      }
    });
  });
} else {
  const app = new App({ port: +process.env.PORT });
  app.start();
}
