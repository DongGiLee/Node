const crypto = require('crypto');

let Schema = {};

Schema.createSchema = function(mongoose) {

    let UserSchema = mongoose.Schema({
        email: {type: String, 'default':''},
        hashed_password: {type: String, required: true, 'default': ''},
        name: {type: String, index: 'hashed', 'default':''},
        salt: {type: String, required: true},
        create_at: {type: Date, index: {unique: false}, 'default': Date.now},
        update_at: {type: Date, index: {unique: false}, 'default': Date.now}

    })

    UserSchema
       .virtual('password')
       .set(function(password) {
        this._password = password;
        this.salt = this.makeSalt();
        this.hashed_password = this.encryptPassword(password);
        console.log(`virtual password 호출됨 ${this.hashed_password}`)
       })
       .get(function() { return this._password});

    UserSchema.method('encryptPassword', function(plainText, inSalt) {
        if (inSalt) {
            return crypto.createHmac('sha1',inSalt).update(plainText).digest('hex');
        } else {
            return crypto.createHmac('sha1',this.salt).update(plainText).digest('hex');
        }
    })

    UserSchema.method('makeSalt', function() {
        return Math.rount(new Date().valueOf() * Math.random()) +'';
    })

    UserSchema.method('authenticate', function(plainText, inSalt, hashed_password) {
        if (inSalt) {
            console.log(`authenticate 호출됨 ${plainText} -> ${this.encryptPassword(plainText, inSalt)} : ${hashed_password}}`);
            return this.encryptPassword(plainText, inSalt) === hashed_password;
        } else {
            console.log('authenticate 호출됨 : %s -> %s : %s', plainText, this.encryptPassword(plainText), this.hashed_password);
            return this.encryptPassword(plainText) === this.hashed_password;
        }
    })

    let validatePresenceOf = function(value) {
        return value && value.length;
    }

    UserSchema.pre('save', function(next) {
        if (!this.isNew) return next();

        if (!validatePresenceOf(this.password)) {
            next(new Error('유효하지 않은 password 필드입니다.'));
        } else {
            next();
        }
    })

    UserSchema.path('email').validate(function (email) {
        return email.length;
    }, 'email 칼럼의 값이 없습니다.');

    UserSchema.path('hashed_password').validate(function (hashed_password) {
        return hashed_password.length
    }, 'hashed_password 칼럼의 값이 없습니다.');

    UserSchema.static('findByEmail', function(email, callback) {
        return this.find({email: email}, callback);
    })

    UserSchema.static('findAll', function(callback) {
        return this.find({},callback);
    })

    console.log(`User Schema 정의함`);
    
    return UserSchema;
}

module.exports = Schema;