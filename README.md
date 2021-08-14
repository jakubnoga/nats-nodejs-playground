# nats-nodejs-playground
Strongly inspired by [how-to-nats](https://github.com/gitarte/how-to-nats)

I skipped implementation of `cluster-publisher` and `cluster-subscriber` as it only adds printing events to stdout, which is already implemented in other examples.
# Nats setup
## Docker
```bash
docker run -p 4222:4222 -ti nats:latest
```

## Windows binary distribution
### Download and unpack binary
```powershell
Invoke-WebRequest -Uri "https://github.com/nats-io/nats-server/releases/download/v2.3.4/nats-server-v2.3.4-windows-amd64.zip" -OutFile "nats-server-v2.3.4-windows-amd64.zip"
Expand-Archive .\nats-server-v2.3.4-windows-amd64.zip -DestinationPath .\ 
```

### Run single instance
```powershell
.\nats-server.exe -p 4222
```

### Run cluster
```powershell
.\nats-server -p 4222 -cluster nats://localhost:4248 
.\nats-server -p 5222 -cluster nats://localhost:5248 -routes nats://localhost:4248 
.\nats-server -p 6222 -cluster nats://localhost:6248 -routes nats://localhost:4248 
```

# Run examples
```powershell
npm i

# npm run start -- <script-path>
# i.e.
npm run start -- ./src/publisher.ts
```