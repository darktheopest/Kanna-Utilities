import { ApplicationCommandRegistry, Command, SapphireClient } from "@sapphire/framework";
import EClient from "../../structures/EClient";

export class Suggest extends Command {
    public constructor(context: Command.LoaderContext, options: Command.Options) {
        super(context, {
            ...options,
            name: 'suggest',
            description: 'Send your suggestion to suggestion channel'
        })
    }
    public registerApplicationCommands(registry: ApplicationCommandRegistry) {
        registry.registerChatInputCommand(command =>
            command
                .setName(this.name)
                .setDescription(this.description)
                .addStringOption(op =>
                    op
                        .setName('suggestion')
                        .setRequired(true)
                        .setDescription('Your suggestion')), { idHints: ['1146074360600346745'] }
        )
    }

    public async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
        await interaction.deferReply({
            ephemeral: true,
            fetchReply: true
        })
        const suggestion = interaction.options.getString('suggestion')!
        this.container.client._suggestion.CreateSuggestion({
            client: this.container.client as EClient,
            interaction: interaction,
            suggestion: suggestion,
            user: interaction.user
        })
    }
}