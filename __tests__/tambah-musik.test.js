import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TambahMusik from '../pages/admin/tambah-musik';

// Mock window.alert
beforeAll(() => {
  jest.spyOn(window, 'alert').mockImplementation(() => {});
});

describe('Fitur Tambah Musik (Admin)', () => {
  test('Berhasil menambahkan musik baru ke dalam tabel', () => {
    render(<TambahMusik />);

    // Buka form popup
    const btnAdd = screen.getByText('+ Add New Music');
    fireEvent.click(btnAdd);

    // Cari input judul
    const inputJudul = screen.getByPlaceholderText('Masukan Judul Musik');
    
    // Ketik musik baru
    fireEvent.change(inputJudul, { target: { value: 'Musik Uji Coba Jest 2024' } });
    
    // Klik unggah
    const btnUnggah = screen.getByText('Unggah Musik');
    fireEvent.click(btnUnggah);

    // Pastikan judul baru muncul di dalam tabel
    expect(screen.getByText('Musik Uji Coba Jest 2024')).toBeInTheDocument();
  });
});
