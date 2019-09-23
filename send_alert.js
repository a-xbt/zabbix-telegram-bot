var threads_log = require('why-is-node-running')
setTimeout(function () {
   console.log("threads log for send_alert.js");
   threads_log(); // logs out active handles that are keeping node running
}, 5*60*1000)



/*

send alert bot

Installation:

npm install telegraf socks5-https-client request

*/
console.log("bot starting");


const Telegraf = require('telegraf')
const SocksAgent = require('socks5-https-client/lib/Agent');
const socksAgent = new SocksAgent({
    socksHost: process.env.SOCKS5_HOST,
    socksPort: process.env.SOCKS5_PORT,
    socksUsername: process.env.SOCKS5_USERNAME,
    socksPassword: process.env.SOCKS5_PASSWORD,
});

var TELEGRAM_IDS_TO_NOTIFY = new Set(process.env.TELEGRAM_IDS_ALLOWED_ACCESS_SEPARATED_BY_SEMICOLONS.split(";"));
var TO=process.env.TO;
var SUBJECT=process.env.SUBJECT;
var MESSAGE=process.env.MESSAGE;

function launch_bot() {
    console.log("connecting to Telegram...");
    const bot = new Telegraf(process.env.BOT_TOKEN, { telegram: { agent: socksAgent } })
    console.log("bot started");

    function sendNotification(id) {
        bot.telegram.sendMessage(id, "Zabbix alert: "+SUBJECT+"\n\n"+MESSAGE);
    }

    //bot.launch()
    console.log("sending msg");
    
    TELEGRAM_IDS_TO_NOTIFY.forEach(function(id) { sendNotification(id); });
    //sendNotification(""+143909428);//to egph
    
    console.log("sent msg, stopping bot...");
    bot.stop()
    //bot.startPolling()
    console.log("bot exiting");
}

launch_bot();
