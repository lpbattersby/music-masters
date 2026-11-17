export default function findDeadline(days: number, from = new Date()): string {
  if (!Number.isInteger(days) || days <= 0) {
    throw new Error('Days must be a positive integer')
  }

  const date = new Date(from)
  date.setDate(date.getDate() + days)

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}
