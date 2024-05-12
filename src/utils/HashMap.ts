export class HashTable<K, V> {
    private table: any = {};

    addSet(key: K, value: V) {
        this.table[JSON.stringify(key)] = value;
    }

    get(key: K): V | null {
        const strKey = JSON.stringify(key);
        if (!(strKey in this.table)) {
            return null;
        }

        return this.table[strKey];
    }

    delete(key: K): boolean {
        const strKey = JSON.stringify(key);
        if (!(strKey in this.table)) {
            return false;
        }

        return delete this.table[strKey];
    }

    getAllValues(): V[] {
        return Object.values(this.table);
    }

    getAllKeys(){
        return Object.keys(this.table)
    }

}