cd /home/toxa/git/telegram_monitor_bot/
date >> /home/toxa/git/telegram_monitor_bot/send.log
echo sending >> /home/toxa/git/telegram_monitor_bot/send.log
echo "sudo -u toxa -n -i /bin/bash /home/toxa/git/telegram_monitor_bot/send_alert.sh $1 $2 $3" >> /home/toxa/git/telegram_monitor_bot/send.log
#export PARAM1="$1"
#export PARAM2="$2"
#export PARAM3="$3"
sudo -u toxa -n -i PARAM1="$1" PARAM2="$2" PARAM3="$3" /bin/bash /home/toxa/git/telegram_monitor_bot/send_alert.sh >> /home/toxa/git/telegram_monitor_bot/send.log 2>&1
echo sudo exitcode $?
exit $?
