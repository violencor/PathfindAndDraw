export class CustomMap {
    constructor(keyFunc) {
        this.map = new Map();
        this.keyFunc = keyFunc;
    }

    set(obj, value) {
        const key = this.keyFunc(obj);
        this.map.set(key, value);
    }

    get(obj) {
        const key = this.keyFunc(obj);
        return this.map.get(key);
    }

    has(obj) {
        const key = this.keyFunc(obj);
        return this.map.has(key);
    }

}
