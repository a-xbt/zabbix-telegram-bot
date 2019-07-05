# telegram_monitor_bot

## Installation

1. In this dir, run `npm install telegraf socks5-https-client` 
2. In this dir, create `bot.local.sh` and specify:

```
export BOT_TOKEN="x:y"
export SOCKS5_HOST="example.com"
export SOCKS5_PORT="55555"
export SOCKS5_USERNAME="username"
export SOCKS5_PASSWORD="password"
export TELEGRAM_IDS_ALLOWED_ACCESS_SEPARATED_BY_SEMICOLONS="123;rem_456;rem_789"
```

## Running

`./monitor_bot.sh`