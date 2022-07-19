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

})().catch(err => {
    console.error(err)
    process.exit(-1)
})
