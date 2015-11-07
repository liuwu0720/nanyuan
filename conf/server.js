module.exports = {
    app_name:"nanyuan",
    port: 3102,
    ipAddress: "192.168.1.24",
    host: "192.168.1.24:3102",
    appname: "nanyuan",
    appid: "",
    appsecret: "",
    token: "",
    encodingAESKey: "",
    emergencyMessageTemplate: "",
    mysql: {
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
        session:11,
        cache: 12,
        password: ""
    }
}