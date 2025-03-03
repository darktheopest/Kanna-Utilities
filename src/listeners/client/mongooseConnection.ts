import { Listener, Events } from "@sapphire/framework";
import mongoose from 'mongoose';

export class MongooseConnection extends Listener {
    public constructor(context: Listener.Context, options: Listener.Options) {
        super(context, {
            ...options,
            event: Events.ClientReady,
        })
    }
    public async run() {
        return mongoose.connect('mongodb://kannaUtilities:kannaUtilities@127.0.0.1:2354/kannaUtilities')
            .then(() => console.log('Successfully connected to MongoDB by mongoose!'))
            .catch((err) => console.log('An error occurred while connection to MongoDB' + err))
    }
}