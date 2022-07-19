(async function () {
    let fsmod = require('fs');
    let path_module = require('path')

    let kitself = require('../kit')
    let {echo, check, containsText} = kitself

    let pomFile = "build/publications/maven/pom-default.xml"
    check(() => fsmod.existsSync(pomFile))

    echo(pomFile)
    let pomText = (await fsmod.promises.readFile(pomFile)).toString('utf-8')
    echo(pomText)

    check(() => containsText(pomText, "<url>https://github.com/Karlatemp/UnsafeAccessor</url>"))
    check(() => containsText(pomText, "<name>MIT License</name>"))
    check(() => containsText(pomText, "<url>https://spdx.org/licenses/MIT.html</url>"))
    check(() => containsText(pomText, "<email>kar@kasukusakura.com</email>"))
    check(() => containsText(pomText, "<scm>"))
    check(() => containsText(pomText, "</scm>"))

    check(() => fsmod.existsSync(pomFile + '.asc'))

    let subp = require('child_process')
    let tmpstream = fsmod.createWriteStream('dumpRemoteServers.log')
    await (new Promise((resolve, reject) => {
        try {
            let proc = subp.spawn(
                './gradlew',
                ["dumpRemoteServers"],
                {
                    stdio: ['ignore', "pipe", 'pipe']
                }
            )
            proc.stdout.on('data', (data) => {
                tmpstream.write(data)
            });

            proc.stderr.on('data', (data) => {
                tmpstream.write(data)
            });

            proc.on('close', (code) => {
                if (code !== 0) {
                    reject(new Error("Code != 0: " + code))
                } else {
                    resolve()
                }
            });
        } catch (e) {
            reject(e)
        }
    }))
    tmpstream.close()

    let dumpRemoteServers = fsmod.readFileSync('dumpRemoteServers.log').toString('utf-8')
    echo("dumpRemoteServers\n", dumpRemoteServers)

    check(() => containsText(dumpRemoteServers, "MavenCentral::https://s01.oss.sonatype.org/jaioeae/aeasfaewa/sfaerawfsafg/srgtdsartgsae!!maven-center-publish-test!>NoPassword"))

})().catch(err => {
    console.error(err)
    process.exit(-1)
})
