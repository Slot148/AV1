import NivelPermissao from "../enums/NivelPermissao.js";

export default class Funcionario{
    constructor(    
        private id: number,
        private nome: string,
        private telefone: string,
        private endereco: string,
        private usuario: string,
        private senha: string,
        private nivelPermissao: NivelPermissao
    ){}

    getID(): number{
        return this.id;
    }
    setID(id: number): void{
        this.id = id;
    }

    getSenha(): string{
        return this.senha;
    }

    getNivelPermissao(): NivelPermissao{
        return this.nivelPermissao;
    }

    getNome(): string { 
        return this.nome; 
    }
    getUsuario(): string { 
        return this.usuario; 
    }
    getTelefone(): string { 
        return this.telefone; 
    }
    getEndereco(): string { 
        return this.endereco; 
    }

    static empty(): Funcionario{
        console.log(`(☉_☉|☉_☉|☉_☉)`);
        return new Funcionario(0, "", "", "", "", "", NivelPermissao.OPERADOR);
    }

    static params(nome: string, telefone: string, endereco: string, usuario: string, senha: string, nivel: NivelPermissao): Funcionario{
        return new Funcionario(0, nome, telefone, endereco, usuario, senha, nivel);
    }
    
    static fromData(id: number, nome: string, telefone: string, endereco: string, usuario: string, senha: string, nivel: NivelPermissao): Funcionario{
        return new Funcionario(id, nome, telefone, endereco, usuario, senha, nivel);
    }
}