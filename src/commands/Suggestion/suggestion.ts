import { Subcommand } from "@sapphire/plugin-subcommands";
import suggestionModel from "../../database/models/SuggestionModel";
import EClient from "../../structures/EClient";

export class Suggestion extends Subcommand {
    public constructor(context: Subcommand.LoaderContext, options: Subcommand.Options) {
        super(context, {
            ...options,
            name: 'suggestion',
            description: 'A suggestion manager subcommand',
            requiredUserPermissions: ['Administrator'],
            subcommands: [
                {
                    name: 'accept',
                    chatInputRun: 'accept'
                },
                {
                    name: 'deny',
                    chatInputRun: 'deny'
                },
                {
                    name: 'add-comment',
                    chatInputRun: 'addComment'
                }


            ]
        })
    }
    public registerApplicationCommands(registry: Subcommand.Registry) {
        registry.registerChatInputCommand(command => command
            .setName(this.name)
            .setDescription(this.description)
            .addSubcommand(sub => sub
                .setName('accept')
                .setDescription('Accept a suggestion')
                .addStringOption(op => op
                    .setName('suggestion-code')
                    .setDescription('suggestion code')
                    .setRequired(true))
                .addStringOption(op => op
                    .setName('comment')
                    .setDescription('comment on accept')
                    .setRequired(true)))
            .addSubcommand(sub => sub
                .setName('deny')
                .setDescription('Deny a suggestion')
                .addStringOption(op => op
                    .setName('suggestion-code')
                    .setDescription('suggestion code')
                    .setRequired(true))
                .addStringOption(op => op
                    .setName('comment')
                    .setDescription('comment on deny')
                    .setRequired(true)))
            .addSubcommand(sub => sub
                .setName('add-comment')
                .setDescription('Add new command to target suggestion')
                .addStringOption(op => op
                    .setName('suggestion-code')
                    .setDescription('suggestion code')
                    .setRequired(true))
                .addStringOption(op => op
                    .setName('comment')
                    .setDescription('comment')
                    .setRequired(true))), { idHints: ['1147407110687166574'] })
    }

    public async accept(interaction: Subcommand.ChatInputCommandInteraction) {
        await interaction.deferReply({ ephemeral: true });

        const code = interaction.options.getString('suggestion-code')
        const comment = interaction.options.getString('comment')

        const data = await suggestionModel.findOne({
            code: code
        }).exec()

        if (!data) return await interaction.editReply({
            content: `Not found suggestion with code: \`${code}\``
        })

        await interaction.client._suggestion.accept({
            client: interaction.client as EClient,
            code: code!,
            comment: comment!,
            user: interaction.user
        })
        return await interaction.editReply({
            content: `[Done](${data.suggestionURL})`
        })
    }

    public async deny(interaction: Subcommand.ChatInputCommandInteraction) {
        await interaction.deferReply({ ephemeral: true });

        const code = interaction.options.getString('suggestion-code')
        const comment = interaction.options.getString('comment')

        const data = await suggestionModel.findOne({
            code: code
        }).exec()

        if (!data) return await interaction.editReply({
            content: `Not found suggestion with code: \`${code}\``
        })

        await interaction.client._suggestion.deny({
            client: interaction.client as EClient,
            code: code!,
            comment: comment!,
            user: interaction.user
        })
        return await interaction.editReply({
            content: `[Done](${data.suggestionURL})`
        })
    }

    public async addComment(interaction: Subcommand.ChatInputCommandInteraction) {
        await interaction.deferReply({ ephemeral: true });

        const code = interaction.options.getString('suggestion-code')
        const comment = interaction.options.getString('comment')

        const data = await suggestionModel.findOne({
            code: code
        }).exec()

        if (!data) return await interaction.editReply({
            content: `Not found suggestion with code: \`${code}\``
        })

        await interaction.client._suggestion.addComment({
            client: interaction.client as EClient,
            code: code!,
            comment: comment!,
            user: interaction.user
        })
        return await interaction.editReply({
            content: `[Done](${data.suggestionURL})`
        })
    }
}