import { connect, StringCodec } from "nats";

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
    nc.publish(`hi.${++i}`, sc.encode(`Message number ${i}`))
    console.log(`Message number ${i}`)
  }, interval)

  await nc.closed();
}

main()