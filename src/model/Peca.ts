import StatusPeca from "../enums/StatusPeca.js";
import TipoPeca from "../enums/TipoPeca.js";

export default class Peca{
    constructor(
        private id: number,
        private nome: string,
        private tipo: TipoPeca,
        private fornecedor: string,
        private status: StatusPeca
    ){}

    getID(){
        return this.id;
    }
    setID(id: number){
        this.id = id;
    }

    getNome(): string {
        return this.nome; 
    }
    getTipo(): TipoPeca { 
        return this.tipo; 
    }
    getFornecedor(): string { 
        return this.fornecedor; 
    }
    getStatus(): StatusPeca { 
        return this.status; 
    }

    static empty(): Peca{
        return new Peca(0, "", TipoPeca.NACIONAL, "(☉_☉|☉_☉|☉_☉)", StatusPeca.EM_PRODUCAO);
    }

    static params(nome: string, tipo: TipoPeca, fornecedor: string): Peca{
        return new Peca(0, nome, tipo, fornecedor, StatusPeca.EM_PRODUCAO);
    }
    static fromData(id: number, nome: string, tipo: TipoPeca, fornecedor: string, status: StatusPeca): Peca{
        return new Peca(id, nome, tipo, fornecedor, status);
    }

    atualizarStatus(status: StatusPeca): void{
        this.status = status;
    }
}