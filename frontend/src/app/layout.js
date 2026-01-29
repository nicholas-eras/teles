import './styles/globals.scss'; // O global continua aqui
import styles from './layout.module.scss'; // Importa o módulo
import Link from 'next/link';

export const metadata = {
  title: 'Sistema de Projetos',
  description: 'Gerenciador de Estruturas',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        <div className={styles.container}>
          <nav className={styles.navbar}>
            <Link href="/">Home</Link>
            <Link href="/structures">Estruturas</Link>
            {/* Se tiver materiais, adicione aqui */}
          </nav>
          {children}
        </div>
      </body>
    </html>
  );
}