'use client';

import { useState, useEffect, use } from 'react';
import { api } from '../../services/api';
import styles from './details.module.scss'; // Importando o SCSS

export default function StructureDetails({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const [structure, setStructure] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.structures.getById(params.id)
      .then((data) => {
        setStructure(data);
      })
      .catch((err) => {
        console.error("Erro ao carregar estrutura:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [params.id]);

  if (loading) return <p className={styles.container}>Carregando detalhes...</p>;
  if (!structure) return <p className={styles.container}>Estrutura não encontrada.</p>;

  return (
    <div className={styles.container}>
      {/* Cabeçalho com informações principais */}
      <header className={styles.header}>
        <h1>{structure.name}</h1>
        
        <div className={styles.metaInfo}>
          {structure.standard && (
            <p><strong>Padrão:</strong> {structure.standard.name}</p>
          )}
          <p>{structure.description || "Sem descrição adicional."}</p>
        </div>
      </header>

      {/* Lista de Materiais */}
      <h3 className={styles.sectionTitle}>
        Materiais Vinculados 
        <span>{structure.materials?.length || 0}</span>
      </h3>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Descrição</th>
              <th>Unidade</th>
              <th>Qtd</th>
            </tr>
          </thead>
          <tbody>
            {structure.materials && structure.materials.length > 0 ? (
              structure.materials.map((mat) => (
                <tr key={mat.id}>
                  <td>{mat.description}</td>
                  <td>{mat.unit}</td>
                  <td>{mat.quantity}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className={styles.emptyState}>
                  Nenhum material cadastrado para esta estrutura.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <button 
        className={styles.btnBack}
        onClick={() => window.history.back()} 
      >
        ← Voltar
      </button>
    </div>
  );
}