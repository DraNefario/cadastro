<?php
// Configurações do Banco de Dados
$host = 'localhost'; // ou o endereço do seu servidor de banco de dados
$username = 'seu_usuario'; // substitua pelo seu nome de usuário do banco de dados
$password = 'sua_senha'; // substitua pela sua senha do banco de dados
$database = 'seu_banco_de_dados'; // substitua pelo nome do seu banco de dados

// Conectando ao Banco de Dados
$conn = new mysqli($host, $username, $password, $database);

// Verifica a Conexão
if ($conn->connect_error) {
    die("Erro na conexão: " . $conn->connect_error);
}

// Recebe os dados do formulário
$nome = $_POST['nome'];
$email = $_POST['email'];
$telefone = $_POST['telefone'];
$senha = $_POST['senha'];

// Prepara e executa a consulta SQL para inserir os dados na tabela
$sql = "INSERT INTO usuarios (nome, email, telefone, senha) VALUES ('$nome', '$email', '$telefone', '$senha')";

if ($conn->query($sql) === TRUE) {
    echo "Cadastro realizado com sucesso!";
} else {
    echo "Erro ao cadastrar: " . $conn->error;
}

// Fecha a Conexão
$conn->close();
?>
