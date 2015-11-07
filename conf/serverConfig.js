module.exports = {
    port: 3102,
    ipAddress: "192.168.1.24",
    host: "192.168.1.24:3102",
    appname: "nanyuan",
    appid: "",
    appsecret: "",
    token: "",
    encodingAESKey: "",
    emergencyMessageTemplate: "",
    db: {
        host: "localhost",
        port: "3306",
        user: "root",
        password: "",
        database: "nanyuan",
        connectionLimit: 50
    },
    redis: {
        host: "127.0.0.1",
        port: "6379",
        db: 8,
        password: ""
    },
    redisCache: {
        host: "127.0.0.1",
        port: "6379",
        db: 9,
        password: ""
    }
}