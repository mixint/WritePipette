const fs = require('fs')
const formidable = require('@mixint/formidable')
const Transflect = require('@mixint/transflect')
const extraStat = require('@mixint/extrastat')

module.exports = class WritePipette extends Transflect {

    constructor(){ super() }

    _open(source){
    	this.form = formidable.IncomingForm({
    		uploadDir: source.pathname,
    		keepFilenames: true
    	})
    	this.form.writeHeaders(source.headers)
	    return this.form
    }

    _transflect(data, done){
    	this.form.write(data)
    	console.log(`${this.form.bytesReceived}/${this.form.bytesExpected}`)
    	done()
    }

    _flush(done){
    	this.pipes.writeHead(302, {
    		"Location": this.source.pathname
    	})
    	done()
    }
}