import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Film from '../pages/film';

describe('Halaman Film (Public User)', () => {
  test('Fitur pencarian (search) berhasil memfilter film', () => {
    render(<Film />);

    // Pastikan film default ada di layar sebelum pencarian
    expect(screen.getByText('Miracle in Cell No. 7')).toBeInTheDocument();
    expect(screen.getByText('Agak Laen')).toBeInTheDocument();

    // Cari kolom input search
    const searchInput = screen.getByPlaceholderText('Cari Film');
    
    // Simulasikan user mengetik "agak"
    fireEvent.change(searchInput, { target: { value: 'agak' } });

    // Pastikan "Agak Laen" tetap ada
    expect(screen.getByText('Agak Laen')).toBeInTheDocument();
    
    // Pastikan "Miracle in Cell No. 7" menghilang karena difilter
    expect(screen.queryByText('Miracle in Cell No. 7')).not.toBeInTheDocument();
  });
});
