export default class Utils {
    static newJSONBlob(data: any): Blob {
        function isNumericString(str: string): boolean {
            // A numeric string will match this regular expression
            return /^-?\d+(\.\d+)?(e[-+]?\d+)?$/i.test(str);
        }

        // Check if data is a string and if it is numeric
        if (typeof data === 'string' && !isNumericString(data)) {
            return new Blob([data], {
                type: "text/plain"
            });
        }
        return new Blob([JSON.stringify(data)], {
            type: "application/json"
        });
    }
}