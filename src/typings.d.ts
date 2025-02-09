import type config from './config';
import tags from './utils/Tags';
import greetModel from './database/models/GreetModel';
import messagesModel from './database/models/MessageModel';
import SuggestionManager from './utils/SuggestionManager';
import { Giveaways } from 'discord-giveaways-super';
declare namespace NodeJS {
    interface ProcessEnv {
        TOKEN: string
    }
}

declare module 'discord.js' {
    interface Client {
        _config: typeof config;
        _tags: tags;
        _greetModel: typeof greetModel;
        _messages: typeof messagesModel;
        _suggestion: SuggestionManager;
        _giveaways: Giveaways;
    }
}