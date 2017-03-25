const fs = require('fs')
const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const app = express()

const superagent = require('superagent')
const cheerio = require('cheerio')
const async = require('async')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(cookieParser())
app.use(express.static(path.resolve(__dirname, '../dist')))
app.use(session({
	secret: 'ygcp',
	resave: false,  
    saveUninitialized: true
}))
// 设置跨域访问
app.all('*', (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS")
    res.header("X-Powered-By",' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8")
    next()
})

const getCookie = (username, password, callback) => {
	if(!username || !password) 
		callback(new Error('args error'))
	else
		superagent.post('http://hdu.sunnysport.org.cn/login/')
			.type('form')
			.set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.98 Safari/537.36')
			.send({username: username, password: password})
			.redirects(0)
			.end((err, response) => {
				// if(err) console.log(err)
				let cookie = response.header['set-cookie']
				if(cookie) {
					callback(null, cookie)
				} else {
					callback(new Error('cookie not found'))
				}
			})
}

const getData1 = (cookie, callback) => {
	superagent.get('http://hdu.sunnysport.org.cn/runner/index.html')
		.set('Cookie', cookie)
		.end((err, res) => {
			if(!res.text) {
				callback(new Error('html not found'))
			} else {
				let $ = cheerio.load(res.text)
				let result = {}
				//此处用箭头函数就会报错，因为此时的this不是回调中的遍历对象
				let datas = $('label, td').map(function(){
					return $(this).text()
				})
				let info = [].filter.call(datas, function(data) { return !!data });//此处必须要有分号
				([, result.name, result.num_school, result.sex, , result.course, result.teacher
					, , , result.total_mileage, , result.average_speed, , result.num_effective
					, , , result.group, , result.min_speed, , result.min_mileage
					, , , result.reward, , result.punish, , result.finnal 
				] = info)
				callback(null, result)
			}
		})
}

app.get('/', (req, res) => {
  const html = fs.readFileSync(resolve('../dist/index.html'), 'utf-8')
  res.send(html)
})

app.post('/api/login', (req, res) => {
	async.waterfall([
			callback => {
				getCookie(req.body.username, req.body.password, (err, cookie) => {
					callback(err, cookie)
				})
			},
			(cookie, callback) => {
				// 登陆者存储cookie便于浏览其它内容
				req.session.cookie = cookie
				req.session.deadline = Date.now() + 86400
				getData1(cookie, (err, result) => {
					callback(err, result)
				})
			}
		], (err, result) => {
			if(err) {
				res.send(JSON.stringify({
					status: '403'
				}))
			} else {
				res.send(JSON.stringify({
					status: '200',
					data: result
				}))
			}
		})
})

app.get('/api/search', (req, res) => {
	async.waterfall([
			callback => {
				getCookie(req.query.number, req.query.number, (err, cookie) => {
					callback(err, cookie)
				})
			},
			(cookie, callback) => {
				getData1(cookie, (err, result) => {
					callback(err, result)
				})
			}
		], (err, result) => {
			if(err) {
				res.send(JSON.stringify({
					status: '403',
					msg: '对方可能修改过初始密码'
				}))
			} else {
				res.send(JSON.stringify({
					status: '200',
					data: result
				}))
			}
		})
})

app.listen(3000, () => {
	console.log('正在监听端口：3000')
})