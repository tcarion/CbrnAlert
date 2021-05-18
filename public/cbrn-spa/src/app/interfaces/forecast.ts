export interface Forecast {
    startdate: Date,
    steps: {step: number, datetime: Date}[];
}
