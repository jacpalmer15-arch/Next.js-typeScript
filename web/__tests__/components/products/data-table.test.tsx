import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/products/data-table'

interface TestData {
  id: string
  name: string
  value: number
}

const mockColumns: ColumnDef<TestData>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'value',
    header: 'Value',
  },
]

const mockData: TestData[] = [
  { id: '1', name: 'Item 1', value: 10 },
  { id: '2', name: 'Item 2', value: 20 },
  { id: '3', name: 'Item 3', value: 30 },
  { id: '4', name: 'Item 4', value: 40 },
  { id: '5', name: 'Item 5', value: 50 },
  { id: '6', name: 'Item 6', value: 60 },
  { id: '7', name: 'Item 7', value: 70 },
  { id: '8', name: 'Item 8', value: 80 },
  { id: '9', name: 'Item 9', value: 90 },
  { id: '10', name: 'Item 10', value: 100 },
  { id: '11', name: 'Item 11', value: 110 },
  { id: '12', name: 'Item 12', value: 120 },
]

describe('DataTable', () => {
  it('renders table with headers', () => {
    render(<DataTable columns={mockColumns} data={mockData} />)
    
    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Value')).toBeInTheDocument()
  })

  it('renders data rows', () => {
    render(<DataTable columns={mockColumns} data={mockData} />)
    
    expect(screen.getByText('Item 1')).toBeInTheDocument()
    expect(screen.getByText('10')).toBeInTheDocument()
  })

  it('shows pagination controls', () => {
    render(<DataTable columns={mockColumns} data={mockData} />)
    
    expect(screen.getByText(/Page 1 of/)).toBeInTheDocument()
    expect(screen.getByText('Prev')).toBeInTheDocument()
    expect(screen.getByText('Next')).toBeInTheDocument()
  })

  it('paginates correctly with page size of 10', () => {
    render(<DataTable columns={mockColumns} data={mockData} />)
    
    // Should show first 10 items
    expect(screen.getByText('Item 1')).toBeInTheDocument()
    expect(screen.getByText('Item 10')).toBeInTheDocument()
    expect(screen.queryByText('Item 11')).not.toBeInTheDocument()
    
    // Should show page 1 of 2
    expect(screen.getByText('Page 1 of 2')).toBeInTheDocument()
  })

  it('navigates to next page', () => {
    render(<DataTable columns={mockColumns} data={mockData} />)
    
    const nextButton = screen.getByText('Next')
    fireEvent.click(nextButton)
    
    // Should show items 11-12 on page 2
    expect(screen.getByText('Item 11')).toBeInTheDocument()
    expect(screen.getByText('Item 12')).toBeInTheDocument()
    expect(screen.queryByText('Item 1')).not.toBeInTheDocument()
    
    // Should show page 2 of 2
    expect(screen.getByText('Page 2 of 2')).toBeInTheDocument()
  })

  it('navigates to previous page', () => {
    render(<DataTable columns={mockColumns} data={mockData} />)
    
    // Go to page 2 first
    const nextButton = screen.getByText('Next')
    fireEvent.click(nextButton)
    
    // Then go back to page 1
    const prevButton = screen.getByText('Prev')
    fireEvent.click(prevButton)
    
    // Should show first page items
    expect(screen.getByText('Item 1')).toBeInTheDocument()
    expect(screen.getByText('Item 10')).toBeInTheDocument()
    expect(screen.queryByText('Item 11')).not.toBeInTheDocument()
    
    // Should show page 1 of 2
    expect(screen.getByText('Page 1 of 2')).toBeInTheDocument()
  })

  it('disables prev button on first page', () => {
    render(<DataTable columns={mockColumns} data={mockData} />)
    
    const prevButton = screen.getByText('Prev')
    expect(prevButton).toBeDisabled()
  })

  it('disables next button on last page', () => {
    render(<DataTable columns={mockColumns} data={mockData} />)
    
    // Go to last page
    const nextButton = screen.getByText('Next')
    fireEvent.click(nextButton)
    
    expect(nextButton).toBeDisabled()
  })

  it('handles sorting when header is clicked', () => {
    render(<DataTable columns={mockColumns} data={mockData} />)
    
    const nameHeader = screen.getByText('Name')
    expect(nameHeader).toHaveClass('cursor-pointer', 'select-none')
    
    // Click to sort
    fireEvent.click(nameHeader)
    
    // Should show sort indicator
    expect(nameHeader).toHaveTextContent('Name ▲')
  })

  it('handles empty data', () => {
    render(<DataTable columns={mockColumns} data={[]} />)
    
    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Value')).toBeInTheDocument()
    
    // Should show page 1 of 0
    expect(screen.getByText('Page 1 of 0')).toBeInTheDocument()
  })
})