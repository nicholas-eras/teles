// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

async function main() {
  const caminhoArquivo = path.join(__dirname, 'estruturas_edp.json')

  if (!fs.existsSync(caminhoArquivo)) {
    console.error(`Arquivo não encontrado: ${caminhoArquivo}`)
    return
  }

  const dadosBrutos = fs.readFileSync(caminhoArquivo, 'utf-8')
  const estruturasJson = JSON.parse(dadosBrutos)

  console.log('--- Iniciando Seed ---')

  // 1. Criar ou Atualizar o Padrão "EDP"
  // Usamos upsert para garantir que não duplique se rodar o seed de novo
  const padraoEDP = await prisma.standard.upsert({
    where: { name: 'EDP' },
    update: { 
      updatedAt: new Date() // Apenas atualiza a data se já existir
    },
    create: {
      name: 'EDP',
      description: 'Estruturas de Distribuição Padrão EDP',
      updatedAt: new Date()
    }
  })

  console.log(`Padrão garantido: ${padraoEDP.name} (ID: ${padraoEDP.id})`)

  // 2. Inserir as estruturas vinculadas a este padrão
  for (const item of estruturasJson) {
    if (!item.nome || !item.materiais) continue

    await prisma.structure.upsert({
      // Busca por nome + standardId (chave composta que criamos no schema)
      where: {
        name_standardId: {
          name: item.nome,
          standardId: padraoEDP.id
        }
      },
      update: {
        // Se a estrutura já existe, recriamos os materiais para garantir atualização
        materials: {
          deleteMany: {}, // Limpa materiais antigos
          create: item.materiais.map((mat: any) => ({
            description: mat.descricao,
            unit: mat.unidade,
            quantity: mat.quantidade
          }))
        }
      },
      create: {
        name: item.nome,
        standardId: padraoEDP.id, // Vínculo com a tabela Standard
        materials: {
          create: item.materiais.map((mat: any) => ({
            description: mat.descricao,
            unit: mat.unidade,
            quantity: mat.quantidade
          }))
        }
      }
    })
  }

  console.log(`Seed finalizado! Estruturas importadas para o padrão EDP.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })