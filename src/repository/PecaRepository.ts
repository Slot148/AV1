import { JsonManager } from "../config/JsonManager";
import Peca from "../model/Peca";

export default class PecaRepository{
    private static db = new JsonManager("./data/peca_database.json");

    static findAll(): Peca[]{
        const pecas = PecaRepository.db.read().map(data => Peca.fromData(data.id, data.nome, data.tipo, data.fornecedor, data.status));
        return pecas;
    }
    static findID(id: number){
        const data = PecaRepository.db.find(id, "id");
        if (!data) return null;
        return Peca.fromData(data.id, data.nome, data.tipo, data.fornecedor, data.status);
    }
    
    static add(peca: Peca): boolean{
        if (peca.getID() === 0) {
            peca.setID(this.getNextId());
        }
        return PecaRepository.db.add(peca, "id");
    }

    static remove(id: number): boolean{
        return PecaRepository.db.delete(id, "id");
    }
    static update(peca: Peca): boolean{
        return PecaRepository.db.edit(peca.getID(), "id", peca);
    }

    static getNextId(): number {
        const all = this.findAll();
        if (all.length === 0) return 1;
        const maxId = Math.max(...all.map(p => p.getID()));
        return maxId + 1;
    }

}