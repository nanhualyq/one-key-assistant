type Action = {
    name: string
    shortcut?: string
    target: string
}

type GeminiConfig = {
    apiKey: string
    quickChatList: GeminiChat[]
}

type GeminiChat = {
    name: string
    model: string
    systemInstruction: string
    isSearch: boolean
    isThinking: boolean
}