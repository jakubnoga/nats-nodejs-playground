import { connect, ErrorCode, Msg, NatsError, StringCodec } from 'nats';

const port = Number(process.env.NATS_SERVER_PORT_1) ?? 4222;

const connection = {
  port,
};

const sc = StringCodec();
const interval = 1000;

async function main(): Promise<void> {
  const nc = await connect(connection);
  let i = -1;

  setInterval(() => {
    i++;
    const message = String(i);
    console.log(`[REQUEST]: ${message}`);
    const subject = `requests.${i}`;
    nc.request(subject, sc.encode(message))
      .then(processResponse)
      .catch(processError);
  }, interval);

  await nc.closed();
}

function processResponse(msg: Msg) {
  console.log(`[REPLY]: [${msg.subject}]: ${sc.decode(msg.data)}`);
}

function processError(err: NatsError) {
  console.log(`[ERROR][${err.name} ${err.code}]: ${err.message}`);
}

main();
