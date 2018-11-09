const Transflect = require('@mixint/transflect')
const WritePipette = require('../WritePipette.js')
const http = require('http')
const ctxify = require('ctxify')
const fs = require('fs')

class SendForm extends Transflect {
	constructor(){super()}

	_end(done){
		this.pipes.writeHead(200, {
			"content-type":"text/html"
		})
		done(null, ctxify({"form": {
			"method": "POST",
			"enctype": "multipart/form-data",
			"childNodes": [
				{"input": {
					"type": "file",
					"name": "filename"
				}},
				{"button": {
					"type": "submit",
					"textContent": "Upload"
				}}
			]
		}}))
	}
}

http.createServer({
    IncomingMessage: require('parsedmessage'),
    ServerResponse: require('serverfailsoft'),
}, (req, res) => ((route) => {
	req.pipe(new route).pipe(res)
})(
	req.method == 'GET'  ? SendForm     :
    req.method == 'POST' ? WritePipette :
    					   Transflect
)).listen(3000)