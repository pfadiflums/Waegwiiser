export interface StufeConfig {
  slug: string;
  name: string;
  slogan: string;
  color: string;
  calendarUrl: string;
}

export const STUFEN: StufeConfig[] = [
  {
    slug: 'biber',
    name: 'Biberstufe',
    slogan: 'Mit Freude Dabei',
    color: '#eac04a',
    calendarUrl: 'https://calendar.google.com/calendar/embed?height=600&wkst=2&ctz=Europe%2FZurich&showPrint=0&showTitle=0&showNav=0&showDate=0&showTabs=0&showCalendars=0&showTz=0&mode=AGENDA&src=N2VucWUzbWo4NHFmdmlzcjk5cmNkYmRpajRAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&color=%23f6bf26'
  },
  {
    slug: 'woelfe',
    name: 'Wolfsstufe',
    slogan: 'Mis Bescht',
    color: '#1380a3',
    calendarUrl: 'https://calendar.google.com/calendar/embed?height=600&wkst=2&ctz=Europe%2FZurich&showPrint=0&showTitle=0&showNav=0&showDate=0&showTabs=0&showCalendars=0&showTz=0&mode=AGENDA&src=YzUzbHVydjY1NTA1dWx1MzBrNGg4bGJoMjBAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&color=%23039be5'
  },
  {
    slug: 'pfader',
    name: 'Pfaderstufe',
    slogan: 'Allzeit Bereit',
    color: '#b78e60',
    calendarUrl: 'https://calendar.google.com/calendar/embed?height=600&wkst=2&ctz=Europe%2FZurich&showPrint=0&showTitle=0&showNav=0&showDate=0&showTabs=0&showCalendars=0&showTz=0&mode=AGENDA&src=N3VyZmxkZTRwNjdtZzZtc2U0NGthNHNoOGNAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&color=%23a79b8e'
  },
  {
    slug: 'pios',
    name: 'Piostufe',
    slogan: 'Zäme Wyter!',
    color: '#bf2e26',
    calendarUrl: 'https://calendar.google.com/calendar/embed?height=600&wkst=2&ctz=Europe%2FZurich&showPrint=0&showTitle=0&showNav=0&showDate=0&showTabs=0&showCalendars=0&showTz=0&mode=AGENDA&src=Y2FvYzk0bDY2cnI5c2pwcjRxNmFmMWIzMW9AZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&color=%23d50000'
  },
];

export const STUFEN_BY_SLUG: Record<string, StufeConfig> = Object.fromEntries(
  STUFEN.map(s => [s.slug, s])
);
