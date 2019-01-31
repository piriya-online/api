var config = {}

config.port = 112233;

config.mssql = {
    user: 'root',
    password: '1234',
    server: 'localhost',
    database: 'test',
	options: {
        encrypt: true
    }
};

config.url = '//api.domain.com';
config.origin = ['api.domain.com', 'auth.domain.com', 'backend.domain.com', 'www.domain.com', 'domain.com'];

config.crypto = {};
config.crypto.algorithm = 'md5';
config.crypto.password = 'abc1234';

module.exports = config;