/*

monitor bot

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

var TELEGRAM_IDS_ALLOWED_ACCESS=new Set(process.env.TELEGRAM_IDS_ALLOWED_ACCESS_SEPARATED_BY_SEMICOLONS.split(";"));
var ZABBIX_API_ENDPOINT_URL=process.env.ZABBIX_API_ENDPOINT_URL;
var ZABBIX_USERNAME=process.env.BOT_ZABBIX_USERNAME;
var ZABBIX_PASSWORD=process.env.BOT_ZABBIX_PASSWORD;

var request = require('request');

var zabbixApiId=1;
var zabbixAuthString=null;

//example: method="apiinfo.version"
//result: body: {"jsonrpc":"2.0","result":"3.4.13","id":1}
//callback = { onReply: function(json) { console.log(json); } }
function zabbixApi(method, params, bool_use_auth, callback) {
    var url=ZABBIX_API_ENDPOINT_URL;
    /*
        POST http://company.com/zabbix/api_jsonrpc.php HTTP/1.1
        Content-Type: application/json-rpc
 
        {"jsonrpc":"2.0","method":"apiinfo.version","id":1,"auth":null,"params":{}}
    */
    var currentId = zabbixApiId;
    zabbixApiId+=1;
    
    if(!params)params={};
    var post_data_json = {"jsonrpc": "2.0","method": method,"id": currentId, "auth": bool_use_auth?zabbixAuthString:null, "params": params};
    
    const options = {
        url: url,
        body: JSON.stringify(post_data_json),
        headers: {
            'Content-Type': 'application/json-rpc',
            //'Content-Length': Buffer.byteLength(post_data)
        }
    };
    request.post(
        options,
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var replyJson=JSON.parse(body);
                console.log("zabbix api response: method:",method,"response body:", body);
                callback.onReply(replyJson);
            }
            else console.log("A non-success-200 zabbix api response: method:",method,"error:",error,"response:",response,"body:", body);
        }
    );
}

function zabbixAuth() {
    console.log("logging into zabbix...");
    zabbixApi("user.login", {"user":ZABBIX_USERNAME, "password":ZABBIX_PASSWORD}, false, { onReply: function(json) { console.log("zabbix auth replied: ", json); zabbixAuthString=json.result; launch_bot(); } });
}

zabbixAuth();

function accessAllowed(ctx) {
    console.log("check_access ctx.from:", ctx.from);
    if(TELEGRAM_IDS_ALLOWED_ACCESS.has(""+ctx.from.id))return true;
    ctx.reply('Your Telegram id: '+ctx.from.id+". Access denied. Доступ запрещён.\n\nПросите администрацию бота разрешить доступ для Вашего Telegram ID. Ask bot administrators to allow access for your Telegram ID.");
    return false;
}

//callback: {"setString":function(str){...}}
//if str is null: skip host group
/*
Дмитрий Коваленко, [05.07.19 19:52]
в идеале надо
"yunchik_sgminer"          415\1\416
415 машин раюотает одна пролемная всего 416
сообщение что вышлядело так    "yunchik_sgminer"          415\1\416
*/
function formatHostGroup(groupId, groupName, callback) {
    var queriesToPerform=2;
    
    var problemCount=-1;
    
    //total number of hosts in a group
    var hostCount="Unknown";
    var hostCountWithoutProblems="?";
    var hostCountWithProblems="?";
    
    function set() {
        console.log("hostGroup "+groupName+" hg.id="+groupId+" hc="+hostCount);
        //var problemCountFormatted=problemCount==0?"ok":""+problemCount+" problems";
        if(true || hostCount!=0) {
            var totalHostCountInGroup=hostCount;
            callback.setString("\""+groupName+"\"    "+hostCountWithoutProblems+"\\"+hostCountWithProblems+"\\"+totalHostCountInGroup+" — "+problemCount);
        } else callback.setString(null);
    }

    zabbixApi("problem.get", {
        //"output": "extend",
        //"recent": "true",
        "groupids": groupId,
        "countOutput": true        
    }, true, { onReply: function(json) { 
        problemCount=parseInt(json.result);
        
        --queriesToPerform;        
        if(queriesToPerform<=0)set();
    } });

    zabbixApi("host.get", {
        //"output": "extend",
        //"recent": "true",
        "groupids": groupId,
        "countOutput": true        
    }, true, { onReply: function(json) { 
        hostCount=parseInt(json.result);
        
        --queriesToPerform;        
        if(queriesToPerform<=0)set();
    } });
}

function check(ctx) {
    if(!accessAllowed(ctx))return;
    ctx.reply('Querying Zabbix api version and list of host groups...');
    zabbixApi("apiinfo.version", null, false, { onReply: function(json) { ctx.reply("Zabbix api version: "+json.result+""); } });
    zabbixApi("host.get", {
        "countOutput": true        
    }, true, { onReply: function(json) { 
        var hostsCount=parseInt(json.result);
        ctx.reply("total hosts: "+hostsCount);
    } });
    zabbixApi("problem.get", {
        "countOutput": true        
    }, true, { onReply: function(json) { 
        var problemsCount=parseInt(json.result);
        ctx.reply("total problem events: "+problemsCount);
    } });
    zabbixApi("hostgroup.get", {
        "output": ["name","groupid"]
        //,
        //"sortfield": "name"
    }, /*use auth*/true, { onReply: function(json) { 
        var list='"имя группы"    машин работает\\проблемных машин\\всего машин — число событий проблем\n\n';
        
        var hostGroups=json.result;
        
        var groupsReplied=0;
        
        hostGroups.forEach(function(hostGroup) {
            var groupId=hostGroup.groupid;
            var groupName=hostGroup.name;
            formatHostGroup(groupId, groupName, {"setString":function(str){
                if(str)list+=str+"\n";
                ++groupsReplied;
                if(groupsReplied>=hostGroups.length)ctx.reply(list);
            }});
        });
    } });
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

function launch_bot() {
    console.log("connecting to Telegram...");
    const bot = new Telegraf(process.env.BOT_TOKEN, { telegram: { agent: socksAgent } })
    bot.hears('/start', (ctx) => {if(!accessAllowed(ctx))return;ctx.reply('Welcome! Click /help for help.');})
    bot.hears('/help', (ctx) => help(ctx))
    //bot.on('sticker', (ctx) => ctx.reply('👍'))

    bot.hears('ping', (ctx) => on_ping(ctx))
    bot.hears('help', (ctx) => help(ctx))
    bot.hears('check', (ctx) => check(ctx))
    bot.hears('test', (ctx) => test_bot(ctx))
    bot.hears('test bot', (ctx) => test_bot(ctx))

    //bot.command('oldschool', (ctx) => ctx.reply('Hello'))
    //bot.command('modern', ({ reply }) => reply('Yo'))
    //bot.command('hipster', Telegraf.reply('λ'))
    bot.hears('/check', (ctx) => check(ctx))
    bot.hears('/test_bot', (ctx) => test_bot(ctx))
    bot.hears('/ping', (ctx) => on_ping(ctx))
    bot.launch()
    //bot.startPolling()
    console.log("bot started");
}
