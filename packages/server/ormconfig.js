module.exports = {
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'codeql',
    password: 'codeql',
    database: 'codeql',
    entities: ['src/entity/*.js'],
    logging: true,
    synchronize: true,
};