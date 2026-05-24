import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TambahBerita from '../pages/admin/tambah-berita';

// Mock window.alert
beforeAll(() => {
  jest.spyOn(window, 'alert').mockImplementation(() => {});
});

describe('Fitur Tambah Berita (Admin)', () => {
  test('Berhasil menambahkan berita baru ke dalam tabel', () => {
    render(<TambahBerita />);

    // Buka form popup
    const btnAdd = screen.getByText('+ Add New News');
    fireEvent.click(btnAdd);

    // Cari input judul
    const inputJudul = screen.getByPlaceholderText('Masukan Judul berita');
    
    // Ketik berita baru
    fireEvent.change(inputJudul, { target: { value: 'Berita Uji Coba Jest 2024' } });
    
    // Klik unggah
    const btnUnggah = screen.getByText('Unggah Berita');
    fireEvent.click(btnUnggah);

    // Pastikan judul baru muncul di dalam tabel
    expect(screen.getByText('Berita Uji Coba Jest 2024')).toBeInTheDocument();
  });
});
