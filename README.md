# Projeto API NODEJS

Esta é a documentação da API para Gerenciamento de Pessoas

Configuração

Para configurar e executar o projeto localmente:

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/projeto-api.git
cd projeto-api
```

2. Instale as dependências:
```bash
npm install
```
# Rotas da API:

 Cadastrar Usuário
- URL: /register 

- Método: POST

- Body da requisição:
```bash
{
   "username": "seu-usuario",
   "password": "sua-senha"
}
```

 Login de Usuário
- URL: /login

- Método: POST

- Body da Requisição:
 ```bash
{
  "username": "seu-usuario",
  "password": "sua-senha"
}
```
Resposta:
 ```bash
{
  "token": "seu-token-jwt"
}
```
Inserir Pessoa

- URL: /pessoa
- Método: POST
- Headers:Authorization: Bearer seu-token-jwt
 - Body: 
 ```bash
 {
  "nome": "João",
  "idade": 30,
  "cargo": "Engenheiro de Software"
}
```
Consultar Todas as Pessoas

- URL: /pessoas
- Método: GET
- Headers: Authorization: Bearer seu-token-jwt

Resposta:
```bash
[
  {
    "id": 1,
    "nome": "João",
    "idade": 30,
    "cargo": "Engenheiro"
  }
]
```
Atualizar Pessoa

- URL: /pessoa
- Método: PUT
- Headers: Authorization: Bearer seu-token-jwt
- Body:
```bash
{
  "id": 1,
  "nome": "João",
  "idade": 31,
  "cargo": "Engenheiro Sênior"
}
```
Deletar Pessoa

- URL: /pessoa
- Método: DELETE
- Headers: Authorization: Bearer seu-token-jwt
- Body:
```bash
{
  "id": 1
}
```

