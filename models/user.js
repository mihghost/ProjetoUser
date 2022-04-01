

//Classe do usuário
class User {

    

    //o construtor recebe como parâmetros as variáveis para se criar o objeto usuário
    //o this representa um atributo que recebe a variável, ou seja estamos inicializando os valores
    //todos os atributos definidos dentro da classe podem ser acessados por métodos da classe
    constructor(name, gender, birth, country, email, password, photo, admin) {
 
        this._id;
        this._name = name;
        this._gender = gender; //modificadores de acesso, chamado de encapsulamento, está deixando as propriedades privadas
        this._birth = birth;
        this._country = country;
        this._email = email;
        this._password = password;
        this._photo = photo;
        this._admin = admin;
        this._register = new Date();
 
    }
 
    get id() {
        return this._id;
    }
 
    get name() {
        return this._name;
    }
 
    get gender() {
        return this._gender;
    }
 
    get birth() {
        return this._birth;
    }
 
    get country() {
        return this._country;
    }
 
    get email() {
        return this._email;
    }
 
    get password() {
        return this._password;
    }
 
    get photo() {
        return this._photo;
    }
 
    get admin() {
        return this._admin;
    }
 
    get register() {
        return this._register;
    }
 
    set photo(value) {
        this._photo = value;
    }
 
    loadFromJSON(json) {//para cada nome encontrado no json, o for in serve para percorrer objetos
 
        for (let name in json) {

            //se for o campo register quer dizer que é uma data, então
            switch (name) {
 
                case '_register':
                    this[name] = new Date(json[name]);
                break;
 
                default: 
                    this[name] = json[name];//para cada campo na posição faz a troca com os dados do sessionStorage naquela posição
            }
 
        }
 
    }
 
     //Método para pegar os dados do localStorage
    static getUsersStorage(){
 
        let users = [];
         //array de objetos usuários

        //temos que verificar se já existe algum dado no sessionStorage ou localStorage, lembrando que retorna em forma de string
 
        if (localStorage.getItem("users")) {
 
            users = JSON.parse(localStorage.getItem("users"))//faz um parse com o array que já está guardado dentro do localStorage
        }
 
        return users;
 
    }
 
    //método para fazer novos Ids
    getNewId() {

        let usersID = parseInt(localStorage.getItem("usersID"));//guarda o último id gerado
 
        if (!usersID > 0) usersID = 0; //se ele não for maio que zero, significa que ele não existe
 
        usersID++;

        localStorage.setItem("usersID", usersID);//guardamos o ID de volta no localStorage
 
        return usersID;
 
    }
 
    save() {
 
        let users = User.getUsersStorage();//retorna todos os usuários que estão no local Storage e cria um array
 
        if (this.id > 0) {//existe um id no objeto?
 
            users.map(u => {
 
                if (u._id == this.id) {
 
                    Object.assign(u, this); 
 
                }
 
                return u;
 
            });
            
        }
        else {//se não tiver o meu id precisamos gerar um novo id para esse usuário
 
            this._id = this.getNewId();
 
            users.push(this); //adiciona dentro do array os dados do usuário recebido
 
        }
 
        localStorage.setItem("users", JSON.stringify(users));//converte de novo para string e guarda novamente na chave "users"do localStorage
        
    }

    remove(){

        let users = User.getUsersStorage();//retorna todos os usuários que estão no local Storage e cria um array

        //recebe os dados e a posição
        users.forEach((userData, index) => {

            if(this._id == userData._id){//se eles forem iguais achamos o que queremos excluir

                //para remover um item do arrauy usamos o splice, e passamos o index que queremos remover e a quantidade
                users.splice(index, 1);

            }
            
        });

        
        //agora que removemos do array é só colocar o array de volta do localStore
        localStorage.setItem("users", JSON.stringify(users));//converte de novo para string e guarda novamente na chave "users"do localStorage

    }
 
}
