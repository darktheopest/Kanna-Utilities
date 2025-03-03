import { LogLevel, SapphireClient } from '@sapphire/framework';
import { Giveaways, DatabaseType } from 'discord-giveaways-super';
import { ActivityType, Partials, GatewayIntentBits, Options } from 'discord.js';
import config from '../config';
import tags from '../utils/Tags';
import greetModel from '../database/models/GreetModel';
import messagesModel from '../database/models/MessageModel';
import SuggestionManager from '../utils/SuggestionManager';

export default class EClient extends SapphireClient {
	public _config: typeof config;
	public _tags: tags;
	public _greetModel: typeof greetModel;
	public _messages: typeof messagesModel;
	public _suggestion: SuggestionManager;
	public _giveaways: Giveaways<DatabaseType.MONGODB, any, any>;
	public constructor() {
		super({
			allowedMentions: {
				parse: [
					'roles',
					'users'
				],
				repliedUser: false
			},
			caseInsensitiveCommands: true,
			caseInsensitivePrefixes: true,
			defaultPrefix: config.prefix,
			disableMentionPrefix: true,
			failIfNotExists: false,
			intents: [
				GatewayIntentBits.GuildMembers,
				GatewayIntentBits.GuildMessages,
				GatewayIntentBits.GuildVoiceStates,
				GatewayIntentBits.Guilds,
				GatewayIntentBits.MessageContent,
				GatewayIntentBits.GuildPresences,
				GatewayIntentBits.GuildModeration,
				GatewayIntentBits.GuildMessageReactions
			],
			loadDefaultErrorListeners: true,
			loadMessageCommandListeners: true,
			logger: {
				level: LogLevel.Debug
			},
			partials: [
				Partials.Channel,
				Partials.GuildMember,
				Partials.Message,
				Partials.Reaction,
				Partials.User
			],
			presence: {
				activities: [
					{
						name: `${config.prefix}help · kannabot.vn`,
						type: ActivityType.Custom
					}
				]
			},
			makeCache: Options.cacheWithLimits({
				UserManager: undefined
			})
		});
		this._config = config;
		this._tags = new tags();
		this._greetModel = greetModel;
		this._messages = messagesModel;
		this._suggestion = new SuggestionManager();
		this._giveaways = new Giveaways<DatabaseType.MONGODB, any, any>(this, {
			database: DatabaseType.MONGODB,
			connection: {
				connectionURI: 'mongodb://kannaUtilities:kannaUtilities@127.0.0.1:2354/kannaUtilities',
				dbName: 'kannaUtilities'
			},
			debug: true
		});
	}
	public start() {
		return super.login(config.token);
	}
}