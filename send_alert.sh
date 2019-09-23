#!/bin/bash

cd /home/toxa/git/telegram_monitor_bot/

echo "whoami: " `whoami`
echo "pwd: " `pwd`
echo "dollar0: " "$0"
echo "NVM_DIR: " "$NVM_DIR"
echo "dollarHOME: " "$HOME"

echo 1 2 3 : "$1" "$2" "$3"

source $NVM_DIR/nvm.sh

nvm use v8.8.0

#echo nvm ls:
#nvm ls

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


export TO="$1"
export SUBJECT="$2"
export MESSAGE="$3"
 
echo "Running nodejs"
node ./send_alert.js
echo "nodejs exited, exitcode:" $?
exit $?