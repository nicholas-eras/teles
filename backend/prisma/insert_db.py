import json
import psycopg2

# Configuração do Banco (Ajuste a senha se necessário)
DB_HOST = "localhost"
DB_NAME = "postgres"
DB_USER = "postgres"
DB_PASS = "postgres" 
DB_PORT = "5432"

def importar_dados():
    # 1. Carregar JSON
    try:
        with open('estruturas_edp.json', 'r', encoding='utf-8') as f:
            dados_json = json.load(f)
    except FileNotFoundError:
        print("Erro: Arquivo 'estruturas_edp.json' não encontrado.")
        return

    # 2. Conectar no Banco
    try:
        conn = psycopg2.connect(
            host=DB_HOST,
            database=DB_NAME,
            user=DB_USER,
            password=DB_PASS,
            port=DB_PORT
        )
        cur = conn.cursor()
        print("Conectado ao banco de dados.")
    except Exception as e:
        print(f"Erro ao conectar: {e}")
        return

    count = 0

    # 3. Iterar e Inserir
    for estrutura in dados_json:
        nome = estrutura.get('nome')
        materiais = estrutura.get('materiais', [])

        # Pula se não tiver materiais ou nome
        if not materiais or not nome:
            continue

        try:
            # --- A. Inserir a ESTRUTURA ---
            # ATENÇÃO: Removemos a coluna 'description' que causava o erro.
            # Usamos o UPDATE no nome apenas para garantir que o ID seja retornado mesmo se já existir.
            cur.execute("""
                INSERT INTO "Structure" (name)
                VALUES (%s)
                ON CONFLICT (name) 
                DO UPDATE SET name = EXCLUDED.name
                RETURNING id;
            """, (nome,))
            
            structure_id = cur.fetchone()[0]

            # --- B. Limpar materiais antigos dessa estrutura ---
            cur.execute('DELETE FROM "StructureMaterial" WHERE "structureId" = %s', (structure_id,))

            # --- C. Inserir Materiais ---
            if materiais:
                # ATENÇÃO: Removemos 'item' e 'sku'. Inserimos apenas o que está no seu Schema.
                query_insert_material = """
                    INSERT INTO "StructureMaterial" 
                    ("structureId", description, unit, quantity)
                    VALUES (%s, %s, %s, %s)
                """
                
                lista_tuplas = []
                for mat in materiais:
                    # Mapeamento estrito:
                    # JSON 'descricao' -> Banco 'description'
                    # JSON 'unidade'   -> Banco 'unit'
                    # JSON 'quantidade'-> Banco 'quantity'
                    
                    lista_tuplas.append((
                        structure_id,
                        mat.get('descricao', ''), 
                        mat.get('unidade', ''),
                        str(mat.get('quantidade', '0')) # Garante string conforme seu schema
                    ))
                
                cur.executemany(query_insert_material, lista_tuplas)

            count += 1
            conn.commit()
            print(f"Processado: {nome} (ID: {structure_id})")

        except Exception as e:
            conn.rollback()
            print(f"Erro ao processar {nome}: {e}")

    # 4. Finalizar
    cur.close()
    conn.close()
    print("-" * 30)
    print(f"Importação finalizada! {count} estruturas processadas.")

if __name__ == "__main__":
    importar_dados()