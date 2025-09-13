import { render, screen } from '../../test-utils'
import userEvent from '@testing-library/user-event'
import { DataTable } from '@/components/products/data-table'
import { ColumnDef } from '@tanstack/react-table'

// Test data and columns
interface TestData {
  id: string
  name: string
  price: number
}

const testData: TestData[] = [
  { id: '1', name: 'Product 1', price: 10.99 },
  { id: '2', name: 'Product 2', price: 25.50 },
  { id: '3', name: 'Product 3', price: 5.00 },
]

const testColumns: ColumnDef<TestData>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'price',
    header: 'Price',
    cell: ({ row }) => `$${row.getValue('price')}`,
  },
]

describe('DataTable', () => {
  test('renders table with data', () => {
    render(<DataTable columns={testColumns} data={testData} />)

    // Check headers
    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Price')).toBeInTheDocument()

    // Check data
    expect(screen.getByText('Product 1')).toBeInTheDocument()
    expect(screen.getByText('Product 2')).toBeInTheDocument()
    expect(screen.getByText('Product 3')).toBeInTheDocument()
    expect(screen.getByText('$10.99')).toBeInTheDocument()
    expect(screen.getByText('$25.5')).toBeInTheDocument()
    expect(screen.getByText('$5')).toBeInTheDocument()
  })

  test('renders empty table when no data', () => {
    render(<DataTable columns={testColumns} data={[]} />)

    // Headers should still be present
    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Price')).toBeInTheDocument()

    // No data rows
    expect(screen.queryByText('Product 1')).not.toBeInTheDocument()
  })

  test('displays pagination controls', () => {
    render(<DataTable columns={testColumns} data={testData} />)

    // Should show page info
    expect(screen.getByText('Page 1 of 1')).toBeInTheDocument()

    // Should show pagination buttons
    expect(screen.getByRole('button', { name: /prev/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument()
  })

  test('pagination buttons are disabled appropriately', () => {
    render(<DataTable columns={testColumns} data={testData} />)

    const prevButton = screen.getByRole('button', { name: /prev/i })
    const nextButton = screen.getByRole('button', { name: /next/i })

    // On first page with only one page, both should be disabled
    expect(prevButton).toBeDisabled()
    expect(nextButton).toBeDisabled()
  })

  test('handles column header clicks for sorting', async () => {
    const user = userEvent.setup()
    render(<DataTable columns={testColumns} data={testData} />)

    const nameHeader = screen.getByText('Name')
    
    // Should be clickable
    expect(nameHeader).toHaveClass('cursor-pointer')

    // Click to sort
    await user.click(nameHeader)
    
    // Should add sort indicator (testing that the click handler is attached)
    // Note: We can't easily test actual sorting without mocking the react-table internals
  })

  test('handles pagination with many items', () => {
    // Create data with more than 10 items to trigger pagination
    const manyItems = Array.from({ length: 25 }, (_, i) => ({
      id: `${i + 1}`,
      name: `Product ${i + 1}`,
      price: (i + 1) * 5,
    }))

    render(<DataTable columns={testColumns} data={manyItems} />)

    // Should show multiple pages
    expect(screen.getByText('Page 1 of 3')).toBeInTheDocument()

    // Next button should be enabled
    const nextButton = screen.getByRole('button', { name: /next/i })
    expect(nextButton).not.toBeDisabled()
  })
})