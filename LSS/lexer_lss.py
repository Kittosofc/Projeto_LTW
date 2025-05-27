import ply.lex as lex

# Lista de palavras reservadas baseadas no documento LSS
reserved = {
    # Palavras-chave para definição de funções e estruturas
    'def': 'DEF',
    
    # Palavras-chave para operações principais
    'agendar': 'AGENDAR',
    'indisponibilidade': 'INDISPONIBILIDADE',
    'disponibilidade': 'DISPONIBILIDADE',
    'servico': 'SERVICO',
    'consulta': 'CONSULTA',
    'batch': 'BATCH',
    'ferias': 'FERIAS',
    
    # Palavras-chave para propriedades e atributos
    'tipo': 'TIPO',
    'cliente': 'CLIENTE',
    'data': 'DATA',
    'prioridade': 'PRIORIDADE',
    'motivo': 'MOTIVO',
    'duracao': 'DURACAO',
    'dias': 'DIAS',
    'horas': 'HORAS',
    'funcionario': 'FUNCIONARIO',
    'funcionarios': 'FUNCIONARIOS',
    'periodo': 'PERIODO',
    'filtro': 'FILTRO',
    'turno': 'TURNO',
    'para': 'PARA',
    'de': 'DE',
    'concluido': 'CONCLUIDO',
    'em': 'EM',
    
    # Palavras-chave para lógica condicional
    'if': 'IF',
    'else': 'ELSE',
    'and': 'AND',
    'or': 'OR',
    
    # Palavras-chave para valores de prioridade
    'alta': 'ALTA',
    'media': 'MEDIA',
    'baixa': 'BAIXA',
    
    # Palavras-chave para dias da semana
    'segunda': 'SEGUNDA',
    'terca': 'TERCA',
    'quarta': 'QUARTA',
    'quinta': 'QUINTA',
    'sexta': 'SEXTA',
    'sabado': 'SABADO',
    'domingo': 'DOMINGO',
    
    # Palavras-chave para turnos
    'manha': 'MANHA',
    'tarde': 'TARDE',
    'noite': 'NOITE',
    
    # Outras palavras reservadas encontradas no documento
    'a': 'A',  # usado em ranges como "segunda a sexta"
}

# Lista de tokens - inclui as palavras reservadas e outros tokens
tokens = [
    # Literais
    'STRING',
    'NUMBER',
    'DATE',
    'TIME',
    'DURATION',
    
    # Identificadores
    'ID',
    
    # Operadores
    'EQUALS',
    'DOUBLE_EQUALS',
    'NOT_EQUALS',
    'LESS_THAN',
    'GREATER_THAN',
    'LESS_EQUAL',
    'GREATER_EQUAL',
    'PLUS',
    'MINUS',
    
    # Delimitadores
    'LPAREN',
    'RPAREN',
    'LBRACKET',
    'RBRACKET',
    'COMMA',
    'COLON',
    'SEMICOLON',
    'DOT',
    'HYPHEN',
    
    # Comentários (se necessário)
    'COMMENT',
    
] + list(reserved.values())

# Regras para tokens simples
t_EQUALS        = r'='
t_DOUBLE_EQUALS = r'=='
t_NOT_EQUALS    = r'!='
t_LESS_THAN     = r'<'
t_GREATER_THAN  = r'>'
t_LESS_EQUAL    = r'<='
t_GREATER_EQUAL = r'>='
t_PLUS          = r'\+'
t_MINUS         = r'-'
t_LPAREN        = r'\('
t_RPAREN        = r'\)'
t_LBRACKET      = r'\['
t_RBRACKET      = r'\]'
t_COMMA         = r','
t_COLON         = r':'
t_SEMICOLON     = r';'
t_DOT           = r'\.'
t_HYPHEN        = r'-'

# Ignorar espaços e tabs
t_ignore = ' \t'

def t_STRING(t):
    r'\"([^\\\n]|(\\.))*?\"'
    # Remove as aspas da string
    t.value = t.value[1:-1]
    return t

def t_DATE(t):
    r'\d{4}-\d{2}-\d{2}'
    return t

def t_TIME(t):
    r'\d{2}:\d{2}(:\d{2})?'
    return t

def t_DURATION(t):
    r'\d+[hm]'  # Ex: 2h, 30m
    return t

def t_NUMBER(t):
    r'\d+'
    t.value = int(t.value)
    return t

def t_ID(t):
    r'[a-zA-Z_][a-zA-Z_0-9]*'
    # Verificar se é uma palavra reservada
    t.type = reserved.get(t.value.lower(), 'ID')
    return t

def t_COMMENT(t):
    r'\#.*'
    pass  # Ignora comentários

# Regra para lidar com novas linhas
def t_newline(t):
    r'\n+'
    t.lexer.lineno += len(t.value)

# Tratamento de erro léxico
def t_error(t):
    print(f"Illegal character '{t.value[0]}' in line {t.lineno}")
    t.lexer.skip(1)

# Construir o lexer
lexer = lex.lex()

# Função para testar o lexer
def test_lexer(data):
    lexer.input(data)
    tokens_found = []
    
    while True:
        tok = lexer.token()
        if not tok:
            break
        tokens_found.append((tok.type, tok.value, tok.lineno))
    
    return tokens_found

if __name__ == "__main__":
    # Exemplo de teste com código LSS do documento
    test_code = '''
    def turno_manha():
        disponibilidade:
            dias: segunda a sexta
            horas: 08:00-12:00
    
    agendar:
        servico: "troca de óleo"
        cliente: "Ana Costa"
        data: 2025-03-12
        prioridade: alta
    
    consulta:
        tipo: servicos
        periodo: 2025-01-01 a 2025-01-31
        filtro: tipo == "mudança de óleo"
    '''
    print("=== ANÁLISE LÉXICA ===")
    print("Código de entrada:")
    print(test_code)
    print("\nTokens identificados:")
    print("-" * 50)
    
    tokens_result = test_lexer(test_code)
    for token_type, token_value, line_num in tokens_result:
        print(f"Linha {line_num:2d}: {token_type:15} -> '{token_value}'")
    
    print(f"\nTotal de tokens: {len(tokens_result)}")
    print(f"Total de palavras reservadas: {len(reserved)}")
    
    print("\n=== PALAVRAS RESERVADAS IDENTIFICADAS ===")
    for word, token in sorted(reserved.items()):
        print(f"{word:15} -> {token}")



# falta new lines e espaçamento ou tbm EOF