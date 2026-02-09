export interface Post {
    id: string;
    title: string;
    content: string;
    createdAt: string; // ISO 8601 date string
    likesCount: number;
    updatedAt: string; // ISO 8601 date string
    userId: string;
}

export interface Like {
    id?: string;
    userId: string;
    postId: string;
}
