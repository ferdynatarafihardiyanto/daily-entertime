import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Login from '../pages/login';

describe('Halaman Login (Public User)', () => {
  test('Memunculkan pesan error jika login salah', async () => {
    render(<Login />);

    // Cari input email dan password
    const emailInput = screen.getByPlaceholderText('Masukkan Email atau Username');
    const passwordInput = screen.getByPlaceholderText('Masukkan Password');
    const loginButton = screen.getByText('Login');

    // Simulasikan user mengetik data yang salah
    fireEvent.change(emailInput, { target: { value: 'email.salah@demo.com' } });
    fireEvent.change(passwordInput, { target: { value: 'passwordngasal' } });

    // Klik tombol login
    fireEvent.click(loginButton);

    // Tombol akan berubah menjadi "Memproses..."
    expect(screen.getByText('Memproses...')).toBeInTheDocument();

    // Tunggu sampai pesan error muncul (karena ada setTimeout 600ms di kodenya)
    await waitFor(() => {
      expect(screen.getByText('⚠️ Email/Username atau Password salah.')).toBeInTheDocument();
    });
  });
});
