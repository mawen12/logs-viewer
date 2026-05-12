trap 'echo "Z:" 1>&2; echo "Z:"' EXIT

echo 'A:'
echo 'A:' 1>&2

if [[ ! -d /tmp/abc ]]; then
    echo 'E:1:Dir /tmp/abc not exists' 1>&2
    exit 1
fi

rm -rf /tmp/abc
if [ $? -ne 0 ]; then
    echo 'E:1:clean /tmp/abc failed' 1>&2
    exit 1
else 
    echo 'N:clean /tmp/abc success'
fi

return
