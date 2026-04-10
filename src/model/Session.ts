import NivelPermissao from "../enums/NivelPermissao";
import FuncionarioRepository from "../repository/FuncionarioRepository";
import Funcionario from "./Funcionario";

export default class Session{
    private static sessionUser: Funcionario | null = null;

    static login(usuario: string, senha: string): boolean{
        const funcionario = FuncionarioRepository.findUsuario(usuario);
        if(funcionario && funcionario.getSenha() === senha){
            this.sessionUser = funcionario;
            return true;
        }
        return false;
    }

    static logout(): void{
        this.sessionUser = null
    }

    static isLoggedIn(): boolean{
        if(this.sessionUser){
            return true;
        }
        return false;
    }

    static getUsuarioLogado(): Funcionario | null{
        return this.sessionUser;
    }

    static hasPermission(nivel: NivelPermissao):boolean{
        let f: Funcionario = this.sessionUser!;
        if(f.getNivelPermissao() === nivel){
            return true;
        }
        return false;
    }

    static isAdmin(): boolean{
        let f: Funcionario = this.sessionUser!;
        if(f.getNivelPermissao() === NivelPermissao.ADMINISTRADOR){
            return true;
        }
        return false;
    }
}