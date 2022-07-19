#!node
(async function () {
    let {echo, exit, KConsole} = require('../kit')

    echo("============================================")
    echo("CI Settings Generator")
    echo("============================================")

    let fs = require('fs')
    if (!fs.existsSync("keys.pri") || !fs.existsSync("keys.pub")) {
        echo("Missing keys.pri or keys.pub")
        echo("Please put your GPG keys into your running directory")
        echo("@see https://github.com/Karlatemp/PublicationSign/blob/master/key-gen.sh")
        exit(-5)
        return
    }

    let output = {};
    output.keys = [fs.readFileSync("keys.pri").toString('utf-8'), fs.readFileSync('keys.pub').toString('utf-8')];

    // https://s01.oss.sonatype.org/service/local/staging/deploy/maven2
    let console0 = new KConsole()

    let remoteServer, user, password;

    do {
        do {
            echo("Please choose your remote deploy server:")
            echo("1: https://s01.oss.sonatype.org/service/local/staging/deploy/maven2")
            echo("2: https://oss.sonatype.org/service/local/staging/deploy/maven2")
            echo("Others: your custom deploy location")

            let rspx = await console0.request(null)
            switch (rspx) {
                case "1":
                    remoteServer = "https://s01.oss.sonatype.org/service/local/staging/deploy/maven2"
                    break
                case "2":
                    remoteServer = "https://oss.sonatype.org/service/local/staging/deploy/maven2"
                    break
                default:
                    remoteServer = rspx
            }

            echo("Is right?", remoteServer)
            let ok = (await console0.request("OK? [Y/N]")).toLowerCase()
            if (ok.trim().length === 0 || ok === "yes" || ok === "y") {
                break
            }
        } while (true)

        user = await console0.request("Login user name")
        password = await console0.request("Password")

        echo("Remote Server:", remoteServer)
        echo("User:         ", user)
        echo("Password:     ", password)

        let ok = (await console0.request("All is ok? [Y/N]")).toLowerCase()
        if (ok.trim().length === 0 || ok === "yes" || ok === "y") {
            break
        }
    } while (true)
    console0.close()

    output.remoteServer = remoteServer
    output.user = user
    output.passwd = password

    let out = JSON.stringify(output)
    await fs.promises.writeFile("credential.json", out)
    echo("Saved to credential.json")

})().catch(err => {
    console.error(err)
    process.exit(4)
})
