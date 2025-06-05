import ply.yacc as yacc
from lexer_lss import tokens

def p_program(p):
    '''program : comandos'''
    p[0] = p[1]

def p_comandos(p):
    '''comandos : comando
                | comandos comando'''
    if len(p) == 2:
        p[0] = [p[1]]
    else:
        p[0] = p[1] + [p[2]]

# Comando agendar com ou sem dois-pontos
def p_comando_agendar(p):
    '''comando : AGENDAR COLON propriedades
               | AGENDAR propriedades'''
    if len(p) == 4:
        p[0] = ('agendar', p[3])
    else:
        p[0] = ('agendar', p[2])

# Propriedades (lista)
def p_propriedades(p):
    '''propriedades : propriedade
                    | propriedades propriedade'''
    if len(p) == 2:
        p[0] = [p[1]]
    else:
        p[0] = p[1] + [p[2]]

# Propriedade com ou sem dois-pontos
def p_propriedade(p):
    '''propriedade : chave COLON valor
                   | chave valor'''
    if len(p) == 4:
        p[0] = (p[1], p[3])
    else:
        p[0] = (p[1], p[2])

def p_chave(p):
    '''chave : ID
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
             | EM'''
    p[0] = p[1]

def p_valor(p):
    '''valor : STRING
             | NUMBER
             | DATE
             | TIME
             | ID
             | ALTA
             | MEDIA
             | BAIXA'''
    p[0] = p[1]

def p_error(p):
    if p:
        print(f"Erro de sintaxe em '{p.value}' na linha {p.lineno}")
    else:
        print("Erro de sintaxe no final do arquivo")

parser = yacc.yacc()

if __name__ == "__main__":
    code = '''
    agendar
        servico: "troca de óleo"
        cliente "Ana Costa"
        data 2025-03-12
        prioridade alta
    '''
    result = parser.parse(code)
    print("Resultado da análise sintática:")
    print(result)
