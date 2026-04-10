import * as fs from 'fs';
import * as path from 'path';
import Aeronave from "./Aeronave.js";

export default class Relatorio{
    static gerarRelatorio(aeronave: Aeronave, cliente: string, dataEntrega: string): string {
        const pecas = aeronave.getPecas();
        const etapas = aeronave.getEtapas();
        const testes = aeronave.getTestes();
        
        let relatorio = "";
        relatorio += "=".repeat(60) + "\n";
        relatorio += "RELATÓRIO FINAL - AERONAVE PRONTA PARA ENTREGA\n";
        relatorio += "=".repeat(60) + "\n\n";
        
        relatorio += "DADOS DA AERONAVE:\n";
        relatorio += `  Código: ${aeronave.getID()}\n`;
        relatorio += `  Modelo: ${aeronave.getModelo()}\n`;
        relatorio += `  Tipo: ${aeronave.getTipo()}\n`;
        relatorio += `  Capacidade: ${aeronave.getCapacidade()} passageiros\n`;
        relatorio += `  Alcance: ${aeronave.getAlcance()} km\n\n`;
        
        relatorio += `CLIENTE: ${cliente}\n`;
        relatorio += `DATA DE ENTREGA: ${dataEntrega}\n\n`;
        
        relatorio += "-".repeat(60) + "\n";
        relatorio += "ETAPAS REALIZADAS:\n";
        etapas.forEach((etapa, i) => {
            relatorio += `  ${i+1}. ${etapa.getNome()} - ${etapa.getStatus()} (Prazo: ${etapa.getPrazo()})\n`;
        });
        
        relatorio += "\nPEÇAS UTILIZADAS:\n";
        pecas.forEach((peca, i) => {
            relatorio += `  ${i+1}. ${peca.getNome()} - ${peca.getTipo()} - ${peca.getFornecedor()} (${peca.getStatus()})\n`;
        });
        
        relatorio += "\nRESULTADOS DOS TESTES:\n";
        testes.forEach((teste, i) => {
            relatorio += `  ${i+1}. ${teste.getTipo()} - ${teste.getResultado()}\n`;
        });
        
        relatorio += "\n" + "=".repeat(60) + "\n";
        relatorio += "Aeronave aprovada para entrega!\n";
        relatorio += "=".repeat(60) + "\n";
        
        return relatorio;
    }

    static salvarArquivo(conteudo: string, nomeArquivo: string): void {
        const dir = "./relatorios";
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        
        const filePath = path.join(dir, nomeArquivo);
        fs.writeFileSync(filePath, conteudo, 'utf-8');
        console.log(`Relatório salvo em: ${filePath}`);
    }
}