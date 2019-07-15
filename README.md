# telegram_monitor_bot

## Installation

0. Install nodejs and npm: `sudo apt install npm nodejs`
1. In this dir, run `npm install telegraf socks5-https-client request` 
2. In this dir, create `bot.local.sh` and specify:

```
export BOT_TOKEN="x:y"
export SOCKS5_HOST="example.com"
export SOCKS5_PORT="55555"
export SOCKS5_USERNAME="username"
export SOCKS5_PASSWORD="password"
export TELEGRAM_IDS_ALLOWED_ACCESS_SEPARATED_BY_SEMICOLONS="123;456;012"
export ZABBIX_API_ENDPOINT_URL="http://example.com/zabbix/api_jsonrpc.php"
export BOT_ZABBIX_USERNAME="username"
export BOT_ZABBIX_PASSWORD="password"

#group ids to exclude from report on /check
export HOST_GROUPS_TO_SKIP="12;23;34;100"
```

## Running

`./nohup-run-bot.sh`
