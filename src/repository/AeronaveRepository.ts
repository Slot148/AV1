import { JsonManager } from "../config/JsonManager";
import Aeronave from "../model/Aeronave";

export default class AeronaveRepository{
    private static db = new JsonManager("./data/aeronaves_database.json");

    static findAll(): Aeronave[]{
        const aeronaves = AeronaveRepository.db.read().map(d => Aeronave.fromData(d.codigo, d.modelo, d.tipo, d.capacidade, d.alcance,d.pecasID || [], d.etapasID || [],d.testesID || []));
        return aeronaves;
    }

    static findID(id: string): Aeronave | null{
        const d = AeronaveRepository.db.find(id, "codigo");
        if (!d) return null;
        return Aeronave.fromData(d.codigo, d.modelo, d.tipo, d.capacidade, d.alcance,d.pecasID || [],d.etapasID || [],d.testesID || []);
    }

    static add(aeronave: Aeronave): boolean{
        if (this.findID(aeronave.getID())) {
            console.log(`Código ${aeronave.getID()} já existe!`);
            return false;
        }
        
        const obj = {
            codigo: aeronave.getID(),
            modelo: aeronave.getModelo(),
            tipo: aeronave.getTipo(),
            capacidade: aeronave.getCapacidade(),
            alcance: aeronave.getAlcance(),
            pecasID: aeronave.getPecasID(),
            etapasID: aeronave.getEtapasID(),
            testesID: aeronave.getTestesID()
        };
        return AeronaveRepository.db.add(obj, "codigo");
    }

    static remove(codigo: string): boolean{
        return AeronaveRepository.db.delete(codigo, "codigo");
    }
    
    static update(aeronave: Aeronave): boolean{
        const obj = {
            codigo: aeronave.getID(),
            modelo: aeronave.getModelo(),
            tipo: aeronave.getTipo(),
            capacidade: aeronave.getCapacidade(),
            alcance: aeronave.getAlcance(),
            pecasID: aeronave.getPecasID(),
            etapasID: aeronave.getEtapasID(),
            testesID: aeronave.getTestesID()
        };
        return AeronaveRepository.db.edit(aeronave.getID(), "codigo", obj);
    }
}