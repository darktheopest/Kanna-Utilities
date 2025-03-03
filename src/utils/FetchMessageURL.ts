import { Guild, TextChannel, Message } from "discord.js";
import EClient from "../structures/EClient";

async function FetchMessageURL(messageURL: string, client: EClient) {
    const regex = /https:\/\/discord.com\/channels\/(?<id>\d{17,19})\/(?<id2>\d{17,19})\/(?<id3>\d{17,19})$/

    if (!regex.test(messageURL)) throw new Error('[Error] Message not found!')

    const matches = regex.exec(messageURL);
    const guild = await client.guilds.fetch(matches![1])
    const channel = await guild.channels.fetch(matches![2])
    const message = await (channel as TextChannel).messages.fetch(matches![3])
    return { guild, channel, message }
}

async function FetchDmMessageURL(messageURL: string, client: EClient) {
    const regex = /https:\/\/discord.com\/channels\/@me\/(?<id2>\d{17,19})\/(?<id3>\d{17,19})$/

    if (!regex.test(messageURL)) throw new Error('[Error] Message not found!')

    const matches = regex.exec(messageURL);
    const channel = await client.channels.fetch(matches![1]) as TextChannel
    const message = await (channel as TextChannel).messages.fetch(matches![2]) as Message
    return { channel, message }
}

export default { FetchDmMessageURL, FetchMessageURL }