module.exports = {
    app_name:"nanyuan",
    port: 3102,
    ipAddress: "127.0.0.1",
    host: "127.0.0.1:3102",
    appid: "",
    appsecret: "",
    token: "",
    encodingAESKey: "",
    emergencyMessageTemplate: "",
    mysql: {
        host: "127.0.0.1",
        port: "3306",
        user: "root",
        password: "",
        database: "nanyuan",
        connectionLimit: 50
    },
    redis: {
        host: "127.0.0.1",
        port: "6379",
        session:11,
        cache: 12,
        password: ""
    }
}