# Search

`Search` 是用于从目标日志中检索。

## 逻辑

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