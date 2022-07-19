## Maven Center Publish

-----------------------------------------

A github action for fast setup maven center publishing.

Also can used for local setup

## GitHub Actions Setup

Add following content into your workflow

```yaml
- uses: KasukuSakura/maven-center-publish@main
  with:
    credential: ${{ secrets.MAVEN_CENTER_PUBLISH_CREDENTIAL }}
```

### Credential Generate

Clone this project.

cd the `run` directory

Download [key-gen.sh](https://github.com/Karlatemp/PublicationSign/blob/master/key-gen.sh) and put into `run`

Execute

```shell
## Please ensure in the `run` directory

sh ./key-gen.sh
node ../scripts/generate-ci-settings.js

## cat credential.json
```

-------------------------------------------

## Local Environment Setup

Open `gradle-setup` on GitHub web

Open `.gradle/init.d` in your local explorer.
> If `init.d` not exists in your local `.gradle` storage, create it by your self.

Download `publication-sign-setup.personal.init.gradle` and `publication-sign-setup.pomedit.gradle` into `.gradle/init.d`

> Remember to edit `.personal.init.gradle`
>
> **IMPORTANT: DON'T** modify the `workflow.fastSetup(....)` line

--------------------------------------------

## Gradle Project Setup

You need add `id 'io.github.karlatemp.publication-sign' version '1.3.40'` into your root project's `build.gradle`.
See more in [`PublicationSign`](https://github.com/Karlatemp/PublicationSign)

You need add a file named `project.json5` in your root project with content (without comments)

> You don't need to set up `PublicationSign` after applied this action
>
> Example project / Template project: [TestProject](./testproject)

```json5
{
  ///:: Your repository location
  "scm": "https://github.com/KasukuSakura/maven-center-publish",
  ///:: The license used
  "license": {
    "name": "MIT License",
    "url": "https://spdx.org/licenses/MIT.html"
  },
  "devs": [
    ///:: Format: [ <ID>, <Name>, <E-Mail> ]
    [
      "Karlatemp",
      "Karlatemp",
      "kar@kasukusakura.com"
    ]
  ]
}

```
