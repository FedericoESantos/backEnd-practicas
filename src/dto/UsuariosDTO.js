export class UsuariosDTO{
    constructor(usuario){
        this.firstName = usuario.nombre;
        this.lastName = usuario.apellido?usuario.apellido:null;
        this.fullName = usuario.apellido?`${this.firstName} ${this.lastName}`:this.firstName;
        this.email = usuario.email;
        this.rol = "user";
    }
}
