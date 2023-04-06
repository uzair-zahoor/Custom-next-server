const { createServer } = require('http')
const next = require('next')
const express = require('express')
const { ApolloServer } = require('@apollo/server')
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer')
const { makeExecutableSchema } = require('@graphql-tools/schema')
const { WebSocketServer } = require('ws')
const { useServer } = require('graphql-ws/lib/use/ws')
const {expressMiddleware}= require('@apollo/server/express4');
const cors = require('cors')
const bodyParser = require('body-parser')
const connectDB = require('./connectDB')
const { typeDefs } = require('./typeDefs')
const { resolvers } = require('./resolvers')
const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = 3004
const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()
async function startServer() {
  await connectDB()
  const expressApp = express()
  const httpServer = createServer(expressApp);

  const schema = makeExecutableSchema({
    typeDefs,
    resolvers
  })
  const apolloServer = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose()
            },
          }
        },
      },
    ],
  })
  const wsServer = new WebSocketServer({ server: httpServer, path: '/graphql' })
  const serverCleanup = useServer({ schema }, wsServer)
  await apolloServer.start()
  const jsonParser = bodyParser.json()
  expressApp.use(cors())
  expressApp.use('/graphql', cors(), jsonParser, expressMiddleware(apolloServer));
  expressApp.get("*", (req, res) => {
    return handle(req, res);
  });
  httpServer.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`)
  })
}
app.prepare().then(startServer)
