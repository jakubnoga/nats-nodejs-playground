import { connect, Status, StringCodec, Subscription } from 'nats';

const port = Number(process.env.NATS_SERVER_PORT_1) ?? 4222;

const connection = {
  port,
};

const sc = StringCodec();
const delay = 2500;

async function main(): Promise<void> {
  const nc = await connect(connection);
  processStatuses(nc.status());

  // subscription is an instance of AsyncIterable (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of)
  processSubscription(nc.subscribe('hi.>'))

  await nc.closed();
}

async function processSubscription(subscription: Subscription) {
  for await (const msg of subscription) {
    // simulate slow message processing
    await new Promise((resolve) => setTimeout(resolve, delay));

    console.log(
      `[MESSAGE]: [${subscription.getSubject()}][${msg.subject}]: ${sc.decode(
        msg.data
      )} (pending: ${subscription.getPending()})`
    );
  }
}

async function processStatuses(events: AsyncIterable<Status>) {
  for await (const status of events) {
    console.log(`[EVENT]: (${status.type})`, status.data);
  }
}

main();
