const mongoose = require('mongoose');

let database = {};

database.init = function(app, config) {
    console.log(`init() 호출됨`);

    connect(app, config);
}

function connect(app, config) {
    console.log(`connect() 호출됨`);
    
    // mongoose의 Promise 객체는 global의 Promise 객체 사용하도록 함
    mongoose.Promise = global.Promise
    mongoose.connect(config.db_url);
    database.db = mongoose.connect;

    database.db.on('error', console.error.bind(console, 'mongoose error'));
    database.db.on('open', function() {
        console.log(`데이터 베이스에 연결되었습니다. ${config.db_url}`);

        createSchema(app, config);
    })
    database.db.on('disconnected', connect);

}

function createSchema(app, config) {
    const schemaLen = config.db_schemas.length;

    for (var i = 0; i < schemaLen; i++) {
        let curItem = config.db_schemas[i];

        let curSchema = require(curItem.file).createSchema(mongoose);
        console.log(`${curItem.file} 모듈을 불러들인 후 스키마 정의`);

        let curModel = mongoose.model(curItem.collection, curSchema);
        console.log(`${curItem.collection} 컬렉션을 위해 모델 정의함`)

        database[curItem.schemaName] = curSchema;
        database[curItem.modelName] = curModel;

    }

    app.set('database', database);    
}

module.exports = database;