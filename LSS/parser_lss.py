import ply.yacc as yacc
from lexer_lss import tokens, lexer

# Precedência dos operadores
precedence = (
    ('left', 'OR'),
    ('left', 'AND'),
    ('left', 'DOUBLE_EQUALS', 'NOT_EQUALS'), 
    ('left', 'LESS_THAN', 'GREATER_THAN', 'LESS_EQUAL', 'GREATER_EQUAL'),
    ('left', 'PLUS', 'MINUS'),
)

# CORREÇÃO FUNDAMENTAL: Estrutura hierárquica correta
def p_program(p):
    '''program : program_items'''
    p[0] = p[1]

def p_program_items_single(p):
    '''program_items : program_item'''
    p[0] = [p[1]]

def p_program_items_multiple(p):
    '''program_items : program_items program_item'''
    p[0] = p[1] + [p[2]]

# Items do programa: funções OU comandos (no nível raiz)
def p_program_item_function(p):
    '''program_item : function_def'''
    p[0] = p[1]

def p_program_item_command(p):
    '''program_item : command'''
    p[0] = p[1]

# DEFINIÇÃO DE FUNÇÕES - Corpo limitado a comandos
def p_function_def(p):
    '''function_def : DEF ID LPAREN RPAREN COLON function_body'''
    p[0] = ('function_def', p[2], p[6])

def p_function_body_single(p):
    '''function_body : command'''
    p[0] = [p[1]]

def p_function_body_multiple(p):
    '''function_body : function_body command'''
    p[0] = p[1] + [p[2]]

# COMANDOS
def p_command_agendar(p):
    '''command : AGENDAR COLON properties'''
    p[0] = ('agendar', p[3])

def p_command_consulta(p):
    '''command : CONSULTA COLON properties'''
    p[0] = ('consulta', p[3])

def p_command_disponibilidade(p):
    '''command : DISPONIBILIDADE COLON properties'''
    p[0] = ('disponibilidade', p[3])

def p_command_indisponibilidade(p):
    '''command : INDISPONIBILIDADE COLON properties'''
    p[0] = ('indisponibilidade', p[3])

def p_command_ferias(p):
    '''command : FERIAS COLON properties'''
    p[0] = ('ferias', p[3])

def p_command_batch(p):
    '''command : BATCH COLON properties'''
    p[0] = ('batch', p[3])

# PROPRIEDADES
def p_properties_single(p):
    '''properties : property'''
    p[0] = [p[1]]

def p_properties_multiple(p):
    '''properties : properties property'''
    p[0] = p[1] + [p[2]]

def p_property(p):
    '''property : key COLON value'''
    p[0] = (p[1], p[3])

# CHAVES
def p_key(p):
    '''key : ID
           | SERVICO
           | CLIENTE
           | DATA
           | PRIORIDADE
           | MOTIVO
           | DURACAO
           | DIAS
           | HORAS
           | FUNCIONARIO
           | FUNCIONARIOS
           | PERIODO
           | FILTRO
           | TURNO
           | PARA
           | DE
           | CONCLUIDO
           | EM
           | TIPO'''
    p[0] = p[1]

# VALORES
def p_value_literal(p):
    '''value : STRING
             | NUMBER
             | DATE
             | TIME
             | ID
             | DURATION'''
    p[0] = p[1]

def p_value_priority(p):
    '''value : ALTA
             | MEDIA
             | BAIXA'''
    p[0] = p[1]

def p_value_weekday(p):
    '''value : SEGUNDA
             | TERCA
             | QUARTA
             | QUINTA
             | SEXTA
             | SABADO
             | DOMINGO'''
    p[0] = p[1]

def p_value_shift(p):
    '''value : MANHA
             | TARDE
             | NOITE'''
    p[0] = p[1]

# Permitir palavras-chave como valores
def p_value_keywords(p):
    '''value : SERVICO
             | CLIENTE
             | DATA
             | PRIORIDADE
             | MOTIVO
             | DURACAO
             | DIAS
             | HORAS
             | FUNCIONARIO
             | FUNCIONARIOS
             | PERIODO
             | FILTRO
             | TURNO
             | PARA
             | DE
             | CONCLUIDO
             | EM
             | TIPO
             | AGENDAR
             | CONSULTA
             | DISPONIBILIDADE
             | INDISPONIBILIDADE
             | FERIAS
             | BATCH'''
    p[0] = p[1]

# RANGES
def p_value_range_a(p):
    '''value : value A value'''
    p[0] = ('range', p[1], p[3])

def p_value_range_hyphen(p):
    '''value : value HYPHEN value''' 
    p[0] = ('range', p[1], p[3])

# LISTAS
def p_value_list(p):
    '''value : LBRACKET value_list RBRACKET'''
    p[0] = ('list', p[2])

def p_value_list_single(p):
    '''value_list : value'''
    p[0] = [p[1]]

def p_value_list_multiple(p):
    '''value_list : value_list COMMA value'''
    p[0] = p[1] + [p[3]]

# EXPRESSÕES
def p_value_expression(p):
    '''value : expression'''
    p[0] = p[1]

def p_expression_comparison(p):
    '''expression : value DOUBLE_EQUALS value
                  | value NOT_EQUALS value
                  | value LESS_THAN value
                  | value GREATER_THAN value
                  | value LESS_EQUAL value
                  | value GREATER_EQUAL value'''
    p[0] = (p[2], p[1], p[3])

def p_expression_logical(p):
    '''expression : expression AND expression
                  | expression OR expression'''
    p[0] = (p[2], p[1], p[3])

def p_expression_parentheses(p):
    '''expression : LPAREN expression RPAREN'''
    p[0] = p[2]

# CONDICIONAIS
def p_value_if(p):
    '''value : IF expression'''
    p[0] = ('if', p[2])

def p_value_if_else(p):
    '''value : IF expression ELSE value'''
    p[0] = ('if_else', p[2], p[4])

# OPERAÇÕES ARITMÉTICAS
def p_value_arithmetic(p):
    '''value : value PLUS value
             | value MINUS value'''
    p[0] = (p[2], p[1], p[3])

def p_value_parentheses(p):
    '''value : LPAREN value RPAREN'''
    p[0] = p[2]

# TRATAMENTO DE ERRO
def p_error(p):
    if p:
        print(f"ERRO DE SINTAXE:")
        print(f"  Token: '{p.value}' (tipo: {p.type})")
        print(f"  Linha: {p.lineno}")
        raise SyntaxError(f"Erro de sintaxe em '{p.value}' na linha {p.lineno}")
    else:
        print("ERRO: Fim inesperado do arquivo")
        raise SyntaxError("Fim inesperado do arquivo")

# Criar o parser
parser = yacc.yacc()

def test_parser_detailed(code, test_name=""):
    print(f"\n{'='*60}")
    print(f"TESTE: {test_name}")
    print(f"{'='*60}")
    print("Código:")
    for i, line in enumerate(code.strip().split('\n'), 1):
        print(f"{i:2d}: {line}")
    print("-" * 60)
    
    try:
        result = parser.parse(code, lexer=lexer, debug=False)
        
        if result is None:
            print("✗ ERRO: Parse falhou (resultado None)")
            return False
            
        print("✓ SUCESSO!")
        print("Estrutura do resultado:")
        
        # Análise detalhada da estrutura
        def analyze_structure(item, indent=0):
            prefix = "  " * indent
            if isinstance(item, tuple):
                if len(item) >= 2:
                    print(f"{prefix}[{item[0]}]")
                    if len(item) > 2 and isinstance(item[2], list):
                        for sub_item in item[2]:
                            analyze_structure(sub_item, indent + 1)
            elif isinstance(item, list):
                for sub_item in item:
                    analyze_structure(sub_item, indent)
        
        if isinstance(result, list):
            print(f"Total de elementos no nível raiz: {len(result)}")
            for i, item in enumerate(result):
                print(f"\nElemento {i+1}:")
                analyze_structure(item, 0)
        else:
            analyze_structure(result, 0)
            
        print("\nResultado completo:")
        import pprint
        pprint.pprint(result, width=80, depth=5)
        return True
        
    except SyntaxError as e:
        print(f"✗ ERRO DE SINTAXE: {e}")
        return False
    except Exception as e:
        print(f"✗ ERRO INESPERADO: {e}")
        return False

if __name__ == "__main__":

    # Testes adicionais solicitados
    test1 = '''
agendar:
    servico: "troca de óleo"
    cliente: "Ana Costa"
    data: 2025-03-12
    prioridade: alta
    

indisponibilidade:
    funcionario: "João Silva"
    dias: segunda a sexta
    turno: manha
    motivo: "treinamento"

    funcionario: "Ana Clara"
    dias: segundo-quarta-domingo
    turno: tarde
    motivo: "doenca"
    '''


    # Teste 2: Definição de função com disponibilidade
    test2 = '''
def turno_manha():
    disponibilidade:
        dias: segunda a sexta
        horas: 08:00-12:00

def turno_tarde():
    disponibilidade:
        dias: segunda a sexta
        horas: 14:00-20:00
        '''

    # Teste 3: Consulta com filtro
    test3 = '''
consulta:
    tipo: servicos
    periodo: 2025-01-01 a 2025-01-31
    filtro: tipo == "troca de óleo"
    '''

    # Teste 4: Código complexo com múltiplos comandos
    test4 = '''
def turno_manha():
    disponibilidade:
        dias: segunda a sexta
        horas: 08:00-12:00

def turno_tarde():
    disponibilidade:
        dias: segunda a sexta
        horas: 14:00-18:00

agendar:
    servico: "troca de óleo"
    cliente: "Ana Costa"
    data: 2025-03-12
    prioridade: alta

consulta:
    tipo: servicos
    filtro: prioridade == alta
    '''

    # Teste 5: Estruturas avançadas
    test5 = '''
disponibilidade:
    funcionarios: [Joao, Maria, Pedro]
    turnos: manha a tarde
    '''

    # Teste 6: Indisponibilidade por turno
    test6 = '''
indisponibilidade:
    funcionario: "Pedro Costa"
    dias: segunda a sexta
    turno: manha
    motivo: "curso"
    '''

    # Teste 7: Férias coletivas
    test7 = '''
ferias:
    funcionarios: ["João", "Maria", "Pedro"]
    periodo: 2025-12-25 a 2025-01-02
    motivo: "ferias coletivas"
    '''

    # Teste 8: Função para férias
    test8= '''
def ferias_verao():
    ferias:
        funcionario: "Ana Lima"
        periodo: 2025-01-15 a 2025-01-30
        motivo: "ferias programadas"
    '''

    # Teste 9: Consulta de indisponibilidades
    test9 = '''
consulta:
    tipo: indisponibilidades
    periodo: 2025-06-01 a 2025-06-30
    filtro: motivo == "doença"
    '''

    # Teste 10: Batch de indisponibilidades
    test10 = '''
batch:
    tipo: indisponibilidade
    funcionarios: ["equipe_manutencao"]
    dias: 2025-07-15 a 2025-07-16
    motivo: "treinamento"
    '''

    # Teste 11: Indisponibilidade com duração
    test11 = '''
indisponibilidade:
    funcionario: "Sandra Rocha"
    data: 2025-05-20
    duracao: 4h
    horas: 14:00-18:00
    motivo: "exame médico"
    '''

    # Teste 12: Múltiplos comandos
    test12 = '''
indisponibilidade:
    funcionario: "Carlos"
    dias: 2025-08-01 a 2025-08-05
    motivo: "licença"

ferias:
    funcionario: "Roberto"
    periodo: 2025-09-10 a 2025-09-20

consulta:
    tipo: ferias
    funcionario: "Roberto"
    '''

    # Teste 13: Estrutura complexa
    test13 = '''
def gerir_ausencias():
    indisponibilidade:
        funcionarios: ["João", "Maria"]
        dias: segunda a sexta
        turno: tarde
        motivo: "capacitação"
    ferias:
        funcionario: "Pedro"
        periodo: 2025-12-01 a 2025-12-15
        prioridade: alta

batch:
    tipo: consulta
    filtro: motivo == "ferias"
    periodo: 2025-01-01 a 2025-12-31
    '''

    tests = [
        (test1, "Comando agendar básico"),
        (test2, "Definição de função"),
        (test3, "Consulta com filtro"),
        (test4, "Código complexo"),
        (test5, "Estruturas avançadas"),
        (test6, "Indisponibilidade por turno"),
        (test7, "Férias coletivas"),
        (test8, "Função para férias"),
        (test9, "Consulta de indisponibilidades"),
        (test10, "Batch de indisponibilidades"),
        (test11, "Indisponibilidade com duração"),
        (test12, "Múltiplos comandos"),
        (test13, "Estrutura complexa")
    ]

    # Executar todos os testes
    success_count = 0
    total_tests = len(tests)
    
    for test_code, test_name in tests:
        success = test_parser_detailed(test_code, test_name)
        if success:
            success_count += 1
    
    print(f"\n{'='*60}")
    print(f"RESUMO DOS TESTES")
    print(f"{'='*60}")
    print(f"Cumprido: {success_count}/{total_tests}")
