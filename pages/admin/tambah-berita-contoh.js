import React, { useState } from 'react';

export default function TambahBerita() {
  const [judul, setJudul] = useState('');
  const [daftarBerita, setDaftarBerita] = useState([
    { id: 1, judul: 'Berita Dummy Awal' }
  ]);
  const [pesanSukses, setPesanSukses] = useState(false);

  const handleSimpan = (e) => {
    e.preventDefault();
    if (!judul) return;

    const beritaBaru = {
      id: Date.now(),
      judul: judul
    };

    setDaftarBerita([...daftarBerita, beritaBaru]);
    setPesanSukses(true);
    setJudul('');

    setTimeout(() => setPesanSukses(false), 3000);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Tambah Berita</h1>
      
      {pesanSukses && (
        <div style={{ background: 'green', color: 'white', padding: '10px', marginBottom: '10px' }} data-testid="pesan-sukses">
          Berita berhasil ditambahkan!
        </div>
      )}

      <form onSubmit={handleSimpan}>
        <input 
          type="text" 
          placeholder="Masukkan judul berita..."
          value={judul}
          onChange={(e) => setJudul(e.target.value)}
          data-testid="input-judul"
          style={{ padding: '8px', marginRight: '10px' }}
        />
        <button type="submit" data-testid="btn-simpan" style={{ padding: '8px 15px' }}>
          Simpan
        </button>
      </form>

      <hr />

      <h2>Daftar Berita Saat Ini:</h2>
      <ul data-testid="list-berita">
        {daftarBerita.map((berita) => (
          <li key={berita.id}>{berita.judul}</li>
        ))}
      </ul>
    </div>
  );
}
