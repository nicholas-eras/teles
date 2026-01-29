import styles from './page.module.scss';

export default function Home() {
  return (
    <div className={styles.hero}>
      <h1>Bem-vindo ao Sistema de Projetos</h1>
      <p>Utilize o menu acima para navegar entre as Estruturas e Materiais.</p>
    </div>
  );
}