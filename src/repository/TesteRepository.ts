import { JsonManager } from "../config/JsonManager";
import Teste from "../model/Teste";

export default class TesteRepository{
    private static db = new JsonManager("./data/teste_database.json");

    static findAll(): Teste[]{
        const testes = TesteRepository.db.read().map(data => Teste.fromData(data.id, data.tipo, data.resultado));
        return testes;
    }
    static findID(id: number){
        const data = TesteRepository.db.find(id, "id");
        if (!data) return null;
        return Teste.fromData(data.id, data.tipo, data.resultado);
    }
    static add(teste: Teste): boolean{
        if (teste.getID() === 0) {
            teste.setID(this.getNextId());
        }
        return TesteRepository.db.add(teste, "id");
    }
    static remove(id: number): boolean{
        return TesteRepository.db.delete(id, "id");
    }
    static update(teste: Teste): boolean{
        return TesteRepository.db.edit(teste.getID(), "id", teste);
    }

    static getNextId(): number {
        const all = this.findAll();
        if (all.length === 0) return 1;
        const maxId = Math.max(...all.map(t => t.getID()));
        return maxId + 1;
    }
}