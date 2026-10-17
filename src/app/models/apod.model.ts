export interface Apod {
    date: string;
    post_id: number;
    title: string;
    permalink: string;
    media_type: 'image' | 'video';
    explanation: string;
    credit?: string;
    copyright?: string;
    alt?: string;
    url?: string;
    hdurl?: string;
    basic_html?: string;
  }