var threads_log = require('why-is-node-running')

function dumpThreads() {
   console.log("threads log for send_alert.js");
   threads_log(); // logs out active handles that are keeping node running
}

var thread_dumps_loop = setTimeout(dumpThreads, 5*60*1000);


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

var alerts_enabled = true;

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

function whenFetchedConfigs() {
  if(alerts_enabled) launch_bot();
  else {console.log("alerts are disabled; exiting");}
  clearTimeout(thread_dumps_loop);
  dumpThreads();
}

// read_persistent_state_snippet.js

'use strict';

const BOT_STATE_PERSISTENT_JSON_FILENAME="bot.state.persistent.json";

const fs = require('fs');

var botStatePersistentJson = {};

console.log("reading persistent state…");

fs.readFile(BOT_STATE_PERSISTENT_JSON_FILENAME, (err, data) => {
    if (err) { console.log('persistent state file not found or error (ignored):', err); }
    if(data)botStatePersistentJson = JSON.parse(data);
    console.log('bot state persistent json:',BOT_STATE_PERSISTENT_JSON_FILENAME,'content=',botStatePersistentJson);
    alerts_enabled=botStatePersistentJson.alerts_enabled;

    whenFetchedConfigs();    
});


