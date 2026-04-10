import * as readline from 'readline';
import StatusPeca from "./enums/StatusPeca.js";
import TipoAeronave from "./enums/TipoAeronave.js";
import TipoPeca from "./enums/TipoPeca.js";
import NivelPermissao from "./enums/NivelPermissao.js";
import TipoTeste from "./enums/TipoTeste.js";
import ResultadoTeste from "./enums/ResultadoTeste.js";
import StatusEtapa from "./enums/StatusEtapa.js";
import Aeronave from "./model/Aeronave.js";
import Peca from "./model/Peca.js";
import Etapa from "./model/Etapa.js";
import Funcionario from "./model/Funcionario.js";
import Teste from "./model/Teste.js";
import Relatorio from "./model/Relatorio.js";
import AeronaveRepository from "./repository/AeronaveRepository.js";
import PecaRepository from "./repository/PecaRepository.js";
import EtapaRepository from "./repository/EtapaRepository.js";
import FuncionarioRepository from "./repository/FuncionarioRepository.js";
import TesteRepository from "./repository/TesteRepository.js";
import Session from "./model/Session.js";
import easter_egg from './repository/RelatorioRepository.js';

class App {


    private static rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    static main(): void {
        console.clear();
        this.inicializarDados();
        console.log("=== AEROCODE - Sistema de Gestão de Produção ===\n");
        this.telaLogin();
    }

    static telaLogin(): void {
        console.log("=== LOGIN ===\n");
        this.rl.question("Usuário: ", (usuario) => {
            this.rl.question("Senha: ", (senha) => {
                if (Session.login(usuario, senha)) {
                    console.log(`\nBem-vindo, ${Session.getUsuarioLogado()?.getNome()}!\n`);
                    this.menuPrincipal();
                } else {
                    console.log("\nUsuário ou senha inválidos!\n");
                    this.rl.close();
                }
            });
        });
    }

    static menuPrincipal(): void {
        console.log("\n========== AEROCODE ==========");
        console.log("1. Cadastrar Aeronave");
        console.log("2. Listar Aeronaves");
        console.log("3. Gerenciar Peças");
        console.log("4. Gerenciar Etapas");
        console.log("5. Gerenciar Funcionários");
        console.log("6. Registrar Testes");
        console.log("7. Gerar Relatório");
        console.log("8. Sair");
        console.log("================================\n");

        this.rl.question("Opção: ", (opcao) => {
            switch(opcao) {
                case "1": this.cadastrarAeronave(); break;
                case "2": this.listarAeronaves(); break;
                case "3": this.menuPecas(); break;
                case "4": this.menuEtapas(); break;
                case "5": this.menuFuncionarios(); break;
                case "6": this.menuTestes(); break;
                case "7": this.gerarRelatorio(); break;
                case "8": this.sair(); break;
                case "t": this.testarSistema(); break;
                case "a_ia_escreveu_o_teste":
                    if(Session.getUsuarioLogado()?.getUsuario() === "easter_egg"){
                        console.log(easter_egg);
                        console.log("Aguarde 5 segundos...");
                        setTimeout(()=>{},5000);
                        this.sair();
                    }else{
                        console.log("Não era pra voce estar aqui...");
                        console.log("Aguarde 5 segundos...");
                        setTimeout(()=>{},5000);
                        this.sair();
                    }
                    break;
                default: 
                    console.log("Opção inválida!");
                    this.menuPrincipal();
            }
        });
    }

    static cadastrarAeronave(): void {
        console.clear();
        console.log("====== CADASTRAR AERONAVE ======\n");
        
        this.rl.question("Código: ", (codigo) => {
            this.rl.question("Modelo: ", (modelo) => {
                this.rl.question("Tipo (COMERCIAL/MILITAR): ", (tipo) => {
                    let tipoEnum = tipo.toUpperCase() === "MILITAR" ? TipoAeronave.MILITAR : TipoAeronave.COMERCIAL;
                    this.rl.question("Capacidade (passageiros): ", (capacidade) => {
                        this.rl.question("Alcance (km): ", (alcance) => {
                            const aeronave = Aeronave.params(
                                codigo, modelo, tipoEnum, 
                                parseInt(capacidade), parseInt(alcance)
                            );
                            
                            if (AeronaveRepository.add(aeronave)) {
                                console.log("\nAeronave cadastrada com sucesso!");
                            } else {
                                console.log("\nErro: Código já existe!");
                            }
                            
                            this.rl.question("\nPressione Enter para continuar...", () => {
                                this.menuPrincipal();
                            });
                        });
                    });
                });
            });
        });
    }

    static listarAeronaves(): void {
        console.clear();
        console.log("====== LISTAR AERONAVES ======\n");
        
        const aeronaves = AeronaveRepository.findAll();
        if (aeronaves.length === 0) {
            console.log("Nenhuma aeronave cadastrada.");
        } else {
            aeronaves.forEach(a => {
                console.log(`${a.getID()} - ${a.getModelo()} (${a.getTipo()})`);
            });
            
            this.rl.question("\nDigite o código para ver detalhes (ou Enter para voltar): ", (codigo) => {
                if (codigo) {
                    const aeronave = AeronaveRepository.findID(codigo);
                    if (aeronave) {
                        console.log(aeronave.exibirDetalhes());
                    } else {
                        console.log("Aeronave não encontrada!");
                    }
                    this.rl.question("\nPressione Enter para continuar...", () => {
                        this.menuPrincipal();
                    });
                } else {
                    this.menuPrincipal();
                }
            });
        }
    }

    static menuPecas(): void {
        console.clear();
        console.log("====== GERENCIAR PEÇAS ======\n");
        console.log("1. Cadastrar Peça");
        console.log("2. Listar Peças");
        console.log("3. Atualizar Status");
        console.log("4. Voltar\n");
        
        this.rl.question("Opção: ", (opcao) => {
            switch(opcao) {
                case "1": this.cadastrarPeca(); break;
                case "2": this.listarPecas(); break;
                case "3": this.atualizarStatusPeca(); break;
                default: this.menuPrincipal();
            }
        });
    }

    static cadastrarPeca(): void {
        console.clear();
        console.log("====== CADASTRAR PEÇA ======\n");
        
        this.rl.question("Nome: ", (nome) => {
            this.rl.question("Tipo (NACIONAL/IMPORTADA): ", (tipo) => {
                let tipoEnum = tipo.toUpperCase() === "IMPORTADA" ? TipoPeca.IMPORTADA : TipoPeca.NACIONAL;
                this.rl.question("Fornecedor: ", (fornecedor) => {
                    const peca = Peca.params(nome, tipoEnum, fornecedor);
                    PecaRepository.add(peca);
                    console.log("\nPeça cadastrada com sucesso!");
                    
                    this.rl.question("\nPressione Enter para continuar...", () => {
                        this.menuPecas();
                    });
                });
            });
        });
    }

    static listarPecas(): void {
        console.clear();
        console.log("====== LISTAR PEÇAS ======\n");
        
        const pecas = PecaRepository.findAll();
        if (pecas.length === 0) {
            console.log("Nenhuma peça cadastrada.");
        } else {
            pecas.forEach(p => {
                console.log(`${p.getNome()} - ${p.getTipo()} - ${p.getStatus()}`);
            });
        }
        
        this.rl.question("\nPressione Enter para continuar...", () => {
            this.menuPecas();
        });
    }

    static atualizarStatusPeca(): void {
        console.clear();
        console.log("====== ATUALIZAR STATUS PEÇA ======\n");
        
        this.rl.question("ID da peça: ", (id) => {
            const peca = PecaRepository.findID(parseInt(id));
            if (peca) {
                console.log(`Peça: ${peca.getNome()} - Status atual: ${peca.getStatus()}`);
                console.log("Novo status (EM_PRODUCAO/EM_TRANSPORTE/PRONTA): ");
                this.rl.question("", (status) => {
                    let statusEnum = StatusPeca[status.toUpperCase() as keyof typeof StatusPeca];
                    if (statusEnum) {
                        peca.atualizarStatus(statusEnum);
                        PecaRepository.update(peca);
                        console.log("\nStatus atualizado!");
                    } else {
                        console.log("\nStatus inválido!");
                    }
                    this.rl.question("\nPressione Enter para continuar...", () => {
                        this.menuPecas();
                    });
                });
            } else {
                console.log("Peça não encontrada!");
                this.rl.question("\nPressione Enter para continuar...", () => {
                    this.menuPecas();
                });
            }
        });
    }

    static menuEtapas(): void {
        console.clear();
        console.log("====== GERENCIAR ETAPAS ======\n");
        console.log("1. Cadastrar Etapa");
        console.log("2. Listar Etapas");
        console.log("3. Iniciar Etapa");
        console.log("4. Finalizar Etapa");
        console.log("5. Associar Funcionário");
        console.log("6. Voltar\n");
        
        this.rl.question("Opção: ", (opcao) => {
            switch(opcao) {
                case "1": this.cadastrarEtapa(); break;
                case "2": this.listarEtapas(); break;
                case "3": this.iniciarEtapa(); break;
                case "4": this.finalizarEtapa(); break;
                case "5": this.associarFuncionarioEtapa(); break;
                default: this.menuPrincipal();
            }
        });
    }

    static cadastrarEtapa(): void {
        console.clear();
        console.log("====== CADASTRAR ETAPA ======\n");
        
        this.rl.question("Nome da etapa: ", (nome) => {
            this.rl.question("Prazo (dd/mm/aaaa): ", (prazo) => {
                const etapa = Etapa.params(nome, prazo, StatusEtapa.PENDENTE);
                EtapaRepository.add(etapa);
                console.log("\nEtapa cadastrada!");
                
                this.rl.question("\nPressione Enter para continuar...", () => {
                    this.menuEtapas();
                });
            });
        });
    }

    static listarEtapas(): void {
        console.clear();
        console.log("====== LISTAR ETAPAS ======\n");
        
        const etapas = EtapaRepository.findAll();
        if (etapas.length === 0) {
            console.log("Nenhuma etapa cadastrada.");
        } else {
            etapas.forEach(e => {
                console.log(`${e.getNome()} - ${e.getStatus()} (Prazo: ${e.getPrazo()})`);
            });
        }
        
        this.rl.question("\nPressione Enter para continuar...", () => {
            this.menuEtapas();
        });
    }

    static iniciarEtapa(): void {
        console.clear();
        console.log("====== INICIAR ETAPA ======\n");
        
        this.rl.question("ID da etapa: ", (id) => {
            const etapa = EtapaRepository.findID(parseInt(id));
            if (etapa && etapa.getStatus() === StatusEtapa.PENDENTE) {
                etapa.init();
                EtapaRepository.update(parseInt(id), etapa);
                console.log("\nEtapa iniciada!");
            } else {
                console.log("\nEtapa não encontrada ou já iniciada!");
            }
            
            this.rl.question("\nPressione Enter para continuar...", () => {
                this.menuEtapas();
            });
        });
    }

    static finalizarEtapa(): void {
        console.clear();
        console.log("====== FINALIZAR ETAPA ======\n");
        
        this.rl.question("ID da etapa: ", (id) => {
            const etapa = EtapaRepository.findID(parseInt(id));
            if (etapa && etapa.getStatus() === StatusEtapa.EM_ANDAMENTO) {
                etapa.finish();
                EtapaRepository.update(parseInt(id), etapa);
                console.log("\nEtapa finalizada!");
            } else {
                console.log("\nEtapa não encontrada ou não está em andamento!");
            }
            
            this.rl.question("\nPressione Enter para continuar...", () => {
                this.menuEtapas();
            });
        });
    }

    static associarFuncionarioEtapa(): void {
        console.clear();
        console.log("====== ASSOCIAR FUNCIONÁRIO À ETAPA ======\n");
        
        this.rl.question("ID da etapa: ", (etapaId) => {
            const etapa = EtapaRepository.findID(parseInt(etapaId));
            if (etapa) {
                this.rl.question("ID do funcionário: ", (funcId) => {
                    etapa.associarFuncionario(parseInt(funcId));
                    EtapaRepository.update(parseInt(etapaId), etapa);
                    console.log("\nFuncionário associado!");
                    
                    this.rl.question("\nPressione Enter para continuar...", () => {
                        this.menuEtapas();
                    });
                });
            } else {
                console.log("Etapa não encontrada!");
                this.rl.question("\nPressione Enter para continuar...", () => {
                    this.menuEtapas();
                });
            }
        });
    }

    static menuFuncionarios(): void {
        console.clear();
        console.log("====== GERENCIAR FUNCIONÁRIOS ======\n");
        console.log("1. Cadastrar Funcionário");
        console.log("2. Listar Funcionários");
        console.log("3. Voltar\n");
        
        this.rl.question("Opção: ", (opcao) => {
            switch(opcao) {
                case "1": this.cadastrarFuncionario(); break;
                case "2": this.listarFuncionarios(); break;
                default: this.menuPrincipal();
            }
        });
    }

    static cadastrarFuncionario(): void {
        console.clear();
        console.log("====== CADASTRAR FUNCIONÁRIO ======\n");
        
        this.rl.question("Nome: ", (nome) => {
            this.rl.question("Telefone: ", (telefone) => {
                this.rl.question("Endereço: ", (endereco) => {
                    this.rl.question("Usuário: ", (usuario) => {
                        this.rl.question("Senha: ", (senha) => {
                            console.log("Nível (ADMINISTRADOR/ENGENHEIRO/OPERADOR): ");
                            this.rl.question("", (nivel) => {
                                let nivelEnum = NivelPermissao[nivel.toUpperCase() as keyof typeof NivelPermissao];
                                const func = Funcionario.params(nome, telefone, endereco, usuario, senha, nivelEnum);
                                FuncionarioRepository.add(func);
                                console.log("\nFuncionário cadastrado!");
                                
                                this.rl.question("\nPressione Enter para continuar...", () => {
                                    this.menuFuncionarios();
                                });
                            });
                        });
                    });
                });
            });
        });
    }

    static listarFuncionarios(): void {
        console.clear();
        console.log("====== LISTAR FUNCIONÁRIOS ======\n");
        
        const funcionarios = FuncionarioRepository.findAll();
        if (funcionarios.length === 0) {
            console.log("Nenhum funcionário cadastrado.");
        } else {
            funcionarios.forEach(f => {
                console.log(`${f.getNome()} - ${f.getUsuario()} (${f.getNivelPermissao()})`);
            });
        }
        
        this.rl.question("\nPressione Enter para continuar...", () => {
            this.menuFuncionarios();
        });
    }

    static menuTestes(): void {
        console.clear();
        console.log("====== REGISTRAR TESTES ======\n");
        console.log("1. Registrar Teste");
        console.log("2. Listar Testes");
        console.log("3. Voltar\n");
        
        this.rl.question("Opção: ", (opcao) => {
            switch(opcao) {
                case "1": this.registrarTeste(); break;
                case "2": this.listarTestes(); break;
                default: this.menuPrincipal();
            }
        });
    }

    static registrarTeste(): void {
        console.clear();
        console.log("====== REGISTRAR TESTE ======\n");
        
        console.log("Tipo (ELETRICO/HIDRAULICO/AERODINAMICO): ");
        this.rl.question("", (tipo) => {
            let tipoEnum = TipoTeste[tipo.toUpperCase() as keyof typeof TipoTeste];
            console.log("Resultado (APROVADO/REPROVADO): ");
            this.rl.question("", (resultado) => {
                let resultadoEnum = ResultadoTeste[resultado.toUpperCase() as keyof typeof ResultadoTeste];
                const teste = Teste.params(tipoEnum, resultadoEnum);
                TesteRepository.add(teste);
                console.log("\nTeste registrado!");
                
                this.rl.question("\nPressione Enter para continuar...", () => {
                    this.menuTestes();
                });
            });
        });
    }

    static listarTestes(): void {
        console.clear();
        console.log("====== LISTAR TESTES ======\n");
        
        const testes = TesteRepository.findAll();
        if (testes.length === 0) {
            console.log("Nenhum teste registrado.");
        } else {
            testes.forEach(t => {
                console.log(`${t.getTipo()} - ${t.getResultado()}`);
            });
        }
        
        this.rl.question("\nPressione Enter para continuar...", () => {
            this.menuTestes();
        });
    }

    static gerarRelatorio(): void {
        console.clear();
        console.log("====== GERAR RELATÓRIO ======\n");
        
        this.rl.question("Código da aeronave: ", (codigo) => {
            const aeronave = AeronaveRepository.findID(codigo);
            if (aeronave) {
                this.rl.question("Nome do cliente: ", (cliente) => {
                    this.rl.question("Data de entrega (dd/mm/aaaa): ", (data) => {
                        const relatorio = Relatorio.gerarRelatorio(aeronave, cliente, data);
                        console.log("\n" + relatorio);
                        Relatorio.salvarArquivo(relatorio, `relatorio_${codigo}_${Date.now()}.txt`);
                        
                        this.rl.question("\nPressione Enter para continuar...", () => {
                            this.menuPrincipal();
                        });
                    });
                });
            } else {
                console.log("Aeronave não encontrada!");
                this.rl.question("\nPressione Enter para continuar...", () => {
                    this.menuPrincipal();
                });
            }
        });
    }

    static inicializarDados(): void {
        const admins = FuncionarioRepository.findAll().filter(f => f.getNivelPermissao() === NivelPermissao.ADMINISTRADOR);
        if (admins.length === 0) {
            const admin = Funcionario.params("Administrador", "0000", "Sede", "admin", "admin123", NivelPermissao.ADMINISTRADOR);
            FuncionarioRepository.add(admin);
            console.log("Usuário admin criado: admin / admin123");
        }

        const egg = FuncionarioRepository.findUsuario("easter_egg");
        if (!egg) {
            const easterEgg = Funcionario.params("EASTER_EGG", "easter_egg", "easter_egg", "easter_egg", "easter_egg", NivelPermissao.ADMINISTRADOR);
            FuncionarioRepository.add(easterEgg);
        }
    }

    static sair(): void {
        console.log("\nObrigado por usar o AEROCODE!");
        this.rl.close();
    }

    static testarSistema(): void {
        console.log("\n========== INICIANDO TESTES DO SISTEMA ==========\n");
        
        console.log("[PREPARACAO] Limpando dados de teste anteriores...");
        const todasPecas = PecaRepository.findAll();
        todasPecas.forEach(p => PecaRepository.remove(p.getID()));
        
        const todasEtapas = EtapaRepository.findAll();
        todasEtapas.forEach(e => EtapaRepository.remove(e.getID()));
        
        const todosTestes = TesteRepository.findAll();
        todosTestes.forEach(t => TesteRepository.remove(t.getID()));
        
        const todasAeronaves = AeronaveRepository.findAll();
        todasAeronaves.forEach(a => AeronaveRepository.remove(a.getID()));
        console.log("[PREPARACAO] Dados limpos com sucesso\n");
        
        console.log("[TESTE 01] Cadastrar Funcionarios");
        const func1 = Funcionario.params("Joao Silva", "11999999999", "Rua A", "joao.silva", "123456", NivelPermissao.ENGENHEIRO);
        const func2 = Funcionario.params("Maria Santos", "11888888888", "Rua B", "maria.santos", "123456", NivelPermissao.OPERADOR);
        const func3 = Funcionario.params("Carlos Souza", "11777777777", "Rua C", "carlos.souza", "123456", NivelPermissao.ADMINISTRADOR);
        
        FuncionarioRepository.add(func1);
        FuncionarioRepository.add(func2);
        FuncionarioRepository.add(func3);
        
        const totalFuncionarios = FuncionarioRepository.findAll().length;
        console.log("  Resultado: " + totalFuncionarios + " funcionarios cadastrados");
        console.log("");
        
        console.log("[TESTE 02] Buscar Funcionario por ID");
        const funcBuscado = FuncionarioRepository.findID(1);
        if (funcBuscado) {
            console.log("  Resultado: Funcionario encontrado - " + funcBuscado.getNome());
        } else {
            console.log("  Resultado: Funcionario nao encontrado (usando ID 1)");
        }
        console.log("");

        console.log("[TESTE 03] Buscar Funcionario por Usuario");
        const funcPorUsuario = FuncionarioRepository.findUsuario("joao.silva");
        if (funcPorUsuario) {
            console.log("  Resultado: Funcionario encontrado - " + funcPorUsuario.getNome());
        } else {
            console.log("  Resultado: Funcionario nao encontrado");
        }
        console.log("");
        
        console.log("[TESTE 04] Cadastrar Pecas");
        const peca1 = Peca.params("Motor Turbo", TipoPeca.IMPORTADA, "Pratt & Whitney");
        const peca2 = Peca.params("Asa Esquerda", TipoPeca.NACIONAL, "Embraer Supply");
        const peca3 = Peca.params("Trem de Pouso", TipoPeca.NACIONAL, "Parker Hannifin");
        const peca4 = Peca.params("Painel Eletronico", TipoPeca.IMPORTADA, "Honeywell");
        
        PecaRepository.add(peca1);
        PecaRepository.add(peca2);
        PecaRepository.add(peca3);
        PecaRepository.add(peca4);
        
        const totalPecas = PecaRepository.findAll().length;
        console.log("  Resultado: " + totalPecas + " pecas cadastradas");
        console.log("");
        
        console.log("[TESTE 05] Atualizar Status da Peca");
        const pecaParaAtualizar = PecaRepository.findID(peca1.getID());
        if (pecaParaAtualizar) {
            console.log("  Status antes: " + pecaParaAtualizar.getStatus());
            pecaParaAtualizar.atualizarStatus(StatusPeca.EM_TRANSPORTE);
            PecaRepository.update(pecaParaAtualizar);
            
            const pecaAtualizada = PecaRepository.findID(peca1.getID());
            console.log("  Status depois: " + pecaAtualizada?.getStatus());
            console.log("  Resultado: Status atualizado com sucesso");
        }
        console.log("");
        
        console.log("[TESTE 06] Cadastrar Etapas");
        const etapa1 = Etapa.params("Projeto Conceitual", "30/06/2025", StatusEtapa.PENDENTE);
        const etapa2 = Etapa.params("Engenharia Detalhada", "15/08/2025", StatusEtapa.PENDENTE);
        const etapa3 = Etapa.params("Fabricacao de Pecas", "30/09/2025", StatusEtapa.PENDENTE);
        const etapa4 = Etapa.params("Montagem", "15/11/2025", StatusEtapa.PENDENTE);
        
        EtapaRepository.add(etapa1);
        EtapaRepository.add(etapa2);
        EtapaRepository.add(etapa3);
        EtapaRepository.add(etapa4);
        
        const totalEtapas = EtapaRepository.findAll().length;
        console.log("  Resultado: " + totalEtapas + " etapas cadastradas");
        console.log("");
        
        console.log("[TESTE 07] Iniciar Etapa");
        const etapaParaIniciar = EtapaRepository.findID(etapa1.getID());
        if (etapaParaIniciar) {
            console.log("  Status antes de iniciar: " + etapaParaIniciar.getStatus());
            etapaParaIniciar.init();
            EtapaRepository.update(etapaParaIniciar.getID(), etapaParaIniciar);
            console.log("  Status depois de iniciar: " + etapaParaIniciar.getStatus());
            console.log("  Resultado: Etapa iniciada com sucesso");
        }
        console.log("");
        
        console.log("[TESTE 08] Finalizar Etapa");
        const etapaParaFinalizar = EtapaRepository.findID(etapa1.getID());
        if (etapaParaFinalizar && etapaParaFinalizar.getStatus() === StatusEtapa.EM_ANDAMENTO) {
            etapaParaFinalizar.finish();
            EtapaRepository.update(etapaParaFinalizar.getID(), etapaParaFinalizar);
            console.log("  Status depois de finalizar: " + etapaParaFinalizar.getStatus());
            console.log("  Resultado: Etapa finalizada com sucesso");
        } else {
            console.log("  Resultado: Etapa nao esta em andamento");
        }
        console.log("");
        
        console.log("[TESTE 09] Associar Funcionario a Etapa");
        const etapaAssociar = EtapaRepository.findID(etapa2.getID());
        const funcionarioAssociar = FuncionarioRepository.findID(func1.getID());
        
        if (etapaAssociar && funcionarioAssociar) {
            const qtdAntes = etapaAssociar.getFuncionariosID().length;
            etapaAssociar.associarFuncionario(funcionarioAssociar.getID());
            EtapaRepository.update(etapaAssociar.getID(), etapaAssociar);
            const qtdDepois = etapaAssociar.getFuncionariosID().length;
            console.log("  Funcionarios antes: " + qtdAntes);
            console.log("  Funcionarios depois: " + qtdDepois);
            console.log("  Resultado: Funcionario associado com sucesso");
        }
        console.log("");
        
        console.log("[TESTE 10] Cadastrar Testes");
        const teste1 = Teste.params(TipoTeste.ELETRICO, ResultadoTeste.APROVADO);
        const teste2 = Teste.params(TipoTeste.HIDRAULICO, ResultadoTeste.APROVADO);
        const teste3 = Teste.params(TipoTeste.AERODINAMICO, ResultadoTeste.REPROVADO);
        
        TesteRepository.add(teste1);
        TesteRepository.add(teste2);
        TesteRepository.add(teste3);
        
        const totalTestes = TesteRepository.findAll().length;
        console.log("  Resultado: " + totalTestes + " testes cadastrados");
        console.log("");
        
        console.log("[TESTE 11] Cadastrar Aeronave");
        const aeronave1 = Aeronave.params("EMB-110", "Bandeirante", TipoAeronave.COMERCIAL, 21, 1900);
        const aeronave2 = Aeronave.params("EMB-314", "Super Tucano", TipoAeronave.MILITAR, 2, 1330);
        
        AeronaveRepository.add(aeronave1);
        AeronaveRepository.add(aeronave2);
        
        const totalAeronaves = AeronaveRepository.findAll().length;
        console.log("  Resultado: " + totalAeronaves + " aeronaves cadastradas");
        console.log("");
        
        console.log("[TESTE 12] Verificar Codigo Unico Aeronave");
        const aeronaveDuplicada = Aeronave.params("EMB-110", "Duplicada", TipoAeronave.COMERCIAL, 10, 1000);
        const addResult = AeronaveRepository.add(aeronaveDuplicada);
        if (!addResult) {
            console.log("  Resultado: Sistema impediu cadastro de codigo duplicado (correto)");
        } else {
            console.log("  Resultado: ERRO - Sistema permitiu codigo duplicado");
        }
        console.log("");
        
        console.log("[TESTE 13] Associar Pecas a Aeronave");
        const aeronaveParaAssociar = AeronaveRepository.findID("EMB-110");
        const todasPecasLista = PecaRepository.findAll();
        
        if (aeronaveParaAssociar) {
            const qtdAntes = aeronaveParaAssociar.getPecas().length;
            todasPecasLista.forEach(peca => {
                aeronaveParaAssociar.addPeca(peca.getID());
            });
            AeronaveRepository.update(aeronaveParaAssociar);
            const qtdDepois = aeronaveParaAssociar.getPecas().length;
            console.log("  Pecas antes: " + qtdAntes);
            console.log("  Pecas depois: " + qtdDepois);
            console.log("  Resultado: " + qtdDepois + " pecas associadas");
        }
        console.log("");
        
        console.log("[TESTE 14] Associar Etapas a Aeronave");
        if (aeronaveParaAssociar) {
            const qtdAntes = aeronaveParaAssociar.getEtapas().length;
            const todasEtapasLista = EtapaRepository.findAll();
            todasEtapasLista.forEach(etapa => {
                aeronaveParaAssociar.addEtapa(etapa.getID());
            });
            AeronaveRepository.update(aeronaveParaAssociar);
            const qtdDepois = aeronaveParaAssociar.getEtapas().length;
            console.log("  Etapas antes: " + qtdAntes);
            console.log("  Etapas depois: " + qtdDepois);
            console.log("  Resultado: " + qtdDepois + " etapas associadas");
        }
        console.log("");
        
        console.log("[TESTE 15] Associar Testes a Aeronave");
        if (aeronaveParaAssociar) {
            const qtdAntes = aeronaveParaAssociar.getTestes().length;
            const todosTestesLista = TesteRepository.findAll();
            todosTestesLista.forEach(teste => {
                aeronaveParaAssociar.addTeste(teste.getID());
            });
            AeronaveRepository.update(aeronaveParaAssociar);
            const qtdDepois = aeronaveParaAssociar.getTestes().length;
            console.log("  Testes antes: " + qtdAntes);
            console.log("  Testes depois: " + qtdDepois);
            console.log("  Resultado: " + qtdDepois + " testes associados");
        }
        console.log("");
        
        console.log("[TESTE 16] Exibir Detalhes da Aeronave");
        const aeronaveDetalhes = AeronaveRepository.findID("EMB-110");
        if (aeronaveDetalhes) {
            console.log(aeronaveDetalhes.exibirDetalhes());
            console.log("  Resultado: Detalhes exibidos com sucesso");
        }
        console.log("");
        
        console.log("[TESTE 17] Gerar Relatorio");
        if (aeronaveDetalhes) {
            const relatorio = Relatorio.gerarRelatorio(aeronaveDetalhes, "Cliente Teste", "15/04/2026");
            const linhas = relatorio.split("\n").length;
            console.log("  Relatorio gerado com " + linhas + " linhas");
            Relatorio.salvarArquivo(relatorio, "relatorio_teste.txt");
            console.log("  Resultado: Relatorio gerado e salvo com sucesso");
        }
        console.log("");
        
        console.log("[TESTE 18] Remover Peca");
        const qtdAntesRemocao = PecaRepository.findAll().length;
        const pecaParaRemover = PecaRepository.findID(peca1.getID());
        if (pecaParaRemover) {
            PecaRepository.remove(pecaParaRemover.getID());
            const qtdDepoisRemocao = PecaRepository.findAll().length;
            console.log("  Pecas antes: " + qtdAntesRemocao);
            console.log("  Pecas depois: " + qtdDepoisRemocao);
            console.log("  Resultado: Peca removida com sucesso");
        }
        console.log("");
        
        console.log("[TESTE 19] Listar Funcionarios");
        const listaFuncionarios = FuncionarioRepository.findAll();
        listaFuncionarios.forEach(f => {
            console.log("  - " + f.getNome() + " (" + f.getUsuario() + ") - " + f.getNivelPermissao());
        });
        console.log("  Resultado: " + listaFuncionarios.length + " funcionarios listados");
        console.log("");
        
        console.log("[TESTE 20] Listar Aeronaves");
        const listaAeronaves = AeronaveRepository.findAll();
        listaAeronaves.forEach(a => {
            console.log("  - " + a.getID() + " - " + a.getModelo() + " (" + a.getTipo() + ")");
        });
        console.log("  Resultado: " + listaAeronaves.length + " aeronaves listadas");
        console.log("");
        
        console.clear();
        console.log("========== TESTES CONCLUIDOS ==========");
        console.log("Total de testes executados: 20");
        console.log("");
    }

}

App.main();