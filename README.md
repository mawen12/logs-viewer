# logs-viewer
Logs viewer

## Ret

| 类型 | 格式 | 用途|
| --- | --- | --- |
| `BeginRet` | `A:` | 开始的标识 |
| `EndRet` | `Z:` | 结束的标识 |
| `ErrRet` | `E:<Code>:<Message>` | 脚本执行出错的标识 |
| `DataRet` | `D:<CurNr>:<Message>` | 日志的标识 |
| `StatRet` | `T:<Time>:<Count>` | 日期的记录数统计的标识 |
| `DebugRet` | `N:<Message>` |  debug 的标识 |
| `ExtRet` | `X:<Key>:<Value>` | 扩展信息的标识 |
| `UnkownRet` | `` | 非法格式 | 

## Agent Param

| 类型 |  用途 |
| --- | --- |
| `--index-file` | 创建的索引文件名 |
| `--logfile` | 要搜索的日志文件名称 |
| `--from` | 搜索的开始时间 |
| `--to` | 搜索的结束时间 |
| `--lines-util` |  |
| `--refresh-index` | 刷新索引 |
| `--max-num-lines` | 搜索的最多行数 | 