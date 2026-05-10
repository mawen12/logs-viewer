import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { useMemo } from "preact/compat";

const rows = [
  {
    id: "1",
    time: "2026-05-06 14:32:33",
    msg: "2026-01-14 14:49:35,189 INFO [main] [] com.github.mawen12.PrometheusSpringBoot3App: Starting PrometheusSpringBoot3App using Java 21.0.2 with PID 614432 (/home/mawen/Documents/github/mawen12/learn-spring-boot/spring-boot3/spring-boot3-prometheus-demo/target/classes started by mawen in /home/mawen/Documents/github/mawen12/learn-spring-boot)",
    stream: "local",
  },
  {
    id: "2",
    time: "2026-05-06 14:32:34",
    msg: '2026-01-14 14:49:35,193 INFO [main] [] com.github.mawen12.PrometheusSpringBoot3App: No active profile set, falling back to 1 default profile: "default"',
    stream: "local",
  },
  {
    id: "3",
    time: "2026-05-06 14:32:35",
    msg: "2026-01-14 14:49:35,859 INFO [main] [] org.springframework.data.repository.config.RepositoryConfigurationDelegate: Multiple Spring Data modules found, entering strict repository configuration mode",
    stream: "local",
  },
  {
    id: "4",
    time: "2026-05-06 14:32:36",
    msg: "2026-01-14 14:49:35,870 INFO [main] [] org.springframework.data.repository.config.RepositoryConfigurationDelegate: Finished Spring Data repository scanning in 4 ms. Found 0 MongoDB repository interfaces.",
    stream: "local",
  },
  {
    id: "5",
    time: "2026-05-06 14:32:37",
    msg: "2026-01-14 14:49:35,883 INFO [main] [] org.springframework.data.repository.config.RepositoryConfigurationDelegate: Multiple Spring Data modules found, entering strict repository configuration mode",
    stream: "local",
  },
  {
    id: "6",
    time: "2026-05-06 14:32:38",
    msg: "2026-01-14 14:49:35,885 INFO [main] [] org.springframework.data.repository.config.RepositoryConfigurationDelegate: Finished Spring Data repository scanning in 1 ms. Found 0 Neo4j repository interfaces.",
    stream: "local",
  },
  {
    id: "7",
    time: "2026-05-06 14:32:39",
    msg: "org.springframework.cloud.context.scope.GenericScope: BeanFactory id=e0aa0200-b60d-37c6-961a-7684990f31a6",
    stream: "local",
  },
  {
    id: "8",
    time: "2026-05-06 14:32:40",
    msg: "org.springframework.cloud.context.scope.GenericScope: BeanFactory id=e0aa0200-b60d-37c6-961a-7684990f31a6",
    stream: "local",
  },
  {
    id: "9",
    time: "2026-05-06 14:32:41",
    msg: "org.springframework.cloud.context.scope.GenericScope: BeanFactory id=e0aa0200-b60d-37c6-961a-7684990f31a6",
    stream: "local",
  },
  {
    id: "10",
    time: "2026-05-06 14:32:42",
    msg: "org.springframework.cloud.context.scope.GenericScope: BeanFactory id=e0aa0200-b60d-37c6-961a-7684990f31a6",
    stream: "local",
  },
  {
    id: "11",
    time: "2026-05-06 14:32:43",
    msg: `org.mongodb.driver.client: MongoClient with metadata {"driver": {"name": "mongo-java-driver|sync|spring-boot", "version": "5.0.1"}, "os": {"type": "Linux", "name": "Linux", "architecture": "amd64", "version": "6.17.12-300.fc43.x86_64"}, "platform": "Java/Oracle Corporation/21.0.2+13-58"} created with settings MongoClientSettings{readPreference=primary, writeConcern=WriteConcern{w=null, wTimeout=null ms, journal=null}, retryWrites=true, retryReads=true, readConcern=ReadConcern{level=null}, credential=null, transportSettings=null, commandListeners=[io.micrometer.core.instrument.binder.mongodb.MongoMetricsCommandListener@7fba492e], codecRegistry=ProvidersCodecRegistry{codecProviders=[ValueCodecProvider{}, BsonValueCodecProvider{}, DBRefCodecProvider{}, DBObjectCodecProvider{}, DocumentCodecProvider{}, CollectionCodecProvider{}, IterableCodecProvider{}, MapCodecProvider{}, GeoJsonCodecProvider{}, GridFSFileCodecProvider{}, Jsr310CodecProvider{}, JsonObjectCodecProvider{}, BsonCodecProvider{}, EnumCodecProvider{}, com.mongodb.client.model.mql.ExpressionCodecProvider@129348e8, com.mongodb.Jep395RecordCodecProvider@20ad64c, com.mongodb.KotlinCodecProvider@39a03ccc]}, loggerSettings=LoggerSettings{maxDocumentLength=1000}, clusterSettings={hosts=[localhost:27017], srvServiceName=mongodb, mode=SINGLE, requiredClusterType=UNKNOWN, requiredReplicaSetName='null', serverSelector='null', clusterListeners='[]', serverSelectionTimeout='30000 ms', localThreshold='15 ms'}, socketSettings=SocketSettings{connectTimeoutMS=10000, readTimeoutMS=0, receiveBufferSize=0, proxySettings=ProxySettings{host=null, port=null, username=null, password=null}}, heartbeatSocketSettings=SocketSettings{connectTimeoutMS=10000, readTimeoutMS=10000, receiveBufferSize=0, proxySettings=ProxySettings{host=null, port=null, username=null, password=null}}, connectionPoolSettings=ConnectionPoolSettings{maxSize=100, minSize=0, maxWaitTimeMS=120000, maxConnectionLifeTimeMS=0, maxConnectionIdleTimeMS=0, maintenanceInitialDelayMS=0, maintenanceFrequencyMS=60000, connectionPoolListeners=[io.micrometer.core.instrument.binder.mongodb.MongoMetricsConnectionPoolListener@48b01607], maxConnecting=2}, serverSettings=ServerSettings{heartbeatFrequencyMS=10000, minHeartbeatFrequencyMS=500, serverListeners='[]', serverMonitorListeners='[]'}, sslSettings=SslSettings{enabled=false, invalidHostNameAllowed=false, context=null}, applicationName='null', compressorList=[], uuidRepresentation=JAVA_LEGACY, serverApi=null, autoEncryptionSettings=null, dnsClient=null, inetAddressResolver=null, contextProvider=null}
2026-01-14 14:49:37,432 INFO [cluster-ClusterId{value='69673c8141fbab3e5625b0cf', description='null'}-localhost:27017] [] org.mongodb.driver.cluster: Monitor thread successfully connected to server with description ServerDescription{address=localhost:27017, type=STANDALONE, state=CONNECTED, ok=true, minWireVersion=0, maxWireVersion=27, maxDocumentSize=16777216, logicalSessionTimeoutMinutes=30, roundTripTimeNanos=33423759}`,
    stream: "local",
  },
];

const LogTableRegion = () => {


    return (
        <TableContainer component={Paper}>
            <Table sx={{ widht: '100%', tableLayout: 'auto' }}>
                <TableHead>
                    <TableRow>
                        <TableCell>_time</TableCell>
                        <TableCell>_msg</TableCell>
                        <TableCell>_stream</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <TableRow key={row.time}>
                            <TableCell component="th" scope="row">
                                {row.time}
                            </TableCell>
                            <TableCell align="right">
                                {row.msg}
                            </TableCell>
                            <TableCell align="right">
                                {row.stream}
                            </TableCell>
                        </TableRow>
                    ))}            
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default LogTableRegion;