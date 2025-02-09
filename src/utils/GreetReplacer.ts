import { Guild, User } from "discord.js";

export default async function GreetReplacer(input: { messages: string, user: User, guild: Guild }) {
    return input.messages
    .replaceAll('!{user.mention}', input.user.toString())
    .replaceAll('!{user.username}', input.user.username)
    .replaceAll('!{user.tag}', input.user.tag)
    .replaceAll('!{user.id}', input.user.id)
    .replaceAll('!{guild.name}', input.guild.name)
    .replaceAll('!{guild.inputcount}', (await input.guild?.members.fetch())?.size.toString())
}
