export type Weather = 'sunny' | 'rainy' | 'cloudy' | 'windy' | 'stormy';
  
export type Visibility = 'great' | 'good' | 'ok' | 'poor';
  
export interface DiaryEntry {
    id: number;
    date: string;
    weather: Weather;
    visibility: Visibility;
    comment: string;
}
  
export type NewDiaryEntry = Omit<DiaryEntry, 'id'>;

// 9c Utility Types => To hide sensitive information(comment)
export type NonSensitiveDiaryEntry = Omit<DiaryEntry, 'comment'>;