import ResultadoTeste from "../enums/ResultadoTeste.js";
import TipoTeste from "../enums/TipoTeste.js";

export default class Teste{
    constructor(
        private id: number,
        private tipo: TipoTeste,
        private resultado: ResultadoTeste
    ){}

    getID(): number{
        return this.id;
    }
    setID(id: number): void{
        this.id = id;
    }

    getTipo(): TipoTeste { 
        return this.tipo; 
    }
    getResultado(): ResultadoTeste { 
        return this.resultado; 
    }

    static params(tipo: TipoTeste, resultado: ResultadoTeste): Teste{
        const id = Date.now();
        return new Teste(id, tipo, resultado);
    }

    static fromData(id: number, tipo: TipoTeste, resultado: ResultadoTeste): Teste{
        return new Teste(id, tipo, resultado);
    }
}