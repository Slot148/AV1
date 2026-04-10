import { JsonManager } from "../config/JsonManager";
import TipoAeronave from "../enums/TipoAeronave";
import EtapaRepository from "../repository/EtapaRepository";
import PecaRepository from "../repository/PecaRepository";
import TesteRepository from "../repository/TesteRepository";
import Etapa from "./Etapa";
import Peca from "./Peca";
import Teste from "./Teste";

export default class Aeronave {
    private constructor(
        private codigo: string,
        private modelo: string,
        private tipo: TipoAeronave,
        private capacidade: number,
        private alcance: number,
        private pecasID: number[] = [],
        private etapasID: number[] = [],
        private testesID: number[] = []
    ) {}

    getID(): string{
        return this.codigo;
    }
    setID(codigo: string): void{
        this.codigo = codigo;
    }
    getPecas(): Peca[] {
        let pecas: Peca[] = [];
        this.pecasID.forEach(id => {
            const peca = PecaRepository.findID(id);
            if (peca) {
                pecas.push(peca);
            }
        });
        return pecas;
    }
    getEtapas(): Etapa[]{
        let etapas: Etapa[] = [];
        this.etapasID.forEach(id => {
            const etapa = EtapaRepository.findID(id);
            if(etapa){
                etapas.push(etapa);
            }
        });
        return etapas;
    }
    getTestes(): Teste[]{
        let testes: Teste[] = [];
        this.testesID.forEach(id => {
            const teste = TesteRepository.findID(id);
            if(teste){
                testes.push(teste);
            }
        });
        return testes;
    }

    addPeca(id: number): void{
        this.pecasID.push(id)
    }
    addTeste(id: number): void{
        this.testesID.push(id)
    }
    addEtapa(id: number): void{
        this.etapasID.push(id)
    }


    getCodigo(): string {
        return this.codigo;
    }

    getModelo(): string {
        return this.modelo;
    }

    getTipo(): TipoAeronave {
        return this.tipo;
    }

    getCapacidade(): number {
        return this.capacidade;
    }

    getAlcance(): number {
        return this.alcance;
    }

    getPecasID(): number[] {
        return [...this.pecasID];
    }

    getEtapasID(): number[] {
        return [...this.etapasID];
    }

    getTestesID(): number[] {
        return [...this.testesID];
    }

    exibirDetalhes(): string {
        const pecas = this.getPecas();
        const etapas = this.getEtapas();
        const testes = this.getTestes();
        
        let detalhes = "\n";
        detalhes += "=".repeat(50) + "\n";
        detalhes += `CÓDIGO: ${this.codigo}\n`;
        detalhes += `MODELO: ${this.modelo}\n`;
        detalhes += `TIPO: ${this.tipo}\n`;
        detalhes += `CAPACIDADE: ${this.capacidade} passageiros\n`;
        detalhes += `ALCANCE: ${this.alcance} km\n`;
        detalhes += "-".repeat(50) + "\n";
        detalhes += `PEÇAS (${pecas.length}):\n`;
        pecas.forEach(p => {
            detalhes += `  • ${p.getNome()} - ${p.getStatus()}\n`;
        });
        detalhes += `ETAPAS (${etapas.length}):\n`;
        etapas.forEach(e => {
            detalhes += `  • ${e.getNome()} - ${e.getStatus()}\n`;
        });
        detalhes += `TESTES (${testes.length}):\n`;
        testes.forEach(t => {
            detalhes += `  • ${t.getTipo()} - ${t.getResultado()}\n`;
        });
        detalhes += "=".repeat(50) + "\n";
        return detalhes;
    }


    static empty(): Aeronave {
        return new Aeronave("", "", TipoAeronave.COMERCIAL, 0, 0);
    }
    
    static params(codigo: string, modelo: string, tipo: TipoAeronave, capacidade: number, alcance: number): Aeronave {
        return new Aeronave(codigo, modelo, tipo, capacidade, alcance);
    }
    
    static fromData(codigo: string, modelo: string, tipo: TipoAeronave, capacidade: number, alcance: number, pecasID: number[], etapasID: number[], testesID: number[]): Aeronave{
        return new Aeronave(codigo, modelo, tipo, capacidade, alcance, pecasID, etapasID, testesID);
    }

}