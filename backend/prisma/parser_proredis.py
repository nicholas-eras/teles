import pdfplumber
import json
import re

def extrair_estruturas_edp(pdf_path):
    estruturas_lista = []
    estrutura_atual = None
    
    # Regex para encontrar o título da estrutura (Ex: "004. Estrutura CE1")
    regex_titulo = re.compile(r'(\d{3})\.\s*(Estrutura\s+[^\n]+)')

    with pdfplumber.open(pdf_path) as pdf:
        for pagina in pdf.pages:
            texto = pagina.extract_text()
            if not texto:
                continue

            # 1. Tenta identificar se a página tem um título de estrutura
            match = regex_titulo.search(texto)
            if match:
                nome_bruto = match.group(2).strip()
                nome_limpo = re.split(r'\d{2}\s*/\s*\d{2}', nome_bruto)[0].strip()
                
                estrutura_atual = {
                    "nome": nome_limpo,
                    "materiais": []
                }
                estruturas_lista.append(estrutura_atual)

            # 2. Extrai tabelas da página
            tabelas = pagina.extract_tables()

            for tabela in tabelas:
                if not tabela: continue
                
                cabecalho = [str(c).replace('\n', ' ').lower() for c in tabela[0] if c]
                cabecalho_str = " ".join(cabecalho)

                if "item" in cabecalho_str and "descrição" in cabecalho_str:
                    for linha in tabela[1:]:
                        linha_limpa = [str(celula).replace('\n', ' ').strip() if celula else "" for celula in linha]

                        if not linha_limpa[0] or linha_limpa[0].lower() == "item":
                            continue

                        if len(linha_limpa) >= 4:
                            item = linha_limpa[0]
                            descricao = linha_limpa[1]
                            col2 = linha_limpa[2]
                            col3 = linha_limpa[3]
                            
                            if re.match(r'^\d', col2):
                                quantidade = col2
                                unidade = col3
                            else:
                                unidade = col2
                                quantidade = col3

                            if estrutura_atual is not None:
                                material = {
                                    "item": item,
                                    "descricao": descricao,
                                    "unidade": unidade,
                                    "quantidade": quantidade
                                }
                                if material not in estrutura_atual["materiais"]:
                                    estrutura_atual["materiais"].append(material)

    # --- ALTERAÇÃO AQUI ---
    # Filtra a lista mantendo apenas estruturas que tenham materiais
    estruturas_com_materiais = [e for e in estruturas_lista if len(e["materiais"]) > 0]

    return json.dumps(estruturas_com_materiais, indent=4, ensure_ascii=False)

# --- Execução ---
arquivo_pdf = "BANCO DE DADOS EDP.pdf"
# Certifique-se que o arquivo existe, senão vai dar erro
try:
    json_saida = extrair_estruturas_edp(arquivo_pdf)
    
    with open("estruturas_edp.json", "w", encoding="utf-8") as f:
        f.write(json_saida)
        
    print(f"Processo concluído. Estruturas extraídas: {len(json.loads(json_saida))}")

except Exception as e:
    print(f"Erro ao processar: {e}")