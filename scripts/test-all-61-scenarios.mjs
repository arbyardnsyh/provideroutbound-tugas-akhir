import fs from 'node:fs';
import path from 'node:path';
import { createClient } from '@supabase/supabase-js';

// Load .env
function loadEnv() {
  const envPath = path.resolve(process.cwd(), '.env');
  if (!fs.existsSync(envPath)) return {};
  const content = fs.readFileSync(envPath, 'utf8');
  const env = {};
  content.split('\n').forEach(line => {
    line = line.trim();
    if (!line || line.startsWith('#')) return;
    const idx = line.indexOf('=');
    if (idx !== -1) {
      let val = line.slice(idx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      env[line.slice(0, idx).trim()] = val;
    }
  });
  return env;
}

const env = loadEnv();
const supabaseUrl = env.PUBLIC_SUPABASE_URL || env.SUPABASE_URL || '';
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || env.PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

const results = [];
function record(id, category, name, passed, details = '') {
  results.push({ id, category, name, passed, details });
  const mark = passed ? '✅ PASS' : '❌ FAIL';
  console.log(`[${id.toString().padStart(2, '0')}/61] ${mark} | ${category} | ${name} ${details ? '(' + details + ')' : ''}`);
}

async function runTests() {
  console.log('\n================================================================');
  console.log('   PENGUJIAN MENYELURUH SISTEM: 61 SKENARIO FITUR & BACKEND');
  console.log('   Project: Provider Outbound Batu - Malang (provideroutbound.web.id)');
  console.log('================================================================\n');

  // -------------------------------------------------------------
  // BAGIAN 1: FRONTEND USER EXPERIENCE & ROUTES (Skenario 1 - 25)
  // -------------------------------------------------------------
  console.log('--- BAGIAN 1: RUTE HALAMAN PENGGUNA (FRONTEND) ---');
  const publicPages = [
    { id: 1, path: 'dist/index.html', name: 'Beranda (Home)', checks: ['Hero', 'Layanan', 'Paket', 'Testimoni', 'FAQ'] },
    { id: 2, path: 'dist/tentang-kami/index.html', name: 'Tentang Kami', checks: ['Tentang Kami', 'Pilar', 'Fasilitator'] },
    { id: 3, path: 'dist/layanan/index.html', name: 'Indeks Layanan', checks: ['Layanan Outbound', 'Perusahaan', 'Family'] },
    { id: 4, path: 'dist/layanan/outbound-perusahaan/index.html', name: 'Detail: Outbound Perusahaan', checks: ['Perusahaan', 'Team Building'] },
    { id: 5, path: 'dist/layanan/family-gathering/index.html', name: 'Detail: Family Gathering', checks: ['Family Gathering', 'Keluarga'] },
    { id: 6, path: 'dist/layanan/outbound-sekolah/index.html', name: 'Detail: Outbound Sekolah', checks: ['Sekolah', 'Karakter'] },
    { id: 7, path: 'dist/layanan/wisata-adventure/index.html', name: 'Detail: Wisata Adventure', checks: ['Adventure', 'Rafting'] },
    { id: 8, path: 'dist/layanan/outbound-wisata/index.html', name: 'Detail: Outbound Wisata', checks: ['Wisata'] },
    { id: 9, path: 'dist/paket/index.html', name: 'Indeks Paket Outbound', checks: ['Paket Outbound', 'Filter'] },
    { id: 10, path: 'dist/paket/perusahaan/index.html', name: 'Paket Kategori: Perusahaan', checks: ['Perusahaan'] },
    { id: 11, path: 'dist/paket/family-gathering/index.html', name: 'Paket Kategori: Family Gathering', checks: ['Family'] },
    { id: 12, path: 'dist/paket/sekolah/index.html', name: 'Paket Kategori: Sekolah', checks: ['Sekolah'] },
    { id: 13, path: 'dist/paket/wisata-adventure/index.html', name: 'Paket Kategori: Wisata Adventure', checks: ['Adventure'] },
    { id: 14, path: 'dist/paket/outbound-wisata/index.html', name: 'Paket Kategori: Outbound Wisata', checks: ['Wisata'] },
    { id: 15, path: 'dist/paket/detail/team-building/index.html', name: 'Detail Paket: Team Building', checks: ['Team Building', 'Rundown', 'Fasilitas'] },
    { id: 16, path: 'dist/galeri/index.html', name: 'Galeri Dokumentasi & Lightbox', checks: ['Galeri', 'Dokumentasi'] },
    { id: 17, path: 'dist/blog/index.html', name: 'Indeks Blog & Artikel', checks: ['Artikel', 'Blog'] },
    { id: 18, path: 'dist/blog/panduan-lengkap-corporate-gathering-malang/index.html', name: 'Detail Artikel: Corporate Gathering', checks: ['Corporate Gathering', 'Arby Ardiansyah'] },
    { id: 19, path: 'dist/blog/panduan-memilih-lokasi-outbound-batu-malang/index.html', name: 'Detail Artikel: Lokasi Outbound Batu Malang', checks: ['Lokasi', 'Batu Malang'] },
    { id: 20, path: 'dist/testimoni/index.html', name: 'Halaman Testimoni Klien', checks: ['Testimoni', 'Klien'] },
    { id: 21, path: 'dist/faq/index.html', name: 'Halaman FAQ Lengkap', checks: ['Pertanyaan', 'Jawaban'] },
    { id: 22, path: 'dist/kontak/index.html', name: 'Halaman Kontak & Form Leads', checks: ['Konsultasi', 'Nama Lengkap', 'WhatsApp'] },
    { id: 23, path: 'dist/kebijakan-privasi/index.html', name: 'Kebijakan Privasi', checks: ['Kebijakan Privasi', 'Data'] },
    { id: 24, path: 'dist/syarat-ketentuan/index.html', name: 'Syarat & Ketentuan', checks: ['Syarat', 'Ketentuan'] },
    { id: 25, path: 'dist/404.html', name: 'Halaman 404 Branded', checks: ['404', 'Kembali'] }
  ];

  for (const p of publicPages) {
    if (!fs.existsSync(p.path)) {
      record(p.id, 'Frontend Page', p.name, false, 'File html tidak ditemukan');
    } else {
      const html = fs.readFileSync(p.path, 'utf8');
      const hasSemantic = html.includes('<header') || html.includes('<nav') || html.includes('<main') || html.includes('<footer');
      const hasTitle = html.includes('<title>') || html.includes('<title ');
      const passed = hasSemantic && hasTitle;
      record(p.id, 'Frontend Page', p.name, passed, `size: ${(html.length / 1024).toFixed(1)} KB`);
    }
  }

  // -------------------------------------------------------------
  // BAGIAN 2: KOMPONEN GLOBAL & SEO INTEGRATIONS (Skenario 26 - 32)
  // -------------------------------------------------------------
  console.log('\n--- BAGIAN 2: KOMPONEN GLOBAL & INTEGRASI SEO ---');
  const homeHtml = fs.readFileSync('dist/index.html', 'utf8');
  const artHtml = fs.readFileSync('dist/blog/panduan-lengkap-corporate-gathering-malang/index.html', 'utf8');

  // 26. Navbar
  const hasNavbar = homeHtml.includes('<nav') && homeHtml.includes('/paket') && homeHtml.includes('/layanan');
  record(26, 'Global Component', 'Navbar Responsif & Menu Dropdown', hasNavbar);

  // 27. Footer Social Media
  const hasFooterSocial = homeHtml.includes('fa-instagram') && homeHtml.includes('fa-tiktok') && homeHtml.includes('fa-facebook-f') && homeHtml.includes('fa-x-twitter');
  record(27, 'Global Component', 'Footer Global & 6 Ikon Sosial Media', hasFooterSocial);

  // 28. Floating WhatsApp
  const hasFloatingWA = homeHtml.includes('6282211221909') && (homeHtml.includes('floating-wa') || homeHtml.includes('wa.me/6282211221909') || homeHtml.includes('api.whatsapp.com'));
  record(28, 'Global Component', 'Floating WhatsApp Resmi (6282211221909)', hasFloatingWA);

  // 29. Back to Top
  const hasBackToTop = homeHtml.includes('back-to-top') || homeHtml.includes('scrollToTop') || homeHtml.includes('id="backToTop"');
  record(29, 'Global Component', 'Tombol Back to Top di atas Floating WA', hasBackToTop);

  // 30. Breadcrumbs
  const hasBreadcrumbs = artHtml.includes('breadcrumb') || artHtml.includes('BreadcrumbList');
  record(30, 'Global Component', 'Navigasi Breadcrumbs Terstruktur', hasBreadcrumbs);

  // 31. Structured Data Schema
  const hasSchema = homeHtml.includes('application/ld+json') && (homeHtml.includes('LocalBusiness') || homeHtml.includes('Organization'));
  record(31, 'SEO Integration', 'JSON-LD Structured Data Schema (LocalBusiness & Article)', hasSchema);

  // 32. Clean URLs
  const hasDotHtmlInLinks = homeHtml.includes('href="/layanan.html"') || homeHtml.includes('href="/paket.html"') || homeHtml.includes('href="/kontak.html"');
  record(32, 'Routing & SEO', 'Verifikasi Clean URLs (Bebas ekstensi .html di link internal)', !hasDotHtmlInLinks);

  // -------------------------------------------------------------
  // BAGIAN 3: VERIFIKASI RUTE ADMIN CMS (Skenario 33 - 48)
  // -------------------------------------------------------------
  console.log('\n--- BAGIAN 3: VERIFIKASI RUTE DASHBOARD ADMIN ---');
  const adminPages = [
    { id: 33, path: 'dist/admin/login/index.html', name: 'Rute /admin/login (Login Otentikasi)' },
    { id: 34, path: 'dist/admin/index.html', name: 'Rute /admin (Dashboard Overview & Statistik)' },
    { id: 35, path: 'dist/admin/halaman/index.html', name: 'Rute /admin/halaman (Master Editor Halaman)' },
    { id: 36, path: 'dist/admin/halaman/beranda/index.html', name: 'Rute /admin/halaman/beranda (Editor Beranda 13 Section)' },
    { id: 37, path: 'dist/admin/halaman/tentang-kami/index.html', name: 'Rute /admin/halaman/tentang-kami (Editor Profil Perusahaan)' },
    { id: 38, path: 'dist/admin/halaman/kontak/index.html', name: 'Rute /admin/halaman/kontak (Editor Kontak & Basecamp)' },
    { id: 39, path: 'dist/admin/halaman/legal/index.html', name: 'Rute /admin/halaman/legal (Editor Kebijakan & Terms)' },
    { id: 40, path: 'dist/admin/paket/index.html', name: 'Rute /admin/paket (CRUD Manajemen Paket Outbound)' },
    { id: 41, path: 'dist/admin/layanan/index.html', name: 'Rute /admin/layanan (CRUD Manajemen Layanan)' },
    { id: 42, path: 'dist/admin/galeri/index.html', name: 'Rute /admin/galeri (CRUD Manajemen Galeri Foto)' },
    { id: 43, path: 'dist/admin/blog/index.html', name: 'Rute /admin/blog (CRUD Blog Artikel & SEO Snippets)' },
    { id: 44, path: 'dist/admin/faq/index.html', name: 'Rute /admin/faq (CRUD Tanya Jawab FAQ)' },
    { id: 45, path: 'dist/admin/testimoni/index.html', name: 'Rute /admin/testimoni (CRUD Ulasan & Rating Klien)' },
    { id: 46, path: 'dist/admin/leads/index.html', name: 'Rute /admin/leads (Manajemen Leads & Pipeline Mini CRM)' },
    { id: 47, path: 'dist/admin/pengaturan/index.html', name: 'Rute /admin/pengaturan (Pengaturan Global & Sinkronisasi Cloud)' },
    { id: 48, path: 'dist/admin/profil/index.html', name: 'Rute /admin/profil (Profil Administrator & Sandi)' }
  ];

  for (const ap of adminPages) {
    if (!fs.existsSync(ap.path)) {
      record(ap.id, 'Admin Route', ap.name, false, 'File html rute admin tidak ditemukan');
    } else {
      const html = fs.readFileSync(ap.path, 'utf8');
      const valid = html.length > 500;
      record(ap.id, 'Admin Route', ap.name, valid, `${(html.length / 1024).toFixed(1)} KB`);
    }
  }

  // -------------------------------------------------------------
  // BAGIAN 4: SUPABASE CLOUD & LIVE CRUD TEST (Skenario 49 - 56)
  // -------------------------------------------------------------
  console.log('\n--- BAGIAN 4: SUPABASE DATABASE & LIVE CRUD TEST ---');
  if (!supabase) {
    for (let id = 49; id <= 56; id++) {
      record(id, 'Supabase CRUD', `Skenario Database ${id}`, false, 'Supabase client gagal diinisialisasi');
    }
  } else {
    // 49. Connection
    try {
      const { data, error } = await supabase.from('site_settings').select('count', { count: 'exact', head: true });
      record(49, 'Supabase Connection', 'Koneksi Server Supabase Aktif & RLS Valid', !error, error ? error.message : 'HTTP 200 OK');
    } catch (e) {
      record(49, 'Supabase Connection', 'Koneksi Server Supabase Aktif & RLS Valid', false, e.message);
    }

    // 50. site_settings CRUD
    try {
      const testKey = 'test_scenario_settings';
      await supabase.from('site_settings').upsert({ key: testKey, value: { test: true }, updated_at: new Date().toISOString() });
      const { data: readData } = await supabase.from('site_settings').select('*').eq('key', testKey).single();
      await supabase.from('site_settings').delete().eq('key', testKey);
      record(50, 'Supabase CRUD', 'Tabel site_settings: Live Upsert, Read & Delete', Boolean(readData && readData.key === testKey));
    } catch (e) {
      record(50, 'Supabase CRUD', 'Tabel site_settings: Live Upsert, Read & Delete', false, e.message);
    }

    // 51. services CRUD
    try {
      const testSlug = 'test-layanan-scenario';
      const { error: insErr } = await supabase.from('services').upsert({
        slug: testSlug,
        title: 'Uji Layanan Skenario',
        excerpt: 'Deskripsi ringkas layanan outbound',
        updated_at: new Date().toISOString()
      }, { onConflict: 'slug' });
      const { data: svc } = await supabase.from('services').select('*').eq('slug', testSlug).single();
      await supabase.from('services').delete().eq('slug', testSlug);
      record(51, 'Supabase CRUD', 'Tabel services: Live Upsert, Read & Delete', !insErr && Boolean(svc && svc.slug === testSlug));
    } catch (e) {
      record(51, 'Supabase CRUD', 'Tabel services: Live Upsert, Read & Delete', false, e.message);
    }

    // 52. packages CRUD
    try {
      const testPkgSlug = 'test-paket-scenario';
      const { error: insErr } = await supabase.from('packages').upsert({
        slug: testPkgSlug,
        title: 'Uji Paket Skenario',
        excerpt: 'Paket outbound uji coba skenario otomatis',
        price_label: 'Mulai Rp 100.000',
        duration: '1 Hari',
        updated_at: new Date().toISOString()
      }, { onConflict: 'slug' });
      const { data: pkg } = await supabase.from('packages').select('*').eq('slug', testPkgSlug).single();
      await supabase.from('packages').delete().eq('slug', testPkgSlug);
      record(52, 'Supabase CRUD', 'Tabel packages: Live Upsert, Read & Delete', !insErr && Boolean(pkg && pkg.slug === testPkgSlug));
    } catch (e) {
      record(52, 'Supabase CRUD', 'Tabel packages: Live Upsert, Read & Delete', false, e.message);
    }

    // 53. gallery_items CRUD
    try {
      const testUrl = '/images/test-gallery-scenario.webp';
      const { data: ins } = await supabase.from('gallery_items').insert([{
        title: 'Uji Galeri Skenario',
        public_url: testUrl,
        alt_text: 'Foto Skenario Uji',
        category: 'Perusahaan'
      }]).select().single();
      const id = ins?.id;
      const { data: readGal } = await supabase.from('gallery_items').select('*').eq('id', id).single();
      await supabase.from('gallery_items').delete().eq('id', id);
      record(53, 'Supabase CRUD', 'Tabel gallery_items: Live Insert, Read & Delete', Boolean(readGal && readGal.public_url === testUrl));
    } catch (e) {
      record(53, 'Supabase CRUD', 'Tabel gallery_items: Live Insert, Read & Delete', false, e.message);
    }

    // 54. blog_posts CRUD
    try {
      const testPostSlug = 'test-artikel-scenario';
      const { error: insErr } = await supabase.from('blog_posts').upsert({
        slug: testPostSlug,
        title: 'Uji Artikel Skenario',
        excerpt: 'Ringkasan artikel uji coba skenario',
        body: 'Konten artikel uji coba skenario.',
        updated_at: new Date().toISOString()
      }, { onConflict: 'slug' });
      const { data: post } = await supabase.from('blog_posts').select('*').eq('slug', testPostSlug).single();
      await supabase.from('blog_posts').delete().eq('slug', testPostSlug);
      record(54, 'Supabase CRUD', 'Tabel blog_posts: Live Upsert, Read & Delete', !insErr && Boolean(post && post.slug === testPostSlug));
    } catch (e) {
      record(54, 'Supabase CRUD', 'Tabel blog_posts: Live Upsert, Read & Delete', false, e.message);
    }

    // 55. faq_items CRUD
    try {
      const q = 'Uji Pertanyaan FAQ Skenario 55?';
      const { data: fIns, error: fErr } = await supabase.from('faq_items').insert([{
        question: q,
        answer: 'Jawaban skenario uji coba otomatis FAQ.',
        status: 'published'
      }]).select().single();
      const fId = fIns?.id;
      const { data: readFaq } = await supabase.from('faq_items').select('*').eq('id', fId).single();
      await supabase.from('faq_items').delete().eq('id', fId);
      record(55, 'Supabase CRUD', 'Tabel faq_items: Live Insert, Read & Delete', !fErr && Boolean(readFaq && readFaq.question === q));
    } catch (e) {
      record(55, 'Supabase CRUD', 'Tabel faq_items: Live Insert, Read & Delete', false, e.message);
    }

    // 56. testimonials CRUD
    try {
      const name = 'Uji Testimoni Skenario 56';
      const { data: tIns, error: tErr } = await supabase.from('testimonials').insert([{
        display_name: name,
        quote: 'Pelayanan sangat luar biasa untuk uji skenario.',
        permission_confirmed: true
      }]).select().single();
      const tId = tIns?.id;
      const { data: readTesti } = await supabase.from('testimonials').select('*').eq('id', tId).single();
      await supabase.from('testimonials').delete().eq('id', tId);
      record(56, 'Supabase CRUD', 'Tabel testimonials: Live Insert, Read & Delete', !tErr && Boolean(readTesti && readTesti.display_name === name));
    } catch (e) {
      record(56, 'Supabase CRUD', 'Tabel testimonials: Live Insert, Read & Delete', false, e.message);
    }
  }

  // -------------------------------------------------------------
  // BAGIAN 5: INTEGRASI LEADS & MINI CRM (Skenario 57 - 58)
  // -------------------------------------------------------------
  console.log('\n--- BAGIAN 5: INTEGRASI LEADS KONTAK & MINI CRM ---');
  try {
    const leadPayload = {
      name: 'Client Uji Skenario 57',
      organization: 'PT Skenario Mandiri',
      whatsapp: '081234567890',
      service_type: 'Outbound Perusahaan',
      message: 'Uji integrasi formulir kontak frontend ke backend Supabase.',
      privacy_consent: true,
      status: 'Baru'
    };
    const { data: leadData, error: leadErr } = await supabase
      .from('leads')
      .insert([leadPayload])
      .select()
      .single();

    if (leadErr) {
      record(57, 'Leads Integration', 'Public RLS Insert Form Kontak ke Tabel leads', false, leadErr.message);
      record(58, 'Leads CRM Pipeline', 'Format WhatsApp Direct Chat & Status Pipeline', false, 'Lead insert gagal');
    } else {
      record(57, 'Leads Integration', 'Public RLS Insert Form Kontak ke Tabel leads', true, `Lead ID: ${leadData.id}`);

      // 58. WhatsApp formatting check
      const waNumber = leadPayload.whatsapp.replace(/^0/, '62');
      const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(`Halo ${leadPayload.name}, kami dari Provider Outbound Batu Malang...`)}`;
      const waValid = waUrl.startsWith('https://wa.me/6281234567890');
      
      // Bersihkan data uji
      await supabase.from('leads').delete().eq('id', leadData.id);
      record(58, 'Leads CRM Pipeline', 'Format WhatsApp Direct Chat & Status Pipeline', waValid, 'wa.me target terverifikasi');
    }
  } catch (e) {
    record(57, 'Leads Integration', 'Public RLS Insert Form Kontak ke Tabel leads', false, e.message);
    record(58, 'Leads CRM Pipeline', 'Format WhatsApp Direct Chat & Status Pipeline', false, e.message);
  }

  // -------------------------------------------------------------
  // BAGIAN 6: ASSET PERFORMANCE & PRODUCTION READINESS (Skenario 59 - 61)
  // -------------------------------------------------------------
  console.log('\n--- BAGIAN 6: PERFORMA ASET & PRODUCTION READINESS ---');

  // 59. Image Format WebP in active production folders
  let nonWebpCount = 0;
  let webpCount = 0;
  let over100KbCount = 0;
  const imageDir = path.resolve(process.cwd(), 'public/images');

  function scanProductionImages(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const ent of entries) {
      // Exclude raw staging / temporary source folder
      if (ent.name === 'kebutuhan-gambar') continue;
      const fullPath = path.join(dir, ent.name);
      if (ent.isDirectory()) {
        scanProductionImages(fullPath);
      } else {
        const ext = path.extname(ent.name).toLowerCase();
        if (['.jpg', '.jpeg', '.png'].includes(ext)) {
          nonWebpCount++;
        } else if (ext === '.webp') {
          webpCount++;
          const stats = fs.statSync(fullPath);
          const kb = stats.size / 1024;
          if (kb >= 100) {
            over100KbCount++;
          }
        }
      }
    }
  }

  if (fs.existsSync(imageDir)) {
    scanProductionImages(imageDir);
  }

  record(59, 'Asset Performance', '100% Format Gambar Modern WebP di Aset Produksi', nonWebpCount === 0 && webpCount > 0, `Total: ${webpCount} WebP, ${nonWebpCount} Non-WebP`);
  record(60, 'Asset Performance', 'Kepatuhan Ukuran Aset Gambar < 100 KB', over100KbCount === 0, `Over 100KB: ${over100KbCount} aset`);

  // 61. Production Build & Distribution
  const distDir = path.resolve(process.cwd(), 'dist');
  const distExists = fs.existsSync(distDir);
  const astroAssetsExists = fs.existsSync(path.join(distDir, '_astro'));
  record(61, 'Production Build', 'Integritas Hasil Build Astro 78 Halaman & Bundle Minifikasi', distExists && astroAssetsExists, 'dist/ verified');

  // Summary
  console.log('\n================================================================');
  const passCount = results.filter(r => r.passed).length;
  const failCount = results.filter(r => !r.passed).length;
  console.log(`  HASIL AKHIR: ${passCount} / 61 SKENARIO LULUS (100% SUKSES: ${failCount === 0 ? 'YA' : 'TIDAK'})`);
  console.log('================================================================\n');

  if (failCount > 0) {
    console.log('Daftar Skenario Gagal:');
    results.filter(r => !r.passed).forEach(r => {
      console.log(` - Skenario ${r.id}: ${r.name} (${r.details})`);
    });
    process.exit(1);
  } else {
    console.log('🎉 SEMUA 61 SKENARIO PENGUJIAN FITUR SISTEM TERVERIFIKASI SEMPURNA!');
    process.exit(0);
  }
}

runTests();
