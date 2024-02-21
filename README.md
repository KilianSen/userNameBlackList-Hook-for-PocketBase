# userNameBlackList-Hook-for-PocketBase
This hook checks if the username is on a blacklist. 
The blacklist can be configured with a list of blocked usernames, blocked prefixes, blocked suffixes, blocked contains and blocked regex matches.

## Configuration
The hook can be configured with the following settings:
- `blockList` - List of usernames that are blocked
- `blockPrefix` - List of prefixes that are blocked
- `blockSuffix` - List of suffixes that are blocked
- `blockContains` - List of contains that are blocked
- `blockRegex` - List of regex that are blocked
- `stateReason` - If true, the reason for blocking will be returned in the response
- `languageTag` - The language tag to use for responses
- `responses` - The responses for the language tag

# Installation
This hook requires [HookSettings](https://github.com/KilianSen/hookSettings-for-PocketBase)

1. Download the latest release from the [releases page](https://github.com/KilianSen/userNameBlackList-Hook-for-PocketBase/releases) and put it in your `pb_hooks` folder
2. Restart/Reload PocketBase to generate the default configuration
3. Go into the PocketBase UI
4. Go to the `pbHookSettings` collection
5. Tweak `userNameBlackList` settings to your liking
