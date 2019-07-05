#export BOT_TOKEN="x:y"
#export SOCKS5_HOST="host.com"
#export SOCKS5_PORT="55555"
#export SOCKS5_USERNAME="username"
#export SOCKS5_PASSWORD="password"
#export TELEGRAM_IDS_ALLOWED_ACCESS_SEPARATED_BY_SEMICOLONS="143909428;rem_456;rem_789"
source ./bot.local.sh
node ./monitor_bot.js
