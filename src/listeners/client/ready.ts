import { Listener } from '@sapphire/framework';
import { Events } from 'discord.js';
import type EClient from '../../structures/EClient';

export class Ready extends Listener {
	public constructor(context: Listener.LoaderContext, options: Listener.Options) {
		super(context, {
			...options,
			event: Events.ClientReady,
		});
	}
	public run(client: EClient) {
		return client.logger.info(`Successfully logged in as ${client.user?.username} [${client.user?.id}]`);
	}
}