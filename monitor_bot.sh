#!/bin/bash


#export BOT_TOKEN="x:y"
#export SOCKS5_HOST="host.com"
#export SOCKS5_PORT="55555"
#export SOCKS5_USERNAME="username"
#export SOCKS5_PASSWORD="password"
#export TELEGRAM_IDS_ALLOWED_ACCESS_SEPARATED_BY_SEMICOLONS="143909428;rem_456;rem_789"
#export ZABBIX_API_ENDPOINT_URL="http://company.com/zabbix/api_jsonrpc.php"
#export BOT_ZABBIX_USERNAME="username"
#export BOT_ZABBIX_PASSWORD="password"
source ./bot.local.sh


while true
do
	echo "Press [CTRL+C] to stop... Running nodejs"
	node ./monitor_bot.js
	echo "nodejs exited, exitcode:" $?
	echo sleeping 1 sec...
	sleep 1
done

