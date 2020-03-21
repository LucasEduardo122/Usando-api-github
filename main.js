import api from './api';

class Api {
    constructor() {
        this.repository = [];

        this.formElement = document.getElementById('repo-form');
        this.inpurElement = document.getElementById('repositorio');
        this.ulElement = document.getElementById('repo-list');
        this.selectElement = document.getElementById('tipo');
        this.cancelarRefresh();
    }

    cancelarRefresh() {
        this.formElement.onsubmit = event => this.addRepo(event);
    }

    loading(carregar = true) {
        if (carregar === true) {
            let car = document.createElement('span')
            car.appendChild(document.createTextNode('Carregando'));
            car.setAttribute('id', 'Carregamento');

            this.formElement.appendChild(car);
        } else {
            document.getElementById('Carregamento').remove();
        }
    }

    async addRepo(event) {
        event.preventDefault();

        console.log(this.selectElement.value);
        if (this.selectElement.value === 'User') {
            const user = this.inpurElement.value;

            this.loading(true);

            const response = await api.get(`/users/${user}`)

            const { login, description, html_url, avatar_url } = response.data;

            this.repository.push({
                login,
                description,
                html_url,
                avatar_url,
            });

            this.render();

        } else if(this.selectElement.value === 'Repo') {
            const username = this.inpurElement.value;

            this.loading(true)

            const response = await api.get(`/repos/${username}`)

            const { name, description, html_url, owner: { avatar_url } } = response.data;

            this.repository.push({
                name,
                description,
                html_url,
                avatar_url,
            });

            this.render();
        }
    }

    render() {

        this.ulElement.innerHTML = '';
        this.inpurElement.value = '';

        this.loading(false);

        this.repository.forEach(repo => {
            let imgEl = document.createElement('img');
            imgEl.setAttribute('src', repo.avatar_url);

            let strongEl = document.createElement('strong');
            strongEl.appendChild(document.createTextNode(repo.name || repo.login));

            let pEl = document.createElement('p');
            pEl.appendChild(document.createTextNode(repo.description || "Não disponível"));

            let aEl = document.createElement('a');
            
            aEl.setAttribute('target', '_blank');
            aEl.setAttribute('href', repo.html_url);
            aEl.appendChild(document.createTextNode('Acessar'));

            let liEl = document.createElement('li');

            liEl.appendChild(imgEl);
            liEl.appendChild(strongEl);
            liEl.appendChild(pEl);
            liEl.appendChild(aEl);

            this.ulElement.appendChild(liEl);
        });
    }
}

new Api();