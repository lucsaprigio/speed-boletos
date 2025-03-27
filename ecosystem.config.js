module.exports = {
    app: [
        {
            name: "boleto-speed",
            script: "npm",
            args: "start",
            env: {
                PORT: 3001,
                NODE_ENV: "production",
            }
        }
    ]
}