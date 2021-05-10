module.exports = {
    sessionName: "SID",
    hostname: "localhost",
    port: 8080,
    db: {
        host: 'localhost',
        name: 'socnet',
        port: 27017,
        user: 'socnet',
        password: 'socnet',
    },

    // first test 
    badPasswordAttemptsInterval: 30,
    badPasswordAttempts: 3,
    // first test blocation range <15, 35>
    IPAddressBannedMin: 15,
    IPAddressBannedRange: 20,


    // second test
    loginInterval: 10,
    maxLoginsInInterval: 5,
    // second test blocation range <10, 30>
    loginIntervalBannedMin: 10,
    loginIntervalBannedRange: 20,


    loadBehaviourPatternsDays: 10,
}