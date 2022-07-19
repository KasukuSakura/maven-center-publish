let subprocess = require('child_process');
let fsmod = require('fs');
let path_module = require('path')

module.exports.process_origin_cwd = process.cwd()

module.exports.exec = function (mainc, ...args) {
    if (mainc instanceof Function) {
        mainc(...args)
        return
    }
    subprocess.spawnSync(mainc, args, {
        stdio: 'inherit',
    })
}

module.exports.echo = function () {
    console.log(...arguments)
}

module.exports.jncc_module_dir = "";


let pt = module.path
let ststx = fsmod.statSync(pt)
if (ststx.isFile()) {
    module.exports.jncc_module_dir = path_module.dirname(pt)
} else {
    module.exports.jncc_module_dir = pt
}

module.exports.exit = process.exit

let readline = require('readline')

class KConsole {
    constructor() {
        this.itf = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        })
    }

    /**
     * @param q {string | null | undefined}
     * @return {Promise<String>}
     */
    request(q) {
        if (q == null || q.trim().length === 0) {
            q = "> "
        } else {
            q += "> "
        }

        let itf = this.itf
        return new Promise((resolve, reject) => {
            itf.question(q, resolve)
        });
    }

    close() {
        this.itf.close()
    }
}

module.exports.KConsole = KConsole

module.exports.check = function (rule, ...args) {
    let rsp
    if (rule instanceof Function) {
        rsp = rule.apply(this)
    } else {
        rsp = rule
    }
    if (!rsp) {
        let msg = args[0]
        console.error("Failed to pass check rule: " + (msg || rule))
        process.exit(4577)
    }
}

module.exports.containsText = function (thiz, msg) {
    if (msg instanceof RegExp) {
        return msg.test(thiz)
    }
    return thiz.indexOf(msg) !== -1
}

module.exports.protect_value_ci = function (value) {
    // noinspection RegExpRedundantEscape
    value = String(value).trim().replace(/\%/g, '%25')

    function hide_mask(vx) {
        vx = vx.trim()
            .replace(/\n/g, '%0A')
            .replace(/\r/g, '%0D')
        console.log("::add-mask::" + vx)
    }

    hide_mask(value)
    if (value.indexOf('\r') !== -1 || value.indexOf('\n') !== -1) {
        hide_mask(value.replace(/\r/g, '\n'))
        hide_mask(value.replace(/\n/g, '\r'))
        hide_mask(value.replace(/\r\n/g, '\n'))
        hide_mask(value.replace(/\r\n/g, '\r'))
    }
}
