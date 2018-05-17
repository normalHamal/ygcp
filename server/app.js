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
//todo：应该设置cookie失效时间为一天(因为要爬取的网站cookie失效也是一天，而我们把登录返回的cookie保存在自己的session中)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
//与session中的一致
app.use(cookieParser())
app.use(express.static(path.resolve(__dirname, '../dist')))
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: 'ygcp',
  key: 'ygcp',
  cookie: { maxAge:1000*60*60*24*30 }
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

const getCookie = (username, password, vrf, cookie, callback) => {
	if(!username || !password) 
		callback(new Error('args error'))
	else
		superagent.post('http://hdu.sunnysport.org.cn/login/')
			.type('form')
			.set('Cookie', cookie)
			.set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.98 Safari/537.36')
			.send({username, password, vrf})
			.redirects(0)
			.end((err, res) => {
				// if(err) console.log(err)
				let cookie = res.header['set-cookie']
				if(cookie) {
					callback(null, cookie)
				} else {
					callback(new Error('cookie not found'))
				}
			})
}

const getData1 = (cookie, callback) => {
	superagent.get('http://hdu.sunnysport.org.cn/runner/index.html')
		.set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.98 Safari/537.36')
		.set('Cookie', cookie)
		.end((err, res) => {
			if(!res.text) {
				callback(new Error('html not found'))
			} else {
				let $ = cheerio.load(res.text)
				let result = {}
				//此处用箭头函数就会报错，因为此时的this不是回调中的遍历对象
				var datas = []
				$('label, td').each(function() {
					datas.push($(this).text())
				});
				
				([, result.name, result.num_school, result.sex, , result.course, result.teacher
					, , , , ,result.total_mileage, , result.average_speed, , result.num_effective
					, , , result.group, , result.min_speed, , result.min_mileage
					, , , result.reward, , result.punish, , result.finnal 
				] = datas)

				callback(null, result)
			}
		})
}

const getData2 = (cookie, callback) => {
	superagent.get('http://hdu.sunnysport.org.cn/runner/achievements.html')
		.set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.98 Safari/537.36')
		.set('Cookie', cookie)
		.end((err, res) => {
			if(err) {
				callback(new Error('html not found'))
			} else {
				let $ = cheerio.load(res.text)
				let results = []
				$('.table tr').each(function(i) {
					if(i > 0) {
						let record = {}
						record.date = $(this).find('td').eq(1).text()
						record.time = $(this).find('td').eq(2).text()
						record.mileage = $(this).find('td').eq(3).text()
						record.speed = $(this).find('td').eq(4).text()
						record.effective = $(this).find('td span').eq(0).hasClass('glyphicon glyphicon-ok')
						results.push(record)
					}
				})
				callback(null, results)
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
				superagent.get('http://hdu.sunnysport.org.cn/runner/achievements.html')
					.set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.98 Safari/537.36')
					.end((err, res) => {
						let $ = cheerio.load(res.text)
						getCookie(req.body.username, req.body.password, $("input[type=hidden]").val(), res.header['set-cookie'], (err, cookie) => {
							callback(err, cookie)
						})
					})
			},
			(cookie, callback) => {
				// 登陆者存储cookie便于浏览其它内容
				req.session.auth = cookie
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

app.get('/api/detail', (req, res) => {
	if(req.session.auth) {
		getData2(req.session.auth, (err, results) => {
			if(err) {
				res.send(JSON.stringify({
					status: '401',
					msg: '请重新登录'
				}))
			} else {
				res.send(JSON.stringify({
					status: '200',
					data: results
				}))
			}
		})
	} else {
		res.send(JSON.stringify({
			status: '401',
			msg: '请重新登录'
		}))
	}
})

app.listen(3000, () => {
	console.log('正在监听端口：3000')
})