export interface DecodedToken {
    sub: string;
    nameid: string;
    unique_name: string;
    modules?: string; // this is a JSON string
    exp: number;
}