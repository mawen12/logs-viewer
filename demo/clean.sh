(
trap 'echo "Z:" 1>&2; echo "Z:"' EXIT

echo 'A:'
echo 'A:' 1>&2

echo 'N:start clean /tmp/552b825d-8701-4ae2-842f-8dc2cccb2718'

cd

if [ ! -d /tmp/552b825d-8701-4ae2-842f-8dc2cccb2718 ]; then
    echo 'E:1:Dir /tmp/552b825d-8701-4ae2-842f-8dc2cccb2718 not exists' 1>&2
    exit 1
fi

rm -rf /tmp/552b825d-8701-4ae2-842f-8dc2cccb2718
if [ $? -ne 0 ]; then
    echo 'E:1:clean /tmp/552b825d-8701-4ae2-842f-8dc2cccb2718 failed' 1>&2
    exit 1
else 
    echo 'N:clean /tmp/552b825d-8701-4ae2-842f-8dc2cccb2718 success'
fi

exit 0
)