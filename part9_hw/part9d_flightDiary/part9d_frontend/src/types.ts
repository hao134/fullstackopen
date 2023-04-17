export interface Diary {
    id: number,
    date: string,
    weather: string,
    visibility: string,
    comment: string
}

export interface NotificationProps {
    message: string | null;
}
    

export type NewDiary = Omit<Diary, 'id'>