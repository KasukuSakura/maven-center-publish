(async function () {
    let fsmod = require('fs');
    let path_module = require('path')

    let kitself = require('./kit')
    let {echo} = kitself

    // INPUT_CREDENTIAL
    let credTxt = process.env.INPUT_CREDENTIAL
    let isCi = true
    if (process.env.MCP_TEST_USE_TEST_C || credTxt === undefined || credTxt.length === 0) {
        let credentialFile = 'credential.json'
        let forceCi = false
        let fsmod = require('fs')

        if (process.env.MCP_TEST_USE_TEST_C) {
            forceCi = true
            credentialFile = path_module.join(kitself.jncc_module_dir, 'test_credential.json')
        }

        if (!fsmod.existsSync(credentialFile)) {
            echo("No credential found.")
            process.exit(487)
        }
        credTxt = (await fsmod.promises.readFile(credentialFile)).toString('utf-8')
        isCi = forceCi
    }

    let jsox = JSON.parse(credTxt)
    let pri_key_loc = path_module.join(kitself.jncc_module_dir, 'gpg_keys.pri')
    let pub_key_loc = path_module.join(kitself.jncc_module_dir, 'gpg_keys.pub')

    await fsmod.promises.writeFile(pri_key_loc, jsox.keys[0])
    await fsmod.promises.writeFile(pub_key_loc, jsox.keys[1])


    let placeholder_regex = /placeholder\('(.+?)'\)/gi
    let placeholders = {
        ...jsox,
        password: jsox.passwd,
        username: jsox.user,
        'public-key': pub_key_loc,
        'private-key': pri_key_loc,
    }
    let template = (await fsmod.promises.readFile(path_module.join(
        kitself.jncc_module_dir, 'gradle-setup', 'publication-sign-setup.ci.gradle'
    ))).toString('utf-8')
    template = template.replace(placeholder_regex, (sub, g1) => {
        let rpx = placeholders[g1]
        if (rpx !== undefined) {
            if (rpx.startsWith('$$>')) {
                return rpx.substring(3)
            }
            return JSON.stringify(rpx)
        }
        return sub
    })

    if (!isCi) {
        echo(template)
        await fsmod.promises.writeFile('publication-sign-setup.ci.generated.init.gradle', template)
    } else {
        let usrHome = process.env.GRADLE_USER_HOME
        if (!usrHome) {
            usrHome = path_module.join(require('os').homedir(), '.gradle')
        }
        let gradleInitd = path_module.join(usrHome, 'init.d')
        if (!fsmod.existsSync(gradleInitd)) {
            await fsmod.promises.mkdir(gradleInitd, {
                recursive: true
            })
        }
        await fsmod.promises.writeFile(
            path_module.join(gradleInitd, 'publication-sign-setup.ci.generated.init.gradle'),
            template
        )
        await fsmod.promises.copyFile(
            path_module.join(kitself.jncc_module_dir, 'gradle-setup', 'publication-sign-setup.pomedit.gradle'),
            path_module.join(gradleInitd, 'publication-sign-setup.pomedit.gradle'),
        )

        // Security
        kitself.protect_value_ci(jsox.user)
        kitself.protect_value_ci(jsox.passwd)
        kitself.protect_value_ci(jsox.keys[0])
        kitself.protect_value_ci(jsox.keys[1])
    }
})().catch(err => {
    console.error(err)
    process.exit(-1)
})
