#! node
const progarm = require('commander')
const lib = require('./lib.js')


progarm
	.version('1.0.0')

progarm
	.command('url <baseurl>')
	.alias('u')
	.action(async (baseURl, cmd) => {
		console.log(baseURl)
		await lib.setConf(baseURl).then(()=> console.log('设置成功!'))
	})

progarm
	.command(`read <filename>`)
	.alias('r')
	.option('-t, --to <outfilename>','文件类型')
	.action((fileName ,cmd) => {
		lib.fn(fileName,cmd.to)
	})

progarm.parse(process.argv)