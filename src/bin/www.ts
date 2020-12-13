/* eslint-disable */
import app from '../app';

const port = process.env.PORT || 3000;

/** Listen on provided port, on all network interfaces. */
const server = app.listen(port, () =>
  console.log(`Node app is running on port ${port}`)
);

// need this in docker container to properly exit since node doesn't handle SIGINT/SIGTERM
// this also won't work on using npm start since:
// https://github.com/npm/npm/issues/4603
// https://github.com/npm/npm/pull/10868
// https://github.com/RisingStack/kubernetes-graceful-shutdown-example/blob/master/src/index.js
// if you want to use npm then start with `docker run --init` to help, but I still don't think it's
// a graceful shutdown of node process
//

// quit on ctrl-c when running docker in terminal
process.on('SIGINT', () => {
  console.info(
    'Got SIGINT (aka ctrl-c in docker). Graceful shutdown ',
    new Date().toISOString()
  );
  shutdown();
});

// quit properly on docker stop
process.on('SIGTERM', () => {
  console.info(
    'Got SIGTERM (docker container stop). Graceful shutdown ',
    new Date().toISOString()
  );
  shutdown();
});

const sockets: any = {};
let nextSocketId = 0;
server.on('connection', (socket) => {
  const socketId = nextSocketId++;
  sockets[socketId] = socket;

  socket.once('close', () => {
    delete sockets[socketId];
  });
});

// shut down server
function shutdown() {
  waitForSocketsToClose(10);

  server.close((err) => {
    if (err) {
      console.error(err);
      process.exitCode = 1;
    }
    process.exit();
  });
}

function waitForSocketsToClose(counter: number) {
  if (counter > 0) {
    console.log(
      `Waiting ${counter} more ${
        counter === 1 ? 'seconds' : 'second'
      } for all connections to close...`
    );
    return setTimeout(waitForSocketsToClose, 1000, counter - 1);
  }

  console.log('Forcing all connections to close now');
  Object.keys(sockets).forEach((socketId) => {
    sockets[socketId].destroy();
  });
}
