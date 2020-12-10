interface String {
    replaceAll(from: string | RegExp, to: string): string;
}

String.prototype.replaceAll = function (from: string | RegExp, to: string): string {
    if (from instanceof RegExp) {
        const re = new RegExp(from as RegExp, 'g');
        return String(this).replace(re, to);
    }
    let result: string = String(this);
    while (result.indexOf(from as string) !== -1) {
        result = result.replace(from as string, to);
    }
    return result;
}
