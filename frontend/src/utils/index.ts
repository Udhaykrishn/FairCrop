/**
 * Format a number as currency (INR by default).
 */
export function formatCurrency(amount: number, currency = 'INR'): string {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency }).format(amount)
}

/**
 * Format a date string to a readable format.
 */
export function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    })
}

/**
 * Truncate a string to a max length with ellipsis.
 */
export function truncate(str: string, maxLength: number): string {
    return str.length > maxLength ? `${str.slice(0, maxLength)}…` : str
}
