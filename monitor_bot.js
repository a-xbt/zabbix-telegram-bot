/*

monitor bot

Installation:

npm install telegraf
npm install socks5-https-client

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

var TELEGRAM_IDS_ALLOWED_ACCESS=new Set(process.env.TELEGRAM_IDS_ALLOWED_ACCESS_SEPARATED_BY_SEMICOLONS.split(";"));

function accessAllowed(ctx) {
    console.log("check_access ctx.from:", ctx.from);
    if(TELEGRAM_IDS_ALLOWED_ACCESS.has(""+ctx.from.id))return true;
    ctx.reply('Your Telegram id: '+ctx.from.id+". Access denied. Доступ запрещён.\n\nПросите администрацию бота разрешить доступ для Вашего Telegram ID. Ask bot administrators to allow access for your Telegram ID.");
    return false;
}

function check(ctx) {
    if(!accessAllowed(ctx))return;
    ctx.reply('Checking not implemented yet.');
}

function test_bot(ctx) {
    if(!accessAllowed(ctx))return;
    ctx.reply('Test passed. 👍')
}

function help(ctx) {
    if(!accessAllowed(ctx))return;
    helpString = "";
    helpString += "\n/check         - check health and stats";
    helpString += "\n/test_bot      - test the bot";
    helpString += "\n/ping          - bot ping";
    helpString += "\n/help          - get help";
    helpString += "\ntype: check    - check health and stats";
    helpString += "\ntype: ping     - bot pong";
    helpString += "\ntype: test     - test the bot";
    helpString += "\ntype: help     - to get help";

    ctx.reply(helpString)
}

function on_ping(ctx) {
    if(!accessAllowed(ctx))return;
    ctx.reply('pong')
}

const bot = new Telegraf(process.env.BOT_TOKEN, { telegram: { agent: socksAgent } })
bot.hears('/start', (ctx) => {if(!accessAllowed(ctx))return;ctx.reply('Welcome! Click /help for help.');})
bot.help((ctx) => help(ctx))
//bot.on('sticker', (ctx) => ctx.reply('👍'))

bot.hears('ping', (ctx) => on_ping(ctx))
bot.hears('help', (ctx) => help(ctx))
bot.hears('check', (ctx) => check(ctx))
bot.hears('test', (ctx) => test_bot(ctx))
bot.hears('test bot', (ctx) => test_bot(ctx))

//bot.command('oldschool', (ctx) => ctx.reply('Hello'))
//bot.command('modern', ({ reply }) => reply('Yo'))
//bot.command('hipster', Telegraf.reply('λ'))
bot.command('check', (ctx) => check(ctx))
bot.command('test_bot', (ctx) => test_bot(ctx))
bot.command('ping', (ctx) => on_ping(ctx))
bot.launch()

console.log("bot started");
