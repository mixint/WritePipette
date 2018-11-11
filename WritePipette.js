const fs = require('fs')
const formidable = require('@mixint/formidable')
const Transflect = require('@mixint/transflect')
const extraStat = require('@mixint/extrastat')
const ctxify = require('ctxify')

module.exports = class WritePipette extends Transflect {

    constructor(){ super() }

    _open(source){
        this.form = formidable.IncomingForm({
            uploadDir: source.pathname,
            keepFilenames: true
        })
        this.form.writeHeaders(source.headers)
        this.form.on('error', error => this.destroy('stream'))

        this.push(ctxify({body: {
            childNodes: [
                {style: {
                    textContent: `
                        #progressbg {
                            width: 100%;
                            height: 20px;
                            background: #c9ffc9;
                            position: fixed;
                        }
                        #progress {
                            width: 0%;
                            height: 20px;
                            background: rgb(0,255,0);
                            position: fixed;
                            transition: width 0.5s linear;
                        }
                        h3 {
                            position: fixed;
                            font-family: sans-serif;
                            color: #0e5f46;
                            top: 11px;
                        }`
                }},
                {div: {
                    id: "progressbg",
                }},
                {div: {
                    id: "progress",
                }}
            ]
        }}))

        return this.form
    }

    _transflect(data, done){
        this.form.write(data, done)
        this.push(ctxify({style:{
            textContent: `#progress {width: ${this.progress};}`
        }}))
        done()
    }

    _end(done){
        this.push(ctxify({h3: {
            textContent: "Upload Complete. Redirecting..."
        }}))
        this.push(ctxify({meta:{
            "http-equiv": "refresh",
            content: `2; url=${this.source.pathname}`
        }}))
        done()
    }

    get progress(){
        return Math.floor(
            100
            * this.form.bytesReceived
            / this.form.bytesExpected
        ) + '%'
    }
}