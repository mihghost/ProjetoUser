class UserController {

    constructor (formIdCreate, formIdUpdate, tableId){//recebe o id do formulário que iremos controlar

        this.formEl = document.getElementById(formIdCreate);//acessa no HTML o elemento com esse id e o guarda no atributo formEl
        this.formUpdateEl = document.getElementById(formIdUpdate);
        this.tableEl = document.getElementById(tableId);

       //ao criarmos a tela já irá aparecer os botões
        this.onSubmit();
        this.onEdit();
        this.selectAll();

    }

    onEdit(){
         //localiza o id e o botão cancela e adiciona o evento de clique e a função para o evento
        document.querySelector("#box-user-update .btn-cancel" ).addEventListener("click", e=>{

            this.showPanelCreate();

        });

        this.formUpdateEl.addEventListener("submit", event =>{


            event.preventDefault();//Para não acontecer o f5 da página

            let btn = this.formUpdateEl.querySelector("[type = submit]");// No elemento formulário manda procurar o elemento que é do tipo submit

            btn.disabled = true; //desabilita o botão de enviar
            
            //O clique do botão que vai disparar a chamada do método getValues
            // variável vaalues recebe o objeto retornado pela função getValues
            //o retorno da função getValues vai ser inserido pelo método addLine

            let values = this.getValues(this.formUpdateEl);

            let index =  this.formUpdateEl.dataset.trIndex;
            
            let tr = this.tableEl.rows[index];

            let userOld = JSON.parse(tr.dataset.user);


            //precisamos juntar a foto nova com a antiga, juntando os dois objetos
            let result = Object.assign({}, userOld, values);//a função assign faz com que os objetos mais à direita substitui os objetos da esquerda
            //nesse caso, values substitui userOld e userOld substitui o objeto vazio

            
            this.getPhoto(this.formUpdateEl).then(
                (content) =>{

                    if (!values.photo){

                        result._photo = userOld._photo;

                    } else {

                        result._photo = content;

                    }
                
                let user = new User(); //igual a um novo usuário

                user.loadFromJSON(result);//passamos o nosso Json e carrega os dados dentro do objeto e agora temos o objeto para passar para o getTr()

                user.save();

                this.getTr(user, tr);
    
                this.updateCount();
                    
                    this.formUpdateEl.reset();//limpa o formulário antes de enviar

                    btn.disabled = false;//habilita o botão de enviar

                    this.showPanelCreate();

                }, 
            
                (e) =>{

                    console.error(e);


                }
            );

            

        });

    }

    onSubmit(){//método para enviar o formulário

        //formulário selecionado que guardamos no atributo this.formEl
        this.formEl.addEventListener("submit", event => {

            event.preventDefault();//Para não acontecer o f5 da página

            let btn = this.formEl.querySelector("[type = submit]");// No elemento formulário manda procurar o elemento que é do tipo submit

            btn.disabled = true; //desabilita o botão de enviar
            
            //O clique do botão que vai disparar a chamada do método getValues
            // variável vaalues recebe o objeto retornado pela função getValues
            //o retorno da função getValues vai ser inserido pelo método addLine

            let values = this.getValues(this.formEl);

            if(!values) return false;

            this.getPhoto(this.formEl).then(
                (content) =>{

                    values.photo = content;

                    //this.insert(values);

                    values.save();
                
                    this.addLine(values);
                    
                    this.formEl.reset();//limpa o formulário antes de enviar

                    btn.disabled = false;//habilita o botão de enviar

                }, 
            
                (e) =>{

                    console.error(e);


                }
            );
        
        });

    }

    //método que vai ler o conteúdo da foto

    getPhoto(formEl){

        return new Promise((resolve, reject) => {// quando der certo executa o resolve e erro o reject

            let fileReader = new FileReader(); //FileReader é um objeto, sendo assim usamos o new pois invocamos o método construtor dele


            //filtra só o elemento que é o campo da foto
            let elements = [...formEl.elements].filter(item => {//usamos o método do array filter que recebe cada item desse array 
    
                if (item.name === 'photo'){ //retorna apenas se item.name for igual a nossa foto
    
                    return item;
                }
                   
    
            });
    
            let file = elements[0].files[0];//usamos o [0] para acessar o array na primeiro posição
    
            fileReader.onload = () => {//quando terminar de carregar a imagem executa essa função
    
                
                resolve(fileReader.result);
    
            };

            fileReader.onerror = (e) =>{

                reject(e); //quando retorna algum erro

            };

            if(file){
                fileReader.readAsDataURL(file);
            }
            else{
                resolve('dist/img/boxed-bg.jpg');//arquivo padrão de imagem
            }
    

        });

  
    }


    getValues(formEl){ //método para pegar os valores do formulário

        let user = {};//obejeto JSON que só existe dentro desse método

        let isValid = true; //para saber se o formulário está válido 

        //pegamos o nosso formuulário acima, o this.formEl, usamos o this pq estamos dentro de outro método
        // e vamos percorrer os filhos desse formulário
        //podemos acessar os elementos que são de formulário que estão dentro do nosso formulário
        //lá dentro temos um nó chamado elements que é um array com cada um dos campos do formulário
        //então vamos fazer um for dentro desse nó chamado elements
        //assim:




        [...formEl.elements].forEach(function(field, index){//para cada campo do formulário executa a rotina abaixo //recebe como parâmetro uma variável que será o campo do formulário e o indice
                                                                

            //ou

            //Array.from(this.formEl.elements).forEach(function(field, index){


            //queremos procurar dentro desses campos, que sãos os campos obrigatórios, se o campo que está passando no forEach está dentro desse array
            //se o index do que procuramos não estiver no array, temos como retorno o -1, então queremos saber se o index of do array é >= 0
            //onde temos o nome do campo que tá passando dentro do forEach é o field.name 
            //!field.value significa que está vazio, não tem valor
            if (['name', 'email', 'password'].indexOf(field.name) > -1 && !field.value){

            //para mostrar o erro precisamos acessar o elemento pai, o formGroup e adicionar uma classe css, a classe error

                field.parentElement.classList.add("has-error");//acessa o pai e dentro dele tem uma propriedade classList que é uma coleção, é é um objeto, então temo métodos, nesse caso usamos o método add para adicionar a classe de error

                isValid = false;


            }

            if (field.name == "gender") {
    
                if (field.checked) {
                    //o que está entre colchetes é o nome que será inserido na propriedade do json
                    //o valor que será colocado na propriedade nome do json é o valor do field
                    user[field.name] = field.value;
                }
    
            } else if(field.name === "admin"){

                user[field.name] = field.checked;

            }else{
    
                user[field.name] = field.value;
    
            }
    
        });

        //antes de enviar os valores fazemos uma validação

        if(!isValid){//se não for válido

            return false; //para a execução
            
        }

        //A função getValues retorna o usuário
    
        return new User(//retorna o objeto que foi feito a partir da classe User
            user.name, 
            user.gender, 
            user.birth, 
            user.country, 
            user.email, 
            user.password, 
            user.photo, 
            user.admin
        );

    }

/*
    //Método para pegar os dados do sessionStorage
    getUsersStorage(){

        let users = []; //array de objetos usuários

        //temos que verificar se já existe algum dado no sessionStorage ou localStorage, lembrando que retorna em forma de string
        if (localStorage.getItem("users")){

            users = JSON.parse(localStorage.getItem("users")); //faz um parse com o array que já está guardado dentro do sessionStorage

        }
        return users;


    }

    */

    //Método para listar todos os dados que já estão no nosso sessionStorage
    selectAll(){

        let users = User.getUsersStorage();

        //passa usuário por usuário e adiciona uma nova linha para cada um
        users.forEach(dataUser=>{

            let user = new User();

            user.loadFromJSON(dataUser); //método que ensina a carregar a partir de um JSON  e passamos os dados vindo do sessionStorage

            this.addLine(user);

        });


    }
    


    //Função que insere as linhas com os dados do usuário na tabela
    addLine(dataUser) {//lembrando que dataUser é o objeto JSON

        let tr = this.getTr(dataUser);//cria uma tr nova

        this.tableEl.appendChild(tr);//adiciona uma linha ao final da tabela

        this.updateCount();

    }


    //método para criar as linhas
    getTr(dataUser, tr = null){//o parâmetro tr aqui é opcional, pois podemos estar tanto criando ou editando uma linha


        //se tr for igual a null, criamos uma linha nova
        if(tr ===null){
            tr = document.createElement('tr');
        }
        
        //vamos guardar os dados do nosso objeto usuário
        //vamos colocar dataset para esses dados, lembrando que user é um nome qualquer escolhido por mim
        //precisamos passar os dados para string por causa do dataset, então passamos os dados JSON para string JSON
        //****Futuramente iremos fazer com que a string vire um objeto de novo
        tr.dataset.user = JSON.stringify(dataUser);



        tr.innerHTML =  `
        
            <td><img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm"></td>
            <td>${dataUser.name}</td>
            <td>${dataUser.email}</td>
            <td>${(dataUser.admin)? 'Sim' : 'Não'}</td>
            <td>${Utils.dateFormat(dataUser.register)}</td>
            <td>
                <button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>
                <button type="button" class="btn btn-danger btn-delete btn-xs btn-flat">Excluir</button>
            </td>
    
        `;

        this.addEventsTr(tr);

        return tr;

    }

    addEventsTr(tr){

        tr.querySelector(".btn-delete").addEventListener("click", e=>{


            if(confirm("Deseja realmente excluir?")){

                let user = new User();//chama o construtor

                user.loadFromJSON(JSON.parse(tr.dataset.user));//pega o json que está guardado dentro do elemento com o dataset e colocamos dentro do objeto novamente

                user.remove();//remove do localStorage

                tr.remove(); //exclui a linha

                this.updateCount();
                
            }



        });

        //pegamos a linha inteira, o tr, e procuramos pelo botão editar desta linha específica e ediciona o evento de clique e criamos uma função para receber o evento
        tr.querySelector(".btn-edit").addEventListener("click", e=>{

        //O for in é um laço para percorrer objetos
        //Dentro do JSON, o nome dos valores dentro do objeto estão com _ no começo
        //então fazemos um for in nele, ou seja, passar propriedade por propriedade pegando o nome e o valor dela
        //e procurando esse nome sem o _ no nosso formulário
        
        let json = JSON.parse(tr.dataset.user);
        

        //dentro do dataset do meu formulário vamos guardar o trIndex(nome qualquer dado por mim), 
        //então precisamos pegar o índice da minha linha com o método sectionRowIndex, e pego esse valor e coloco dentro do dataset do formulário
        this.formUpdateEl.dataset.trIndex = tr.sectionRowIndex; 

        for(let name in json){

            //vamos procurar qual é o campo que o nome desse campo comece com o nome que está vindo no JSON, que é o nome da propriedade do JSON
            //mas como a propriede do JSON tem um _ no começo, precisamos trocar, toda vez que encontrar um _, se troca por nada ""
           let field =  this.formUpdateEl.querySelector("[name=" + name.replace("_", "") + "]");

           if (field){//se esse campo existir 

                switch(field.type){

                    case 'file':
                        continue;

                    break;

                    case 'radio':
                        //o value tem que ser exatamente o mesmo valor do que estamos procurando aqui
                        //dentro da vaiável do nosso objeto ela vai retornar M ou F
                        //RESUMINDO, queremos localizar qual é o meu input do tipo radio que tem 
                        //o nome gender e e o value M ou F
                        field = this.formUpdateEl.querySelector("[name=" + name.replace("_", "") + "][value="+ json[name] + "]");
                        //após localizar esse campo, o chequed fica igual a true
                        field.checked = true;
                    break;

                    case 'checkbox':
                        field.checked = json[name]; //colocamos o valor na propiredade checked
                    break;

                    default:
                        
                        field.value = json[name]; //lembrando que name faz papel da posição do vetor, o índice
                        //então o que realmente está acontecendo é
                        //o valor do campo vai receber o valor da propriedade JASON que está na posição [name]
                        


                }

               
                 

           }
          

        }

        this.formUpdateEl.querySelector(".photo").src = json._photo;//dentro do formUpdate procuramos a imagem que tem a classe photo
        //ao localizá-la trocamos o atributo src pelo valor de json._photo

        this.showPanelUpdate();
        


    });

    


        

    }


    showPanelCreate(){//função para mostrar o painel de edição

        document.querySelector("#box-user-create").style.display = "block";//localiza o id e coloca o botão  habilitado
        document.querySelector("#box-user-update").style.display = "none";//localiza o id e coloca o botão não habilitado

    }

    showPanelUpdate(){//função para mostrar o painel de edição

        document.querySelector("#box-user-create").style.display = "none";//localiza o id e coloca o botão não habilitado
        document.querySelector("#box-user-update").style.display = "block";//localiza o id e coloca o botão habilitado


        
    }
    updateCount(){

        let numberUsers = 0;
        let numberAdmin = 0;

        //para saber a quantidade de linhas dentro da tabela, temos o ChildElementCount que pega a quantidade
        //mas temos que passar em linha por linha para sabermos se é um usuário normal ou um admim, aí usamos o children que tem cada elemento de fato
        //assim: this.tableEl.children, mas isso não é um array, é uma coleção, então não podemos fazer um forEach
        //assim, temos que convertê-lo para array
        //agora temos que passar cada uma das tr dentro do forEach, ficando assim:


        [...this.tableEl.children].forEach(tr =>{

            numberUsers++;

           let user =  JSON.parse(tr.dataset.user);//interpreta a string e transforma em um objeto real

           if(user._admin) numberAdmin++;//usando o _pois não estamos instanciando um novo objeto, estamos apenas pegando do JSON original

        })
        //terminando o forEach, concluimos a contagem e sabemos quantos usuários são administradores
        //vamos mandar para a tela essas informações

        document.querySelector('#number_users').innerHTML = numberUsers;
        document.querySelector('#number_users_admin').innerHTML = numberAdmin;



    }


}