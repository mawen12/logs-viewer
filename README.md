# logs-viewer
Logs viewer

## Ret

| 类型 | 格式 | 用途|
| --- | --- | --- |
| `BeginRet` | `A:` | 开始的标识 |
| `EndRet` | `Z:` | 结束的标识 |
| `ErrRet` | `E:<Code>:<Message>` | 脚本执行出错的标识 |
| `DataRet` | `D:<CurNr>:<Message>` | 日志的标识 |
| `DebugRet` | `N:<Message>` |  debug 的标识 |
| `ExtRet` | `X:<Key>:<Value>` | 扩展信息的标识 |