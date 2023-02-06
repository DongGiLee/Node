/**
 * 실습환경 초기화
 * 
 * 
 * @date 2023-03-03
 * @author donggi
 */

// Express 기본 모듈 불러오기
const express = require('express')
    , http = require('http')
    , path = require('path');

// Express의 미들웨어 불러오기
const bodyParser = require('body-parser')
    , cookieParser = require('cookie-parser')
    , static = require('serve-static')
    , errorHandler = require('errorhandler')


// 에러핸들러 모듈 사용
const expressErrorHandler = require('express-error-handler');

// Session 미들웨어 불러오기
const expressSession = require('express-session');

// Passport 사용
var passport = require('passport');
var flash = require('connect-flash');

var config = require('./config');

var database = require('./database/database');

var route_loader = require('./routes/route_loader');

let app = express();

app.set('views',__dirname+'/views');
app.set('view engins','ejs');

app.set('port', process.env.PORT || 3000);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/public', static(path.join(__dirname, 'public')));

app.use(cookieParser());

app.use(expressSession({
	secret:'my key',
	resave:true,
	saveUninitialized:true
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());