import { connect, StringCodec } from "nats";

const port = Number(process.env.NATS_SERVER_PORT_1) ?? 4222;

const connection = {
  port,
};

const sc = StringCodec();

async function main(): Promise<void> {
  const nc = await connect(connection);

  // subscription is an instance of AsyncIterable (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of)
  const subscription = nc.subscribe("hi.>");

  for await (const msg of subscription) {
    console.log(
      `[${subscription.getSubject()}][${msg.subject}]: ${sc.decode(msg.data)}`
    );
  }

  await nc.closed();
}

main();
