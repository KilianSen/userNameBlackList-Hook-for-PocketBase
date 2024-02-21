onAfterBootstrap((e) => {
    const config = require(`${__hooks}/hookSettings.js`).Setting("userNameBlackList", {
        blockList: ["admin", "root", "superuser", "test", "guest"],
        blockPrefix: ["admin", "root", "superuser", "test", "guest"],
        blockSuffix: ["admin", "root", "superuser", "test", "guest"],
        blockContains: ["admin", "root", "superuser", ", "test", "guest"],
        blockRegex: ["^admin", "admin$", "^root", "root$", "^superuser", "superuser$", "^test", "test$", "^guest", "guest$"],

        stateReason: false,

        languageTag: "language",

        responses: {
            languages: {
                "default": {
                    blockList: "Username is not allowed. {reason}",
                    blockPrefix: "Username is not allowed. {reason}",
                    blockSuffix: "Username is not allowed. {reason}",
                    blockContains: "Username is not allowed. {reason}",
                    blockRegex: "Username is not allowed. {reason}"

                },
                "de": {
                    blockList: "Nutzername ist nicht erlaubt. {reason}",
                    blockPrefix: "Nutzername ist nicht erlaubt. {reason}",
                    blockSuffix: "Nutzername ist nicht erlaubt. {reason}",
                    blockContains: "Nutzername ist nicht erlaubt. {reason}",
                    blockRegex: "Nutzername ist nicht erlaubt. {reason}"
                }
            },
        }})
})

onRecordBeforeCreateRequest((e) => {
    if (e.collection.name !== "users" || e.httpContext.get("admin")) {
        return null // ignore for admins
    }
    const config = require(`${__hooks}/hookSettings.js`).Setting("userNameBlackList", null)

    // check if language is set in record, if not use default
    const recordLang = e.record.get(config.get().languageTag)
    // check if language is available as response, if not use default
    const lang = (recordLang in config.get().responses.languages ? recordLang : "default") || "default"

    // get responses for language
    const responses = config.get().responses.languages[lang]


    if (config.get().blockList.includes(e.record.get("username"))) {
        $app.logger().debug("Blocked User Creation: Username is on block list", "type", "hook", "file", "userNameBlackList.pb.js")
        throw new BadRequestError(!config.get().stateReason? responses.blockList.replace("{reason}", "") : responses.blockList.replace("{reason}", e.record.get("username")))
    }
    if (config.get().blockPrefix.some((prefix) => e.record.get("username").startsWith(prefix))) {
        $app.logger().debug("Blocked User Creation: Username has blocked prefix", "type", "hook", "file", "userNameBlackList.pb.js")
        throw new BadRequestError(!config.get().stateReason? responses.blockPrefix.replace("{reason}", "") : responses.blockPrefix.replace("{reason}",
            config.get().blockPrefix.find((prefix) => e.record.get("username").startsWith(prefix))))
    }
    if (config.get().blockSuffix.some((suffix) => e.record.get("username").endsWith(suffix))) {
        $app.logger().debug("Blocked User Creation: Username has blocked suffix", "type", "hook", "file", "userNameBlackList.pb.js")
        throw new BadRequestError(!config.get().stateReason? responses.blockSuffix.replace("{reason}", "") : responses.blockSuffix.replace("{reason}",
            config.get().blockSuffix.find((suffix) => e.record.get("username").endsWith(suffix))))
    }
    if (config.get().blockContains.some((contains) => e.record.get("username").includes(contains))) {
        $app.logger().debug("Blocked User Creation: Username has blocked contains", "type", "hook", "file", "userNameBlackList.pb.js")
        throw new BadRequestError(!config.get().stateReason? responses.blockContains.replace("{reason}", "") : responses.blockContains.replace("{reason}",
            config.get().blockContains.find((contains) => e.record.get("username").includes(contains))))
    }
    if (config.get().blockRegex.some((regex) => e.record.get("username").match(new RegExp(regex)))) {
        $app.logger().debug("Blocked User Creation: Username has blocked regex", "type", "hook", "file", "userNameBlackList.pb.js")
        throw new BadRequestError(!config.get().stateReason? responses.blockRegex.replace("{reason}", "") : responses.blockRegex.replace("{reason}",
            config.get().blockRegex.find((regex) => e.record.get("username").match(new RegExp(regex)))))
    }

    return null
}, "users")
