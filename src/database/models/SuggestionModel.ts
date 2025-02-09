import { model, Schema } from 'mongoose'

interface VoteParticipant {
    user: string;
    timestamp: number;
}

interface SuggestionInterface {
    user: string;
    code: string;
    suggestion: string;
    status: [
        {
            accepted: boolean,
            by: string,
            timestamp: number
        },
        {
            denied: boolean,
            by: string,
            timestamp: number
        }
    ],
    createdTimestamp: number;
    votes: Array<{
        vote: string;
        participants: Array<VoteParticipant>;
    }>;
    suggestionURL: string;
    DMLogMessageURL: string;
}

const schema = new Schema<SuggestionInterface>({
    user: String,
    code: String,
    suggestion: String,
    status: [
        {
            accepted: {
                type: Boolean,
                default: false
            },
            by: String,
            timestamp: Number
        },
        {
            denied: {
                type: Boolean,
                default: false
            },
            by: String,
            timestamp: Number
        },
    ],
    createdTimestamp: Number,
    votes: [
        {
            vote: {
                type: String,
                default: 'upvote'
            },
            participants: {
                type: Array,
                default: []
            }
        },
        {
            vote: {
                type: String,
                default: 'consider'
            },
            participants: {
                type: Array,
                default: []
            }
        },
        {
            vote: {
                type: String,
                default: 'downvote'
            },
            participants: {
                type: Array,
                default: []
            }
        },
    ],
    suggestionURL: String,
    DMLogMessageURL: String
})

const suggestionModel = model<SuggestionInterface>('SuggestionModel', schema)

export default suggestionModel
