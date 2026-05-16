# logs-viewer

A multi host log fetcher and viewer tool.

Inspired by [nerdlog](https://github.com/dimonomid/nerdlog), [VictoriaLogs](https://github.com/VictoriaMetrics/VictoriaLogs) and [pgconn](https://github.com/jackc/pgconn).


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

## 索引

从头开始读取,主要遇到合法的前缀,便开始提取 `YYYY-MM-DD HH:mm` 值,
遇到非合法前缀时,对 `bytenr` 进行累加.当下次再遇到合法前缀时,检查时间
是否相同,如果相同,则对 `bytenr` 进行累加;如果不同,则对之前统计的 
`YYYY-MM-DD  HH:mm` 和 `bytenr` 保存

### 场景

## TODO

`provide parallel mode`
