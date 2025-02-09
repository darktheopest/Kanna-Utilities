import type { HexColorString } from 'discord.js';
import * as dotenv from 'dotenv';
dotenv.config();

const config = {
	token: process.env.TOKEN,
	prefix: ['-'],
	developers: ['926643835419910184', '921368997482602536'],
	uptimePing: ['926643835419910184', '921368997482602536'],
	color: {
		default: '#2f3136' as HexColorString,
		error: '#f02225' as HexColorString,
		normal: '#deba9d' as HexColorString,
		accept: '#3ccf4e' as HexColorString,
		warning: '#f3b649' as HexColorString
	},
	emoji: {
		loading: '<a:Loading:1072760894246899712>',
		cross: '<:RedCross:1065933154378059808>',
		tick: '<:GreenTick:1065933158241013791>',
		exclamation: '<:Exclamation:1145332849310957668>'
	},
	mainBot: '1027954911121526845',
	mainServer: '1079049354096160868'
};

export default config;