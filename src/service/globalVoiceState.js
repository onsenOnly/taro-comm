const globalVoiceState = {
}

export function set(key, val) {
    globalVoiceState[key] = val
}

export function get(key) {
    return globalVoiceState[key]
}

