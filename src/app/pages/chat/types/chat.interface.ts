
export interface IChat {
    _id?: string;
    users: DataChat,
    messages?: ChatMessage[];
    createdAt: any;
    updateAt: any;
}

export interface ChatMessage {
    message: string;
    idUser: string;
    createdAt?: any;
}

export interface DataChat {
    userSend: string,
    userReceived: string,
    post: string,
    userSendName?: string,
    userReceivedName?: string
}