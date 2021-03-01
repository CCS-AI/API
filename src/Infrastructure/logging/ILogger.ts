export interface ILogger {
    debug(content: any): void;
    info(content: any): void;
    warn(content: any): void;
    error(content: any): void;
}
