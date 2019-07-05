# telegram_monitor_bot

## Installation

0. Install nodejs and npm: `sudo apt install npm nodejs`
1. In this dir, run `npm install telegraf socks5-https-client` 

For Ubuntu 16.04.x: `npm install telegraf@0.6.3 socks5-https-client@1.1.3`

For Ubuntu 16.04.x: `npm WARN deprecated minimatch@0.3.0: Please update to minimatch 3.0.2 or higher to avoid a RegExp DoS issue`

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