/**
 * 파일 업로드
 * 
 * 
 * @date 2023-10-25
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

// 기본 속성 설정
app.set('port', process.env.PORT || 3000);

// body-parser를 이용해 application/x-form-urlencoded 파싱
app.use(bodyParser.urlencoded({ extended: false}));

// body-parser를 이용해 application/json 파싱
app.use(bodyParser.json());

// public 폴더와 uploads 폴더 지정
app.use('/public', static(path.join(__dirname,'public')));
app.use('/uploads', static(path.join(__dirname,'uploads')));

// cookie-parser 설정
app.use(cookieParser());

// 세션 설정
app.use(expressSession({
    secret: process.env.SECRET || 'secret11',
    resave: true,
    saveUninitialized: true
}))

// CORS 설정
app.use(cors());

// multer 미들웨어 사용 : 사용순서 중요 body-parser -> multer -> router
// 파일 제한 : 10개 1G
let storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null,'uploads');
    },
    filename: function(req, file, callback) {
        callback(null, file.originalname + Date.now());
    }
})

let upload = multer({
    storage: storage,
    limits: {
        files: 10,
        fieldSize: 1024 * 1024 * 1024
    }
})

// 라우터 사용하여 라우팅 함수 등록
const router = express.Router();

router.route('/process/photo')
    .post(upload.array('photo',1), (req, res)=> {
        console.log('/process/photo 호출');

        try {
            let files = req.files;

            console.dir('#===== 업로드된 첫번째 파일 정보 =====#')
            console.dir(req.files[0]);
            console.dir('#=====#')

            // 현재 파일 저옵를 저장할 변수 선언

            let originalname = ''
                , filename = ''
                , mimetype = ''
                , size = 0;

            if (Array.isArray(files)) {
                
                console.log(`배열에 들어있는 파일 개수 ${files.length}`)

                for ( var index = 0; index < files.length; index ++) {
                    originalname = files[index].originalname;
                    filename = files[index].filename;
                    mimetype = files[index].mimetype;
                    size = files[index].size;
                }

            } else { // 배열에 들어가 있지 않은 경우
                console.log('파일 개수 : 1')

                originalname = files[index].originalname;
                filename = files[index].filename;
                mimetype = files[index].mimetype;
                size = files[index].size;
            }
            console.log(`현재 파일 정보 : ${originalname, filename, mimetype, size}`);
            
            // 클라이언트에 응답전송
            res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
            res.write('<h3>파일 업로드 성공</h3>');
            res.write('<hr/>');
            res.write(`<p>원본 파일명: ${originalname} => 저장 파일명: ${filename}</p>`);
            res.write(`<p>MIME TYPE :${mimetype}</p>`);
            res.write(`<p>파일 크기: ${size}</p>`)
            res.end();

        } catch (error) { 
            
            console.dir(err.stack)
        }
    })
app.use('/',router);

const errorHandler = expressErrorHandler({
    static: {
        '404': './public/404.html'
    }
})

app.use( expressErrorHandler.httpError(404));
app.use( errorHandler );

// Expresss 서버 시작
http.createServer(app).listen(app.get('port'), function() {
    console.log(`Express Server listening on port ${app.get('port')}`);
})