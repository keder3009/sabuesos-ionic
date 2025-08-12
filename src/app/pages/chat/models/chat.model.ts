import { ChatMessage } from "../types/chat.interface";

class MChat {
    id: string;
    users: string[];
    messages: ChatMessage[];
    createdAt: any;
    idReport: string;
    namePet: string;


    constructor(id, users, messages, createdAt, idReport, namePet) {
        this.id = id;
        this.users = users;
        this.messages = messages
        this.createdAt = createdAt;
        this.idReport = idReport;
        this.namePet = namePet;
    }

}

// Firestore data converter
export const chatConverter = {
    toFirestore: (mChat) => {
        return {
            id: mChat.id,
            users: mChat.users,
            messages: mChat.message,
            createdAt: mChat.creetedAt,
            idReport: mChat.idReport,
            namePet: mChat.namePet,
        };
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        return new MChat(data.id, data.users, data.messages, data.createdAt, data.idReport, data.namePet);
    }
};