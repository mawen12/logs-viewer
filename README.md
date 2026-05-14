# logs-viewer
Logs viewer

## Windows support

https://go.dev/wiki/Windows

更换 go 版本
```bash
export GOROOT=/opt/go/go-1.20
export GOPATH=$HOME/go
export PATH=$GOROOT/bin:$GOPATH/bin:$PATH

go mod tidy
```

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

## 索引

从头开始读取,主要遇到合法的前缀,便开始提取 `YYYY-MM-DD HH:mm` 值,
遇到非合法前缀时,对 `bytenr` 进行累加.当下次再遇到合法前缀时,检查时间
是否相同,如果相同,则对 `bytenr` 进行累加;如果不同,则对之前统计的 
`YYYY-MM-DD  HH:mm` 和 `bytenr` 保存

### 场景

## 检索

### 场景

- 一行日志
    - 满足
    - 不满足
- 多行日志
    - 不满足
    - 部分满足
        - 开头满足
        - 中间满足
    - 全部满足
        - 开头+中间满足  

只要遇到合法的前缀,便开始使用 `currentLog = $0` 记录,此处初始化 `isMatch = false`.
遇到非合法的前缀时,对 `currentLog +=`,将记录加入进来
当发现匹配到 `pattern` 时,便设置 `isMatch = true`.
下次迭代时,再遇到合法前缀时,检查 `isMatch == true`,如果时的话,将 `currentLog` 保存;否则丢弃 `currentLog` 保存的内容,且重置 `currentLog = $0, isMatch = false`.

```
{
   if (isValidPrefix) {
    if (isMatch == true) {
        // save currentlog
    }

        currentLog = $0;
        isMatch = false
   } else {
        append currentLog 
   } 

   pattern check

   {
        isMatch = true
   }

   line check 

   {

   }

   END {
    if (currentLog != "" && isMatch == true) {
        // save currentLog
    }

   }
}
```