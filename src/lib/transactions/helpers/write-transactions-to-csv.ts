import { writeFile } from 'node:fs/promises'

import type { Transaction } from '../schema'

export async function writeTransactionsToCSV(
  transactions: Transaction[],
  filePath: string,
) {
  const csvHeader = [
    'Status',
    'Description',
    'Raw Text',
    'Message',
    'Currency Code',
    'Amount Value',
    'Transaction Type',
    'Note',
    'Created At',
    'Settled At',
    'Parent Category ID',
    'Category ID',
  ].join(',')

  const csvContent = transactions.map((transaction) => {
    const data = [
      transaction.attributes.status,
      transaction.attributes.description,
      transaction.attributes.rawText,
      transaction.attributes.message,
      transaction.attributes.amount.currencyCode,
      transaction.attributes.amount.value,
      transaction.attributes.transactionType,
      transaction.attributes.note?.text,
      transaction.attributes.createdAt,
      transaction.attributes.settledAt,
      transaction.relationships.parentCategory.data?.id,
      transaction.relationships.category.data?.id,
    ]

    return data
      .map((value) => {
        if (value === null || value === undefined) {
          return ''
        }

        if (typeof value === 'number') {
          // Convert number to string for CSV
          return String(value)
        }

        // Escape double quotes for CSV format
        const escapedValue = value.replace(/"/g, '""')

        // Wrap in double quotes to handle commas and new lines
        return `"${escapedValue}"`
      })
      .join(',')
  })

  const csvData = [csvHeader, ...csvContent].join('\n')

  await writeFile(filePath, csvData)
}
