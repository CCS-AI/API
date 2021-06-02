declare class WordExtractor {
    extract(file: string | Buffer): Promise<WordExtractor.Document>;
}

export = WordExtractor;

declare namespace WordExtractor {
    class Document {
        getBody(): string;
        getFootnotes(): string;
        getHeaders(): string;
        getAnnotations(): string;
        getEndNotes(): string;
    }
}
