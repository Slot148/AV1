import * as path from 'path';
import * as fs from 'fs';

interface JsonItem {
    [key: string]: any;
}

export class JsonManager<T extends JsonItem = JsonItem> {
    private file_path: string;

    constructor(file_path: string) {
        this.file_path = path.resolve(file_path);
        this.check();
    }

    private check(): void {
        try {
            const dir = path.dirname(this.file_path);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            
            if (!fs.existsSync(this.file_path)) {
                fs.writeFileSync(this.file_path, JSON.stringify([], null, 4), 'utf-8');
            }
        } catch (error) {
            console.error(`Ocorreu um erro ao verificar/criar o arquivo: ${error}`);
            console.error(`(☉_☉|☉_☉|☉_☉)`);
            throw error;
        }
    }

    write(data: T[]): boolean {
        try {
            fs.writeFileSync(this.file_path, JSON.stringify(data, null, 4), 'utf-8');
            return true;
        } catch (error) {
            console.error(`Erro ao escrever no arquivo: ${error}`);
            return false;
        }
    }

    read(): T[] {
        this.check();
        try {
            const data = fs.readFileSync(this.file_path, 'utf-8');
            return JSON.parse(data) as T[];
        } catch (error) {
            if (error instanceof SyntaxError) {
                console.error(`Erro de parse JSON: ${error}`);
            }
            console.error("eu não sei o que adiciono como easter egg, então este é mais um... inclusive, isso é um erro e eu não consegui ler o arquivo")
            return [];
        }
    }

    edit(identifier: string | number, identifier_key: string, new_data: T): boolean {
        const data = this.read();
        const index = data.findIndex(item => String(item[identifier_key]) === String(identifier));
        
        if (index !== -1) {
            data[index] = new_data;
            return this.write(data);
        }
        return false;
    }

    delete(identifier: string | number, identifier_key: string): boolean {
        const data = this.read();
        const new_data = data.filter(item => String(item[identifier_key]) !== String(identifier));
        
        if (new_data.length < data.length) {
            return this.write(new_data);
        }
        return false;
    }

    find(identifier: string | number, identifier_key: string): T | null {
        const data = this.read();
        const item = data.find(item => String(item[identifier_key]) === String(identifier));
        return item || null;
    }
    
    add(new_item: T, identifier_key: string): boolean {
        try {
            const data = this.read();
            
            const existingIds = data
                .map(item => item[identifier_key])
                .filter(id => id !== undefined && id !== null)
                .map(id => String(id));
            
            const newId = new_item[identifier_key];
            if (newId && existingIds.includes(String(newId))) {
                console.log(`ID ${newId} já existe`);
                return false;
            }
            
            data.push(new_item);
            return this.write(data);
        } catch (error) {
            console.error(`Erro inesperado: ${error}`);
               return false;
        }

    }
}