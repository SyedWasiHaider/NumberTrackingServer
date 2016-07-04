#!/bin/bash

PID=`ps -eaf | grep forever | grep -v grep | awk '{print $2}'`
if [[ "" !=  "$PID" ]]; then
echo "killing $PID"
kill  $PID
fi
sudo kill $(sudo lsof -t -i:5000)
