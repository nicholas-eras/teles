'use client';

import { useState, useEffect } from 'react';
import { api } from '../services/api';
import Link from 'next/link';
import styles from './structures.module.scss';

export default function StructuresPage() {
  const [structures, setStructures] = useState([]);
  const [newName, setNewName] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {    
    const data = await api.structures.list();
    setStructures(data);    
  }

  async function handleCreate(e) {
    e.preventDefault();
    if (!newName) return;
    await api.structures.create({ name: newName });
    setNewName('');
    loadData();
  }

  async function handleDelete(id) {
    if (confirm('Tem certeza que deseja excluir esta estrutura?')) {
      await api.structures.delete(id);
      loadData();
    }
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1>Estruturas</h1>
          <p className={styles.subtitle}>Gerencie os padrões e configurações.</p>
        </div>
      </header>
      
      {/* Barra de Ferramentas / Criação */}
      <div className={styles.toolbar}>
        <form onSubmit={handleCreate} className={styles.createForm}>
          <input 
            placeholder="Nova estrutura (Ex: Poste Circular 12m)" 
            value={newName} 
            onChange={(e) => setNewName(e.target.value)} 
            required
          />
          <button className={styles.btnPrimary} type="submit">
            + Criar
          </button>
        </form>
      </div>

      {/* Grid de Cards */}
      <div className={styles.grid}>
        {structures.map((st) => (
          <div className={styles.card} key={st.id}>
            
            {/* Corpo do Card */}
            <div className={styles.cardBody}>
              {/* <div className={styles.iconPlaceholder}>
                {st.name.substring(0, 2).toUpperCase()}
              </div> */}
              <h3 className={styles.cardTitle}>{st.name}</h3>
              <p className={styles.cardDesc}>
                {st.standard.name || ''}
              </p>
              
              {/* Badge de contagem (Opcional, se seu backend retornar) */}
              <div className={styles.meta}>
                 <span>{st._count?.materials || 0} materiais</span>
              </div>
            </div>

            {/* Rodapé com Ações */}
            <div className={styles.cardFooter}>
              <Link href={`/structures/${st.id}`} className={styles.linkAction}>
                Detalhes
              </Link>
              <button 
                className={styles.btnDelete} 
                onClick={() => handleDelete(st.id)}
              >
                Remover
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}