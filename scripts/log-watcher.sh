echo "set your browser to http://${HOSTNAME}:28778/ to watch logs"
echo "NOTE: This does not add new logs in real time,"
echo "so if new nodes start up you will have to restart this."
confFile=${HOME}/.log.io/harvester.conf
echo "exports.config = {" > ${confFile}
echo "  nodeName: \"application_server\"," >> ${confFile}
echo "  logStreams: {" >> ${confFile}
firstLine=true
for i in $(ls ${HOME}/.ros/log)
do
    logFolder=${i}
    for j in $(ls ${HOME}/.ros/log/${logFolder})
    do
        logName=$(echo ${j}|sed 's/.log//')
        if [ "${firstLine}" = false ]
        then
            echo "  ]," >> ${confFile}
        fi
        firstLine=false
        echo "  \"${logName}\": [" >> ${confFile}
        echo "    \"${HOME}/.ros/log/${logFolder}/${j}\"" >> ${confFile}
    done
done
if [ -f /tmp/arloBehavior.log ]
    then
echo "  ]," >> ${confFile}
    echo "\"behavior-log\": [\"/tmp/arloBehavior.log\"]" >> ${confFile}
else
echo "  ]" >> ${confFile}
fi
echo "}," >> ${confFile}
echo "server: {" >> ${confFile}
echo "    host: '0.0.0.0'," >> ${confFile}
echo "        port: 28777" >> ${confFile}
echo "  }" >> ${confFile}
echo "}" >> ${confFile}
#cat ${confFile}
log.io-server &
log.io-harvester &
echo "To Stop log server run:"
echo "pkill -f log.io"
echo "Or kill_ros.sh also stops this."
