import { JsonManager } from "../config/JsonManager";
import Etapa from "../model/Etapa";
import Funcionario from "../model/Funcionario";

export default class EtapaRepository{
    private static db = new JsonManager("./data/etapa_database.json");

    static findAll(): Etapa[]{
        const etapas = EtapaRepository.db.read().map(d => Etapa.fromData(d.id, d.nome, d.prazo, d.status));
        return etapas;
    }

    static findID(id: number): Etapa | null {
        const data = EtapaRepository.db.find(id, "id");
        if (!data) return null;
        const funcionarios = (data.funcionarios || []).map((d: any) => Funcionario.fromData(d.id, d.nome, d.telefone, d.endereco, d.usuario, d.senha, d.nivelPermissao));
        return Etapa.fromData(data.id, data.nome, data.prazo, data.status);
    }

    static add(etapa: Etapa): boolean{
        if (etapa.getID() === 0) {
            etapa.setID(this.getNextId());
        }
        return EtapaRepository.db.add(etapa, "id");
    }
    static remove(id: number): boolean{
        return EtapaRepository.db.delete(id, "id");
    }
    static update(id: number, etapa: Etapa): boolean{
        return EtapaRepository.db.edit(id, "id", etapa);
    }

    static getNextId(): number {
        const all = this.findAll();
        if (all.length === 0) return 1;
        const maxId = Math.max(...all.map(e => e.getID()));
        return maxId + 1;
    }

}