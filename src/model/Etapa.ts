import StatusEtapa from "../enums/StatusEtapa.js";
import FuncionarioRepository from "../repository/FuncionarioRepository.js";
import Funcionario from "./Funcionario.js";

export default class Etapa {
    constructor(
        private id: number,
        private nome: string,
        private prazo: string,
        private status: StatusEtapa,
        private funcionariosID: number[] = []
    ){}

    getID(): number{
        return this.id;
    }
    setID(id: number): void{
        this.id = id;
    }

    getNome(): string { 
        return this.nome; 
    }
    getPrazo(): string { 
        return this.prazo; 
    }
    getStatus(): StatusEtapa { 
        return this.status; 
    }
    getFuncionariosID(): number[] { 
        return [...this.funcionariosID]; 
    }

    getFuncionarios(): Funcionario[]{
        let funcionarios: Funcionario[] = [];
        this.funcionariosID.forEach(id => {
            const funcionario = FuncionarioRepository.findID(id);
            if (funcionario) {
                funcionarios.push(funcionario);
            }
        });
        return funcionarios;
    }

    static empty(): Etapa{
        return new Etapa(0, "", "", StatusEtapa.PENDENTE);
    }

    static params(nome: string, prazo: string, status: StatusEtapa): Etapa{
        return new Etapa(0, nome, prazo, status);
    }
    static fromData(id: number, nome: string, prazo: string, status: StatusEtapa): Etapa{
        return new Etapa(id, nome, prazo, status);
    }

    init():void{
        this.status = StatusEtapa.EM_ANDAMENTO;
    }

    finish():void{
        this.status = StatusEtapa.CONCLUIDA;
    }

    associarFuncionario(id: number): void{
        this.funcionariosID.push(id);
    }

}