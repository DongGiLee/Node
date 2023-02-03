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
    

// 에러핸들러 모듈 사용
const expressErrorHandler = require('express-error-handler');

// Session 미들웨어 불러오기
const expressSession = require('express-session');

// 파일 업로드용 미들웨어
const multer = require('multer');
const fs = require('fs');

// 클라이언트에서 ajax로 요청시 CORS 지원, (다중서버 접속)
const cors = require('cors');

let app = express();