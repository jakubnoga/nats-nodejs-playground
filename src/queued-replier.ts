import { connect, Status, StringCodec, Subscription } from 'nats';

const port = Number(process.env.NATS_SERVER_PORT_1) ?? 4222;

const connection = {
  port,
};

const sc = StringCodec();

async function main(): Promise<void> {
  const nc = await connect(connection);
  processStatuses(nc.status());

  // subscription is an instance of AsyncIterable (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of)
  processSubscription(nc.subscribe('requests.>', {
    queue: "GOLEJGA:---D"
  }));

  await nc.closed();
}

async function processSubscription(subscription: Subscription) {
  for await (const msg of subscription) {
    const value = sc.decode(msg.data);
    console.log(
      `[REQUEST]: [${subscription.getSubject()}][${msg.subject}]: ${value}`
    );

    msg.respond(sc.encode('' + Math.pow(Number(value), 2)));
  }
}

async function processStatuses(events: AsyncIterable<Status>) {
  for await (const status of events) {
    console.log(`[EVENT]: (${status.type})`, status.data);
  }
}

main();

