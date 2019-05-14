const fs = require('fs-extra');
const path = require('path');


const CONFIGJSON = "config.json"

const CONFIGJSONPATH = path.resolve(__dirname, CONFIGJSON);

const isExistFile = (pathname) => {
	try {
		return fs.statSync(pathname).isFile();
	} catch (err) {
		return false
	}
}

const format = (ary,baseurl = 'baseurl') => {
	return ary.reduce((old,item,i)=>{
		old += `${item.plateNumber} ${item.mobile}\r\n${baseurl}&id=${item.groupbuyId}&groupId=${item.groupId}&fromUser=${item.accountId}\r\n\r\n\r\n`
		return old
	},'')
}

const config = () => {
	if(!isExistFile(CONFIGJSONPATH)){
		throw new Error(`config文件 不存在!`)
		return
	}
	return fs.readJson(CONFIGJSONPATH)
}

const setConf = (url = '') => {
	return fs.outputJson(CONFIGJSONPATH,{
		url
	})
}

const fn = async (readfilename, outfilename) => {

	const baseurl = await config().then( data => data.url )

	let readfilepath = `${readfilename}.txt`,
		outfilepath = `${outfilename}.txt`
	if(!isExistFile(readfilepath)){
		console.log(`文件 ${readfilename}.txt 不存在!`)
		return
	}
	fs.readFile(readfilepath, 'utf8', function(err, data) {
		let _data = data.split('\r\n'),
			_field = _data[0].split('\t'),
			json = _data.slice(1).map((item, i) => {
				let _item = item.split('\t')
				return _field.reduce((old, now, i) => {
					old[now] = _item[i]
					return old
				}, {})
			})

		fs.outputFile(outfilepath, format(json,baseurl)).then(() => {
			console.log(`创建完成 ${outfilepath}`)
		})
	});
}

module.exports = {
	setConf,
	fn
}