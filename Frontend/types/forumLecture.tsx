export interface ForumLecture {
  id?: string;
  lectureId?: string;
  userId?: string;
  userName?: string;
  avatarUrl?: string;
  comment?: string;
  commentReplies?: CommentReply[];
}
export interface CommentReply {
  id?: string;
  userId?: string;
  userName?: string;
  avatarUrl?: string;
  comment?: string;
}
