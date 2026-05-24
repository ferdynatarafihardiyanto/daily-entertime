import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TambahFilm from '../pages/admin/tambah-film';

// Mock window.alert
beforeAll(() => {
  jest.spyOn(window, 'alert').mockImplementation(() => {});
});

describe('Fitur Tambah Film (Admin)', () => {
  test('Berhasil menambahkan film baru ke dalam tabel', () => {
    render(<TambahFilm />);

    // Buka form popup
    const btnAdd = screen.getByText('+ Add New Film');
    fireEvent.click(btnAdd);

    // Cari input judul
    const inputJudul = screen.getByPlaceholderText('Masukan Judul Film');
    
    // Ketik film baru
    fireEvent.change(inputJudul, { target: { value: 'Film Uji Coba Jest 2024' } });
    
    // Klik unggah
    const btnUnggah = screen.getByText('Unggah Film');
    fireEvent.click(btnUnggah);

    // Pastikan judul baru muncul di dalam tabel
    expect(screen.getByText('Film Uji Coba Jest 2024')).toBeInTheDocument();
  });
});
