import { JsonManager } from "../config/JsonManager";
import Funcionario from "../model/Funcionario";

export default class FuncionarioRepository{
    private static db = new JsonManager("./data/funcionario_database.json");

    static findAll(): Funcionario[]{
        const funcionarios = FuncionarioRepository.db.read().map(f => Funcionario.fromData(f.id, f.nome, f.telefone, f.endereco, f.usuario, f.senha, f.nivel));
        return funcionarios;
    }
    static findID(id: number): Funcionario | null{
        const data = FuncionarioRepository.db.find(id, "id");
        if (!data) return null;
        return Funcionario.fromData(data.id, data.nome, data.telefone, data.endereco, data.usuario, data.senha, data.nivel);
    }
    
    static findUsuario(usuario: string): Funcionario | null{
        const data = FuncionarioRepository.db.find(usuario, "usuario");
        if (!data) return null;
        return Funcionario.fromData(data.id, data.nome, data.telefone, data.endereco, data.usuario, data.senha, data.nivel);
    }

    static add(funcionario: Funcionario): boolean{
        if (funcionario.getID() === 0) {
            funcionario.setID(this.getNextId());
        }
        return FuncionarioRepository.db.add(funcionario, "id");
    }
    static remove(id: number): boolean{
        return FuncionarioRepository.db.delete(id, "id");
    }
    static update(funcionario: Funcionario): boolean{
        return FuncionarioRepository.db.edit(funcionario.getID(), "id", funcionario);
    }

    static getNextId(): number {
        const all = this.findAll();
        if (all.length === 0) return 1;
        const maxId = Math.max(...all.map(f => f.getID()));
        return maxId + 1;
    }

}