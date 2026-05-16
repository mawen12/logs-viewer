# Ret

| 类型 | 格式 | 用途|
| --- | --- | --- |
| `BeginRet` | `A:` | 开始标识 |
| `EndRet` | `Z:` | 结束标识 |
| `ErrRet` | `E:<Code>:<Message>` | 执行出错标识 |
| `DataRet` | `D:<CurNr>:<Message>` | 日志标识 |
| `StatRet` | `T:<Time>:<Count>` | 日期的记录数统计标识 |
| `DebugRet` | `N:<Message>` |  debug 标识 |
| `ExtRet` | `X:<Key>:<Value>` | 扩展信息标识 |
| `UnkownRet` | `` | 未知格式标识 | 