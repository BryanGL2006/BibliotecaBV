import { useState, useMemo } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
type Page =
  | "login"
  | "dashboard"
  | "catalog"
  | "add-book"
  | "loans"
  | "register-loan"
  | "returns"
  | "readers"
  | "register-reader"
  | "reports";

type BookStatus = "Disponible" | "Prestado" | "En Reparación" | "Perdido";
type LoanStatus = "Activo" | "Devuelto" | "Vencido";
type ReaderStatus = "Activo" | "Suspendido";

interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  category: string;
  status: BookStatus;
  location: string;
  year: number;
  editorial: string;
  description: string;
  copies: number;
}

interface Loan {
  id: number;
  folio: string;
  readerId: number;
  readerName: string;
  bookId: number;
  bookTitle: string;
  loanDate: string;
  dueDate: string;
  status: LoanStatus;
}

interface Reader {
  id: number;
  folio: string;
  name: string;
  address: string;
  colonia: string;
  municipio: string;
  phone: string;
  email: string;
  birthdate: string;
  idType: string;
  idNumber: string;
  registrationDate: string;
  status: ReaderStatus;
}

// ─── Initial Data ─────────────────────────────────────────────────────────────
const INITIAL_BOOKS: Book[] = [
  { id: 1, title: "Cien años de soledad", author: "Gabriel García Márquez", isbn: "978-0307474728", category: "Ficción", status: "Disponible", location: "Estante A1", year: 1967, editorial: "Sudamericana", description: "Novela del realismo mágico.", copies: 3 },
  { id: 2, title: "Breve historia del tiempo", author: "Stephen Hawking", isbn: "978-6070743511", category: "Ciencia", status: "Prestado", location: "Estante C3", year: 1988, editorial: "Crítica", description: "Cosmología para el público general.", copies: 2 },
  { id: 3, title: "Pedro Páramo", author: "Juan Rulfo", isbn: "978-8437604183", category: "Ficción", status: "Disponible", location: "Estante A2", year: 1955, editorial: "FCE", description: "Obra maestra de la literatura mexicana.", copies: 4 },
  { id: 4, title: "La patria del criollo", author: "Severo Martínez Peláez", isbn: "978-0891404121", category: "Historia", status: "En Reparación", location: "Área Técnica", year: 1970, editorial: "EDUCA", description: "Historia colonial de Guatemala.", copies: 1 },
  { id: 5, title: "El principito", author: "Antoine de Saint-Exupéry", isbn: "978-6074570021", category: "Infantil", status: "Disponible", location: "Estante E1", year: 1943, editorial: "Salamandra", description: "Clásico de la literatura infantil.", copies: 5 },
  { id: 6, title: "Sapiens: De animales a dioses", author: "Yuval Noah Harari", isbn: "978-6073129848", category: "Historia", status: "Prestado", location: "Estante B2", year: 2011, editorial: "Debate", description: "Historia de la humanidad.", copies: 2 },
  { id: 7, title: "Ficciones", author: "Jorge Luis Borges", isbn: "978-8420633114", category: "Ficción", status: "Perdido", location: "N/A", year: 1944, editorial: "Alianza", description: "Cuentos fantásticos de Borges.", copies: 0 },
  { id: 8, title: "Donde viven los monstruos", author: "Maurice Sendak", isbn: "978-8420431802", category: "Infantil", status: "Disponible", location: "Estante E2", year: 1963, editorial: "Altea", description: "Álbum ilustrado clásico.", copies: 3 },
  { id: 9, title: "El amor en los tiempos del cólera", author: "Gabriel García Márquez", isbn: "978-0307389732", category: "Ficción", status: "Disponible", location: "Estante A3", year: 1985, editorial: "Sudamericana", description: "Historia de amor épica.", copies: 2 },
  { id: 10, title: "Rayuela", author: "Julio Cortázar", isbn: "978-8420422664", category: "Ficción", status: "Disponible", location: "Estante A4", year: 1963, editorial: "Alfaguara", description: "Novela experimental.", copies: 2 },
  { id: 11, title: "La metamorfosis", author: "Franz Kafka", isbn: "978-8420674353", category: "Ficción", status: "Disponible", location: "Estante B1", year: 1915, editorial: "Alianza", description: "Cuento kafkiano por excelencia.", copies: 3 },
  { id: 12, title: "1984", author: "George Orwell", isbn: "978-0451524935", category: "Ficción", status: "Disponible", location: "Estante B3", year: 1949, editorial: "Secker & Warburg", description: "Distopía clásica.", copies: 4 },
];

const INITIAL_READERS: Reader[] = [
  { id: 1, folio: "#LEC-0182", name: "Alejandro Ruiz Gómez", address: "Calle Flores #14", colonia: "Col. Centro", municipio: "Amatitlán", phone: "551-234-5678", email: "alejandro.ruiz@ejemplo.com", birthdate: "1990-03-15", idType: "INE (Credencial de Elector)", idNumber: "IDMEX18293028", registrationDate: "12/Ene/2023", status: "Activo" },
  { id: 2, folio: "#LEC-0241", name: "Sofía Martínez Corona", address: "Av. Jacarandas #402", colonia: "El Vergel", municipio: "Tlalpan", phone: "559-876-5432", email: "sofia.martinez@ejemplo.com", birthdate: "1985-07-22", idType: "Pasaporte", idNumber: "G12345678", registrationDate: "24/Mar/2023", status: "Activo" },
  { id: 3, folio: "#LEC-0309", name: "Diego Delgado Méndez", address: "Paseo de la Reforma #88", colonia: "Baja California", municipio: "Cuauhtémoc", phone: "554-321-0987", email: "diego.delgado@ejemplo.com", birthdate: "1995-11-08", idType: "INE (Credencial de Elector)", idNumber: "IDMEX29384756", registrationDate: "05/Jun/2023", status: "Activo" },
  { id: 4, folio: "#LEC-0355", name: "Lucía Méndez Morales", address: "Callejón del Beso #102", colonia: "Col. Roma", municipio: "Cuauhtémoc", phone: "553-654-7890", email: "lucia.mendez@ejemplo.com", birthdate: "1978-04-30", idType: "INE (Credencial de Elector)", idNumber: "IDMEX38475869", registrationDate: "11/Ago/2023", status: "Suspendido" },
  { id: 5, folio: "#LEC-0394", name: "Mateo Ortiz Vargas", address: "Prolongación Hidalgo S/N", colonia: "San Ángel", municipio: "Álvaro Obregón", phone: "558-456-1122", email: "mateo.ortiz@ejemplo.com", birthdate: "2000-01-15", idType: "Credencial Estudiantil", idNumber: "EST20001234", registrationDate: "02/Oct/2023", status: "Activo" },
  { id: 6, folio: "#LEC-0412", name: "Ximena Cruz Castro", address: "Calle Mina #74", colonia: "El Sauz", municipio: "Amatitlán", phone: "551-789-3344", email: "ximena.cruz@ejemplo.com", birthdate: "1992-09-18", idType: "INE (Credencial de Elector)", idNumber: "IDMEX45678901", registrationDate: "15/Nov/2023", status: "Activo" },
  { id: 7, folio: "#LEC-0453", name: "Ricardo Salinas Benítez", address: "Av. Morelos #19", colonia: "Barrio San Juan", municipio: "Iztapalapa", phone: "552-998-8877", email: "ricardo.salinas@ejemplo.com", birthdate: "1988-12-05", idType: "Pasaporte", idNumber: "P98765432", registrationDate: "20/Dic/2023", status: "Suspendido" },
];

const INITIAL_LOANS: Loan[] = [
  { id: 1, folio: "PR-2024-001", readerId: 3, readerName: "Carlos Santizo", bookId: 1, bookTitle: "Cien años de soledad", loanDate: "15/May/2024", dueDate: "29/May/2024", status: "Devuelto" },
  { id: 2, folio: "PR-2024-002", readerId: 2, readerName: "Elena Ramírez", bookId: 9, bookTitle: "El amor en los tiempos del cólera", loanDate: "18/May/2024", dueDate: "01/Jun/2024", status: "Activo" },
  { id: 3, folio: "PR-2024-003", readerId: 5, readerName: "Mateo Ortiz", bookId: 7, bookTitle: "Ficciones", loanDate: "05/May/2024", dueDate: "19/May/2024", status: "Vencido" },
  { id: 4, folio: "PR-2024-004", readerId: 6, readerName: "Isabella Cruz", bookId: 5, bookTitle: "El principito", loanDate: "20/May/2024", dueDate: "03/Jun/2024", status: "Activo" },
  { id: 5, folio: "PR-2024-005", readerId: 1, readerName: "Gerardo Gómez", bookId: 11, bookTitle: "La metamorfosis", loanDate: "12/May/2024", dueDate: "26/May/2024", status: "Devuelto" },
  { id: 6, folio: "PR-2024-006", readerId: 4, readerName: "Lucía Méndez", bookId: 1, bookTitle: "Cien años de soledad", loanDate: "22/May/2024", dueDate: "05/Jun/2024", status: "Activo" },
  { id: 7, folio: "PR-2024-007", readerId: 7, readerName: "Andrés Velásquez", bookId: 12, bookTitle: "1984", loanDate: "01/May/2024", dueDate: "15/May/2024", status: "Vencido" },
  { id: 8, folio: "PR-2024-008", readerId: 2, readerName: "Verónica Rivas", bookId: 10, bookTitle: "Rayuela", loanDate: "25/May/2024", dueDate: "08/Jun/2024", status: "Activo" },
  { id: 9, folio: "PR-2024-102", readerId: 1, readerName: "Ramiro Juárez", bookId: 11, bookTitle: "La tregua", loanDate: "05/May/2024", dueDate: "19/May/2024", status: "Activo" },
  { id: 10, folio: "PR-2024-105", readerId: 2, readerName: "Silvia Paredes", bookId: 9, bookTitle: "El laberinto de la soledad", loanDate: "20/May/2024", dueDate: "03/Jun/2024", status: "Activo" },
  { id: 11, folio: "PR-2024-109", readerId: 3, readerName: "Fernando Díaz", bookId: 8, bookTitle: "La divina comedia", loanDate: "10/May/2024", dueDate: "24/May/2024", status: "Activo" },
  { id: 12, folio: "PR-2024-112", readerId: 5, readerName: "Claudia Rosas", bookId: 3, bookTitle: "Antología Poética", loanDate: "22/May/2024", dueDate: "05/Jun/2024", status: "Activo" },
  { id: 13, folio: "PR-2024-114", readerId: 7, readerName: "Arturo Paz", bookId: 6, bookTitle: "Las venas abiertas de América Latina", loanDate: "02/May/2024", dueDate: "16/May/2024", status: "Activo" },
  { id: 14, folio: "PR-2024-118", readerId: 6, readerName: "Gabriela Luna", bookId: 2, bookTitle: "Popol Vuh", loanDate: "25/May/2024", dueDate: "08/Jun/2024", status: "Activo" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const teal = "#1A8C7C";
const tealLight = "#E8F5F3";

function statusColor(status: string) {
  const map: Record<string, string> = {
    Disponible: "#16a34a", Activo: "#16a34a",
    Prestado: "#d97706", "En Reparación": "#6b7280",
    Perdido: "#dc2626", Vencido: "#dc2626",
    Devuelto: "#6b7280", Suspendido: "#f97316",
  };
  return map[status] ?? "#6b7280";
}
function statusBg(status: string) {
  const map: Record<string, string> = {
    Disponible: "#dcfce7", Activo: "#dcfce7",
    Prestado: "#fef3c7", "En Reparación": "#f3f4f6",
    Perdido: "#fee2e2", Vencido: "#fee2e2",
    Devuelto: "#f3f4f6", Suspendido: "#ffedd5",
  };
  return map[status] ?? "#f3f4f6";
}

function Badge({ status }: { status: string }) {
  return (
    <span style={{ backgroundColor: statusBg(status), color: statusColor(status), fontSize: 12, fontWeight: 600, padding: "2px 10px", borderRadius: 999 }}>
      {status}
    </span>
  );
}

function Btn({ children, onClick, variant = "primary", small }: { children: React.ReactNode; onClick?: () => void; variant?: "primary" | "outline" | "danger" | "ghost"; small?: boolean }) {
  const base: React.CSSProperties = { cursor: "pointer", borderRadius: 8, fontWeight: 600, border: "none", display: "inline-flex", alignItems: "center", gap: 6, transition: "opacity .15s", fontSize: small ? 13 : 14, padding: small ? "5px 12px" : "9px 18px" };
  const variants: Record<string, React.CSSProperties> = {
    primary: { backgroundColor: teal, color: "#fff" },
    outline: { backgroundColor: "#fff", color: teal, border: `1.5px solid ${teal}` },
    danger: { backgroundColor: "#fee2e2", color: "#dc2626" },
    ghost: { backgroundColor: "transparent", color: "#6b7280" },
  };
  return <button style={{ ...base, ...variants[variant] }} onClick={onClick}>{children}</button>;
}

function TrashIcon() {
  return (
    <svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v5M14 11v5" />
    </svg>
  );
}

function Input({ label, placeholder, value, onChange, type = "text" }: { label?: string; placeholder?: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {label && <label style={{ fontSize: 13, fontWeight: 500, color: "#374151" }}>{label}</label>}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{ border: "1.5px solid #e5e7eb", borderRadius: 8, padding: "9px 12px", fontSize: 14, color: "#1f2937", outline: "none", background: "#fff" }}
      />
    </div>
  );
}

function Select({ label, value, onChange, options }: { label?: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {label && <label style={{ fontSize: 13, fontWeight: 500, color: "#374151" }}>{label}</label>}
      <select value={value} onChange={e => onChange(e.target.value)} style={{ border: "1.5px solid #e5e7eb", borderRadius: 8, padding: "9px 12px", fontSize: 14, color: "#1f2937", background: "#fff", cursor: "pointer" }}>
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
    </div>
  );
}

function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.4)", zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ background: "#fff", borderRadius: 16, padding: 32, width: "100%", maxWidth: 540, maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1f2937" }}>{title}</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: "#6b7280" }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
const NAV = [
  { id: "dashboard", label: "Inicio", icon: null },
  { id: "catalog", label: "Catálogo", icon: "📖" },
  { id: "loans", label: "Préstamos", icon: "⇄" },
  { id: "returns", label: "Devoluciones", icon: "↩" },
  { id: "readers", label: "Lectores", icon: "👤" },
  { id: "reports", label: "Reportes", icon: "📋" },
];

function Sidebar({ page, setPage, onLogout }: { page: Page; setPage: (p: Page) => void; onLogout: () => void }) {
  const active = page === "add-book" ? "catalog" : page === "register-loan" ? "loans" : page === "register-reader" ? "readers" : page;
  return (
    <aside style={{ width: 210, background: "#fff", borderRight: "1px solid #e5e7eb", display: "flex", flexDirection: "column", flexShrink: 0, height: "100vh", position: "sticky", top: 0 }}>
      <div style={{ padding: "20px 16px", display: "flex", alignItems: "center", gap: 10, borderBottom: "1px solid #f3f4f6" }}>
        <div style={{ width: 34, height: 34, background: teal, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>📚</div>
        <span style={{ fontWeight: 700, fontSize: 16, color: "#1f2937" }}>Bibliotech</span>
      </div>
      <nav style={{ flex: 1, padding: "12px 8px" }}>
        {NAV.map(n => (
          <button key={n.id} onClick={() => setPage(n.id as Page)} style={{ width: "100%", textAlign: "left", display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 8, border: "none", cursor: "pointer", fontWeight: active === n.id ? 600 : 400, fontSize: 14, marginBottom: 2, background: active === n.id ? tealLight : "transparent", color: active === n.id ? teal : "#374151" }}>
            {n.icon && <span style={{ fontSize: 16 }}>{n.icon}</span>}{n.label}
          </button>
        ))}
      </nav>
      <div style={{ padding: "12px 16px", borderTop: "1px solid #f3f4f6", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#d1d5db", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>👩</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#1f2937" }}>Bibliotecario(a)</div>
        </div>
      </div>
      <button onClick={onLogout} style={{ margin: "0 16px 16px", display: "flex", alignItems: "center", gap: 6, color: "#dc2626", background: "none", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 500 }}>
        <span>→</span> Cerrar Sesión
      </button>
    </aside>
  );
}

// ─── Login ────────────────────────────────────────────────────────────────────
function LoginPage({ onLogin }: { onLogin: () => void }) {
  const [pwd, setPwd] = useState("");
  const [error, setError] = useState("");
  const handle = () => {
    if (pwd === "2006") { onLogin(); }
    else setError("Contraseña incorrecta.");
  };
  return (
    <div style={{ minHeight: "100vh", background: "#F5F3EE", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <div style={{ marginBottom: 16, textAlign: "center" }}>
        <div style={{ width: 56, height: 56, background: teal, borderRadius: 14, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 28, marginBottom: 12 }}>📚</div>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: "#1f2937", margin: 0 }}>Bibliotech</h1>
        <p style={{ color: "#6b7280", fontSize: 14, margin: "4px 0 0" }}>Sistema de Gestión para Bibliotecas Comunitarias</p>
      </div>
      <div style={{ background: "#fff", borderRadius: 16, padding: 32, width: 380, boxShadow: "0 1px 8px rgba(0,0,0,.08)" }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1f2937", margin: "0 0 4px" }}>Iniciar Sesión</h2>
        <p style={{ color: "#6b7280", fontSize: 14, margin: "0 0 20px" }}>Ingresa tus credenciales de encargado/bibliotecario</p>
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 13, fontWeight: 500, color: "#374151", display: "block", marginBottom: 4 }}>Contraseña</label>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }}>🔒</span>
            <input type="password" placeholder="••••••••••••" value={pwd} onChange={e => setPwd(e.target.value)} onKeyDown={e => e.key === "Enter" && handle()} style={{ width: "100%", border: "1.5px solid #e5e7eb", borderRadius: 8, padding: "10px 12px 10px 36px", fontSize: 14, boxSizing: "border-box", outline: "none" }} />
          </div>
          {error && <p style={{ color: "#dc2626", fontSize: 12, margin: "6px 0 0" }}>{error}</p>}
        </div>
        <button onClick={handle} style={{ width: "100%", background: teal, color: "#fff", border: "none", borderRadius: 8, padding: "12px", fontSize: 15, fontWeight: 600, cursor: "pointer" }}>Iniciar Sesión</button>
        <p style={{ fontSize: 11, color: "#9ca3af", textAlign: "center", margin: "12px 0 0" }}>Acceso exclusivo para personal autorizado</p>
      </div>
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
function BarChart({ data }: { data: { label: string; value: number }[] }) {
  const max = Math.max(...data.map(d => d.value));
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 12, height: 140, paddingBottom: 24, position: "relative" }}>
      {data.map(d => (
        <div key={d.label} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, height: "100%" }}>
          <div style={{ flex: 1, display: "flex", alignItems: "flex-end", width: "100%" }}>
            <div style={{ width: "100%", height: `${(d.value / max) * 100}%`, background: teal, borderRadius: "4px 4px 0 0", minHeight: 8 }} />
          </div>
          <span style={{ fontSize: 11, color: "#6b7280", whiteSpace: "nowrap" }}>{d.label}</span>
        </div>
      ))}
    </div>
  );
}

function DonutChart({ segments }: { segments: { label: string; value: number; color: string }[] }) {
  const total = segments.reduce((s, x) => s + x.value, 0);
  let cumulative = 0;
  const r = 52, cx = 64, cy = 64, strokeW = 20;
  const circ = 2 * Math.PI * r;
  return (
    <svg width={128} height={128} viewBox="0 0 128 128">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f3f4f6" strokeWidth={strokeW} />
      {segments.map((seg, i) => {
        const offset = circ - (seg.value / total) * circ;
        const rotation = (cumulative / total) * 360 - 90;
        cumulative += seg.value;
        return <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={seg.color} strokeWidth={strokeW} strokeDasharray={`${circ} ${circ}`} strokeDashoffset={offset} style={{ transformOrigin: `${cx}px ${cy}px`, transform: `rotate(${rotation}deg)` }} />;
      })}
      <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" fontSize={14} fontWeight={700} fill="#1f2937">1.2K</text>
    </svg>
  );
}

function StatCard({ label, value, icon, iconBg }: { label: string; value: string | number; icon: string; iconBg: string }) {
  return (
    <div style={{ background: "#fff", borderRadius: 12, padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flex: 1, minWidth: 160 }}>
      <div>
        <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 6 }}>{label}</div>
        <div style={{ fontSize: 28, fontWeight: 700, color: "#1f2937" }}>{value}</div>
      </div>
      <div style={{ width: 36, height: 36, background: iconBg, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{icon}</div>
    </div>
  );
}

function Dashboard({ books, loans, readers }: { books: Book[]; loans: Loan[]; readers: Reader[] }) {
  const activeLoans = loans.filter(l => l.status === "Activo").length;
  const pendingReturns = loans.filter(l => l.status === "Vencido").length;
  const recent = [...loans].slice(-4).reverse();
  const monthData = [
    { label: "Ene", value: 32 }, { label: "Feb", value: 48 }, { label: "Mar", value: 61 },
    { label: "Abr", value: 55 }, { label: "May", value: 73 }, { label: "Jun", value: 83 },
  ];
  const available = books.filter(b => b.status === "Disponible").length;
  const borrowed = books.filter(b => b.status === "Prestado").length;
  const repair = books.filter(b => b.status === "En Reparación").length;
  const lost = books.filter(b => b.status === "Perdido").length;
  const donut = [
    { label: "Disponible (78%)", value: available, color: teal },
    { label: "Prestado (15%)", value: borrowed, color: "#d97706" },
    { label: "Reparación (5%)", value: repair, color: "#9ca3af" },
    { label: "Perdido (2%)", value: lost, color: "#dc2626" },
  ];
  return (
    <div style={{ padding: 32 }}>
      <h1 style={{ fontSize: 26, fontWeight: 700, color: "#1f2937", margin: "0 0 4px" }}>¡Hola!</h1>
      <p style={{ color: "#6b7280", fontSize: 14, margin: "0 0 24px" }}>Aquí tienes el resumen operativo de la biblioteca comunitaria para hoy.</p>
      <div style={{ display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
        <StatCard label="Libros en Acervo" value={books.length.toLocaleString()} icon="📗" iconBg="#e8f5f3" />
        <StatCard label="Préstamos Activos" value={activeLoans} icon="↗" iconBg="#fff7ed" />
        <StatCard label="Devoluciones Pendientes" value={pendingReturns} icon="🔄" iconBg="#e0f2fe" />
        <StatCard label="Lectores Registrados" value={readers.length} icon="👥" iconBg="#f3e8ff" />
      </div>
      <div style={{ display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
        <div style={{ background: "#fff", borderRadius: 12, padding: 24, flex: 2, minWidth: 260 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: "#1f2937", margin: "0 0 16px" }}>Préstamos por Mes (Ene–Jun)</h3>
          <BarChart data={monthData} />
        </div>
        <div style={{ background: "#fff", borderRadius: 12, padding: 24, flex: 1, minWidth: 200 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: "#1f2937", margin: "0 0 16px" }}>Estado del Acervo</h3>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <DonutChart segments={donut} />
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {donut.map(d => (
                <div key={d.label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#374151" }}>
                  <div style={{ width: 10, height: 10, borderRadius: 2, background: d.color }} />
                  {d.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div style={{ background: "#fff", borderRadius: 12, padding: 24 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: "#1f2937", margin: "0 0 16px" }}>Últimos Préstamos Registrados</h3>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #f3f4f6" }}>
              {["Lector", "Libro", "Fecha Préstamo", "Fecha Límite", "Estado"].map(h => (
                <th key={h} style={{ textAlign: "left", padding: "8px 12px", color: "#6b7280", fontWeight: 500 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recent.map(l => (
              <tr key={l.id} style={{ borderBottom: "1px solid #f9fafb" }}>
                <td style={{ padding: "10px 12px", color: "#1f2937" }}>{l.readerName}</td>
                <td style={{ padding: "10px 12px", color: "#374151" }}>{l.bookTitle}</td>
                <td style={{ padding: "10px 12px", color: "#6b7280" }}>{l.loanDate}</td>
                <td style={{ padding: "10px 12px", color: "#6b7280" }}>{l.dueDate}</td>
                <td style={{ padding: "10px 12px" }}><Badge status={l.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Catalog ──────────────────────────────────────────────────────────────────
function Catalog({ books, setBooks, setPage }: { books: Book[]; setBooks: (b: Book[]) => void; setPage: (p: Page) => void }) {
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("Todas");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [editBook, setEditBook] = useState<Book | null>(null);
  const [page, setLocalPage] = useState(1);
  const PER = 8;

  const categories = ["Todas", ...Array.from(new Set(books.map(b => b.category)))];
  const statuses = ["Todos", "Disponible", "Prestado", "En Reparación", "Perdido"];

  const filtered = useMemo(() => books.filter(b => {
    const q = search.toLowerCase();
    const matchQ = !q || b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q) || b.isbn.includes(q);
    const matchC = catFilter === "Todas" || b.category === catFilter;
    const matchS = statusFilter === "Todos" || b.status === statusFilter;
    return matchQ && matchC && matchS;
  }), [books, search, catFilter, statusFilter]);

  const totalPages = Math.ceil(filtered.length / PER);
  const shown = filtered.slice((page - 1) * PER, page * PER);

  const deleteBook = (id: number) => setBooks(books.filter(b => b.id !== id));
  const saveEdit = (updated: Book) => { setBooks(books.map(b => b.id === updated.id ? updated : b)); setEditBook(null); };

  return (
    <div style={{ padding: 32 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: "#1f2937", margin: "0 0 4px" }}>Catálogo de Libros</h1>
          <p style={{ color: "#6b7280", fontSize: 14, margin: 0 }}>Administra el inventario de libros, agrega nuevos títulos y supervisa estados.</p>
        </div>
        <Btn onClick={() => setPage("add-book")}>+ Añadir Libro</Btn>
      </div>
      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        <input placeholder="Buscar por título, autor, ISBN..." value={search} onChange={e => { setSearch(e.target.value); setLocalPage(1); }} style={{ flex: 1, minWidth: 220, border: "1.5px solid #e5e7eb", borderRadius: 8, padding: "9px 12px", fontSize: 14, color: "#1f2937", outline: "none" }} />
        <select value={catFilter} onChange={e => { setCatFilter(e.target.value); setLocalPage(1); }} style={{ border: "1.5px solid #e5e7eb", borderRadius: 8, padding: "9px 12px", fontSize: 14, color: "#374151", background: "#fff" }}>
          {categories.map(c => <option key={c}>{c}</option>)}
        </select>
        <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setLocalPage(1); }} style={{ border: "1.5px solid #e5e7eb", borderRadius: 8, padding: "9px 12px", fontSize: 14, color: "#374151", background: "#fff" }}>
          {statuses.map(s => <option key={s}>{s}</option>)}
        </select>
      </div>
      <div style={{ background: "#fff", borderRadius: 12, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
              {["Título", "Autor", "ISBN", "Categoría", "Estado", "Ubicación", "Acciones"].map(h => (
                <th key={h} style={{ textAlign: "left", padding: "11px 14px", color: "#6b7280", fontWeight: 500 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {shown.map(b => (
              <tr key={b.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                <td style={{ padding: "11px 14px", fontWeight: 600, color: "#1f2937" }}>{b.title}</td>
                <td style={{ padding: "11px 14px", color: "#374151" }}>{b.author}</td>
                <td style={{ padding: "11px 14px", color: "#6b7280" }}>{b.isbn}</td>
                <td style={{ padding: "11px 14px", color: "#374151" }}>{b.category}</td>
                <td style={{ padding: "11px 14px" }}><Badge status={b.status} /></td>
                <td style={{ padding: "11px 14px", color: "#6b7280" }}>{b.location}</td>
                <td style={{ padding: "11px 14px", display: "flex", gap: 8 }}>
                  <button onClick={() => setEditBook(b)} title="Editar" style={{ background: "none", border: "none", cursor: "pointer", fontSize: 16, color: "#6b7280" }}>✏️</button>
                  <button onClick={() => deleteBook(b.id)} title="Eliminar" style={{ background: "none", border: "none", cursor: "pointer", fontSize: 16, color: "#dc2626" }}>🗑️</button>
                </td>
              </tr>
            ))}
            {shown.length === 0 && (
              <tr><td colSpan={7} style={{ padding: 32, textAlign: "center", color: "#9ca3af" }}>No se encontraron libros.</td></tr>
            )}
          </tbody>
        </table>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", borderTop: "1px solid #f3f4f6" }}>
          <span style={{ fontSize: 13, color: "#6b7280" }}>Mostrando {(page - 1) * PER + 1}–{Math.min(page * PER, filtered.length)} de {filtered.length} libros</span>
          <div style={{ display: "flex", gap: 6 }}>
            <Btn variant="outline" small onClick={() => setLocalPage(p => Math.max(1, p - 1))}>Anterior</Btn>
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i} onClick={() => setLocalPage(i + 1)} style={{ width: 32, height: 32, border: "1.5px solid #e5e7eb", borderRadius: 6, fontSize: 13, cursor: "pointer", background: page === i + 1 ? teal : "#fff", color: page === i + 1 ? "#fff" : "#374151", fontWeight: page === i + 1 ? 700 : 400 }}>{i + 1}</button>
            ))}
            <Btn variant="outline" small onClick={() => setLocalPage(p => Math.min(totalPages, p + 1))}>Siguiente</Btn>
          </div>
        </div>
      </div>
      {editBook && <EditBookModal book={editBook} onSave={saveEdit} onClose={() => setEditBook(null)} />}
    </div>
  );
}

function EditBookModal({ book, onSave, onClose }: { book: Book; onSave: (b: Book) => void; onClose: () => void }) {
  const [form, setForm] = useState({ ...book });
  const set = (k: keyof Book) => (v: string) => setForm(f => ({ ...f, [k]: v }));
  return (
    <Modal title="Editar Libro" onClose={onClose}>
      <div style={{ display: "grid", gap: 12 }}>
        <Input label="Título" value={form.title} onChange={set("title")} />
        <Input label="Autor" value={form.author} onChange={set("author")} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Input label="ISBN" value={form.isbn} onChange={set("isbn")} />
          <Input label="Editorial" value={form.editorial} onChange={set("editorial")} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Select label="Categoría" value={form.category} onChange={set("category")} options={["Ficción", "Ciencia", "Historia", "Infantil", "Poesía", "Biografía", "Otro"]} />
          <Select label="Estado" value={form.status} onChange={v => setForm(f => ({ ...f, status: v as BookStatus }))} options={["Disponible", "Prestado", "En Reparación", "Perdido"]} />
        </div>
        <Input label="Ubicación" value={form.location} onChange={set("location")} />
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 8 }}>
          <Btn variant="outline" onClick={onClose}>Cancelar</Btn>
          <Btn onClick={() => onSave(form)}>Guardar Cambios</Btn>
        </div>
      </div>
    </Modal>
  );
}

// ─── Add Book ─────────────────────────────────────────────────────────────────
function AddBook({ books, setBooks, setPage }: { books: Book[]; setBooks: (b: Book[]) => void; setPage: (p: Page) => void }) {
  const [form, setForm] = useState({ title: "", author: "", isbn: "", editorial: "", year: "", category: "Ficción / Novela", location: "", status: "Disponible", copies: "", description: "" });
  const set = (k: string) => (v: string) => setForm(f => ({ ...f, [k]: v }));
  const save = () => {
    if (!form.title || !form.author) return;
    const newBook: Book = {
      id: Math.max(...books.map(b => b.id)) + 1,
      title: form.title, author: form.author, isbn: form.isbn,
      editorial: form.editorial, year: parseInt(form.year) || 2024,
      category: form.category.split(" / ")[0],
      location: form.location, status: form.status as BookStatus,
      copies: parseInt(form.copies) || 1, description: form.description,
    };
    setBooks([...books, newBook]);
    setPage("catalog");
  };
  return (
    <div style={{ padding: 32 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, color: "#1f2937", margin: "0 0 4px" }}>Añadir Libro al Catálogo</h1>
      <p style={{ color: "#6b7280", fontSize: 14, margin: "0 0 24px" }}>Registra una nueva obra literaria en el acervo de Bibliotech, indicando su clasificación y estante físico.</p>
      <div style={{ background: "#fff", borderRadius: 12, padding: 32, maxWidth: 680 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: "#1f2937", margin: "0 0 16px", paddingBottom: 10, borderBottom: "1px solid #f3f4f6" }}>Ficha Bibliográfica del Libro</h3>
        <div style={{ display: "grid", gap: 14 }}>
          <Input label="Título de la Obra" placeholder="Ej. Rayuela" value={form.title} onChange={set("title")} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Input label="Autor(a)" placeholder="Ej. Julio Cortázar" value={form.author} onChange={set("author")} />
            <Input label="ISBN" placeholder="Ej. 978-8420422664" value={form.isbn} onChange={set("isbn")} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Input label="Editorial" placeholder="Ej. Alfaguara" value={form.editorial} onChange={set("editorial")} />
            <Input label="Año de Publicación" placeholder="Ej. 1963" value={form.year} onChange={set("year")} />
          </div>
        </div>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: "#1f2937", margin: "20px 0 16px", paddingBottom: 10, borderBottom: "1px solid #f3f4f6" }}>Clasificación &amp; Inventario</h3>
        <div style={{ display: "grid", gap: 14 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Select label="Categoría" value={form.category} onChange={set("category")} options={["Ficción / Novela", "Ciencia", "Historia", "Infantil", "Poesía", "Biografía", "Otro"]} />
            <Input label="Ubicación Física (Estante)" placeholder="Ej. Estante A3" value={form.location} onChange={set("location")} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Select label="Estado Inicial del Libro" value={form.status} onChange={set("status")} options={["Disponible", "Prestado", "En Reparación", "Perdido"]} />
            <Input label="Número de Ejemplares" placeholder="Ej. 3" value={form.copies} onChange={set("copies")} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <label style={{ fontSize: 13, fontWeight: 500, color: "#374151" }}>Descripción o Sinopsis de la Obra</label>
            <textarea placeholder="Breve resumen del contenido o notas adicionales sobre el estado físico de los ejemplares..." value={form.description} onChange={e => set("description")(e.target.value)} style={{ border: "1.5px solid #e5e7eb", borderRadius: 8, padding: "10px 12px", fontSize: 14, resize: "vertical", minHeight: 90, fontFamily: "inherit" }} />
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20 }}>
          <Btn variant="outline" onClick={() => setPage("catalog")}>Cancelar</Btn>
          <Btn onClick={save}>Guardar Libro</Btn>
        </div>
      </div>
    </div>
  );
}

// ─── Loans ────────────────────────────────────────────────────────────────────
function Loans({ loans, setLoans, books, readers, setPage }: { loans: Loan[]; setLoans: (l: Loan[]) => void; books: Book[]; readers: Reader[]; setPage: (p: Page) => void }) {
  const [search, setSearch] = useState("");
  const [showRegister, setShowRegister] = useState(false);

  const filtered = useMemo(() => loans.filter(l => {
    const q = search.toLowerCase();
    return !q || l.folio.toLowerCase().includes(q) || l.readerName.toLowerCase().includes(q) || l.bookTitle.toLowerCase().includes(q);
  }), [loans, search]);

  const registerLoan = (loan: Omit<Loan, "id">) => {
    const nextId = loans.reduce((max, current) => Math.max(max, current.id), 0) + 1;
    setLoans([...loans, { ...loan, id: nextId }]);
    setShowRegister(false);
  };
  const deleteLoan = (loan: Loan) => {
    if (window.confirm(`¿Eliminar el préstamo ${loan.folio}? Esta acción no se puede deshacer.`)) {
      setLoans(loans.filter(l => l.id !== loan.id));
    }
  };

  return (
    <div style={{ padding: 32 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: "#1f2937", margin: "0 0 4px" }}>Gestión de Préstamos</h1>
          <p style={{ color: "#6b7280", fontSize: 14, margin: 0 }}>Monitorea los préstamos otorgados, registra nuevas salidas y vigila las alertas de vencimiento.</p>
        </div>
        <Btn onClick={() => setShowRegister(true)}>+ Registrar Préstamo</Btn>
      </div>
      <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
        <input placeholder="Buscar por folio, lector o libro..." value={search} onChange={e => setSearch(e.target.value)} style={{ flex: 1, border: "1.5px solid #e5e7eb", borderRadius: 8, padding: "9px 12px", fontSize: 14, outline: "none" }} />
      </div>
      <div style={{ background: "#fff", borderRadius: 12, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
              {["Folio", "Lector", "Libro", "Fecha Préstamo", "Fecha Límite", "Estado", "Acciones"].map(h => (
                <th key={h} style={{ textAlign: "left", padding: "11px 14px", color: "#6b7280", fontWeight: 500 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(l => (
              <tr key={l.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                <td style={{ padding: "11px 14px", color: teal, fontWeight: 600 }}>{l.folio}</td>
                <td style={{ padding: "11px 14px", fontWeight: 500, color: "#1f2937" }}>{l.readerName}</td>
                <td style={{ padding: "11px 14px", color: "#374151" }}>{l.bookTitle}</td>
                <td style={{ padding: "11px 14px", color: "#6b7280" }}>{l.loanDate}</td>
                <td style={{ padding: "11px 14px", color: "#6b7280" }}>{l.dueDate}</td>
                <td style={{ padding: "11px 14px" }}><Badge status={l.status} /></td>
                <td style={{ padding: "11px 14px" }}>
                  <button onClick={() => deleteLoan(l)} aria-label={`Eliminar préstamo ${l.folio}`} title="Eliminar préstamo" style={{ background: "#fee2e2", border: "none", borderRadius: 6, cursor: "pointer", padding: 6, color: "#dc2626", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                    <TrashIcon />
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={7} style={{ padding: 32, textAlign: "center", color: "#9ca3af" }}>No se encontraron préstamos.</td></tr>}
          </tbody>
        </table>
      </div>
      {showRegister && (
        <RegisterLoanModal books={books} readers={readers} loans={loans} onSave={registerLoan} onClose={() => setShowRegister(false)} />
      )}
    </div>
  );
}

function RegisterLoanModal({ books, readers, loans, onSave, onClose }: { books: Book[]; readers: Reader[]; loans: Loan[]; onSave: (l: Omit<Loan, "id">) => void; onClose: () => void }) {
  const [readerId, setReaderId] = useState("");
  const [bookId, setBookId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const available = books.filter(b => b.status === "Disponible");
  const today = new Date().toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" }).replace(/ /g, "/");
  const folio = `PR-2024-${String(loans.length + 1).padStart(3, "0")}`;

  const save = () => {
    const reader = readers.find(r => r.id === parseInt(readerId));
    const book = books.find(b => b.id === parseInt(bookId));
    if (!reader || !book || !dueDate) return;
    onSave({ folio, readerId: reader.id, readerName: reader.name, bookId: book.id, bookTitle: book.title, loanDate: today, dueDate, status: "Activo" });
  };

  return (
    <Modal title="Registrar Préstamo" onClose={onClose}>
      <div style={{ display: "grid", gap: 14 }}>
        <div style={{ background: "#f9fafb", borderRadius: 8, padding: "10px 14px", fontSize: 13 }}>
          <span style={{ color: "#6b7280" }}>Folio: </span><span style={{ fontWeight: 600, color: teal }}>{folio}</span>
          <span style={{ color: "#6b7280", marginLeft: 16 }}>Fecha: </span><span style={{ fontWeight: 500, color: "#374151" }}>{today}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <label style={{ fontSize: 13, fontWeight: 500, color: "#374151" }}>Lector</label>
          <select value={readerId} onChange={e => setReaderId(e.target.value)} style={{ border: "1.5px solid #e5e7eb", borderRadius: 8, padding: "9px 12px", fontSize: 14, background: "#fff" }}>
            <option value="">— Seleccionar lector —</option>
            {readers.filter(r => r.status === "Activo").map(r => <option key={r.id} value={r.id}>{r.folio} – {r.name}</option>)}
          </select>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <label style={{ fontSize: 13, fontWeight: 500, color: "#374151" }}>Libro (disponibles)</label>
          <select value={bookId} onChange={e => setBookId(e.target.value)} style={{ border: "1.5px solid #e5e7eb", borderRadius: 8, padding: "9px 12px", fontSize: 14, background: "#fff" }}>
            <option value="">— Seleccionar libro —</option>
            {available.map(b => <option key={b.id} value={b.id}>{b.title} — {b.author}</option>)}
          </select>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <label style={{ fontSize: 13, fontWeight: 500, color: "#374151" }}>Fecha Límite de Devolución</label>
          <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} style={{ border: "1.5px solid #e5e7eb", borderRadius: 8, padding: "9px 12px", fontSize: 14, background: "#fff" }} />
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 8 }}>
          <Btn variant="outline" onClick={onClose}>Cancelar</Btn>
          <Btn onClick={save}>Registrar Préstamo</Btn>
        </div>
      </div>
    </Modal>
  );
}

// ─── Returns ──────────────────────────────────────────────────────────────────
function Returns({ loans, setLoans, books, setBooks }: { loans: Loan[]; setLoans: (l: Loan[]) => void; books: Book[]; setBooks: (b: Book[]) => void }) {
  const pending = loans.filter(l => l.status !== "Devuelto");
  const onTime = pending.filter(l => !isOverdue(l)).length;
  const overdue = pending.filter(l => isOverdue(l));
  const totalFee = overdue.reduce((s, l) => s + calcFee(l), 0);

  function parseDueDate(value: string) {
    if (value.includes("-")) {
      const [year, month, day] = value.split("-").map(Number);
      return new Date(year, month - 1, day);
    }
    const parts = value.split("/");
    const monthMap: Record<string, number> = { Ene: 0, Feb: 1, Mar: 2, Abr: 3, May: 4, Jun: 5, Jul: 6, Ago: 7, Sep: 8, Oct: 9, Nov: 10, Dic: 11 };
    return new Date(parseInt(parts[2]), monthMap[parts[1]] ?? 0, parseInt(parts[0]));
  }
  function isOverdue(l: Loan) {
    return parseDueDate(l.dueDate) < new Date();
  }
  function calcFee(l: Loan) {
    const d = parseDueDate(l.dueDate);
    const days = Math.max(0, Math.floor((Date.now() - d.getTime()) / 86400000));
    return days * 5;
  }
  function lateDays(l: Loan) {
    const d = parseDueDate(l.dueDate);
    return Math.max(0, Math.floor((Date.now() - d.getTime()) / 86400000));
  }
  const devolver = (loan: Loan) => {
    setLoans(loans.map(l => l.id === loan.id ? { ...l, status: "Devuelto" } : l));
    setBooks(books.map(book => book.id === loan.bookId ? { ...book, status: "Disponible" } : book));
  };
  const renovar = (id: number) => {
    setLoans(loans.map(l => {
      if (l.id !== id) return l;
      const d = parseDueDate(l.dueDate);
      d.setDate(d.getDate() + 14);
      const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
      const newDue = `${d.getDate()}/${months[d.getMonth()]}/${d.getFullYear()}`;
      return { ...l, dueDate: newDue, status: "Activo" };
    }));
  };

  return (
    <div style={{ padding: 32 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: "#1f2937", margin: "0 0 4px" }}>Control de Devoluciones</h1>
          <p style={{ color: "#6b7280", fontSize: 14, margin: 0 }}>Consulta los préstamos pendientes, registra entregas y renueva por 14 días. La mora se calcula a $5 MXN por día.</p>
        </div>
      </div>
      <div style={{ display: "flex", gap: 16, marginBottom: 20 }}>
        <div style={{ background: "#fff", borderRadius: 10, padding: "14px 20px", display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#16a34a", display: "inline-block" }} />
          <span style={{ fontSize: 14, color: "#374151" }}>A Tiempo:</span>
          <span style={{ fontWeight: 700, fontSize: 16, color: "#1f2937" }}>{onTime} préstamos</span>
        </div>
        <div style={{ background: "#fff", borderRadius: 10, padding: "14px 20px", display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#dc2626", display: "inline-block" }} />
          <span style={{ fontSize: 14, color: "#374151" }}>Con Retraso:</span>
          <span style={{ fontWeight: 700, fontSize: 16, color: "#1f2937" }}>{overdue.length} préstamos</span>
        </div>
        <div style={{ background: "#fff", borderRadius: 10, padding: "14px 20px", display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#d97706", display: "inline-block" }} />
          <span style={{ fontSize: 14, color: "#374151" }}>Mora Total Acumulada:</span>
          <span style={{ fontWeight: 700, fontSize: 16, color: "#1f2937" }}>${totalFee.toFixed(2)} MXN</span>
        </div>
      </div>
      <div style={{ background: "#fff", borderRadius: 12, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
              {["Folio Préstamo", "Lector", "Libro", "Fecha Préstamo", "Fecha Límite", "Días de Retraso", "Mora", "Acciones"].map(h => (
                <th key={h} style={{ textAlign: "left", padding: "11px 14px", color: "#6b7280", fontWeight: 500 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pending.map(l => {
              const days = lateDays(l);
              const fee = calcFee(l);
              return (
                <tr key={l.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                  <td style={{ padding: "11px 14px", color: teal, fontWeight: 600 }}>{l.folio}</td>
                  <td style={{ padding: "11px 14px", fontWeight: 500, color: "#1f2937" }}>{l.readerName}</td>
                  <td style={{ padding: "11px 14px", color: "#374151", maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{l.bookTitle}</td>
                  <td style={{ padding: "11px 14px", color: "#6b7280" }}>{l.loanDate}</td>
                  <td style={{ padding: "11px 14px", color: "#6b7280" }}>{l.dueDate}</td>
                  <td style={{ padding: "11px 14px", color: days > 0 ? "#dc2626" : "#374151", fontWeight: days > 0 ? 600 : 400 }}>{days > 0 ? `${days} días` : "0 días"}</td>
                  <td style={{ padding: "11px 14px", color: fee > 0 ? "#dc2626" : "#374151", fontWeight: fee > 0 ? 600 : 400 }}>${fee.toFixed(2)} MXN</td>
                  <td style={{ padding: "11px 14px", display: "flex", gap: 6 }}>
                    <Btn small onClick={() => devolver(l)}>Registrar devolución</Btn>
                    <Btn small variant="outline" onClick={() => renovar(l.id)}>Renovar</Btn>
                  </td>
                </tr>
              );
            })}
            {pending.length === 0 && <tr><td colSpan={8} style={{ padding: 32, textAlign: "center", color: "#9ca3af" }}>No hay devoluciones pendientes.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Readers ──────────────────────────────────────────────────────────────────
function Readers({ readers, setReaders, loans, setPage }: { readers: Reader[]; setReaders: (r: Reader[]) => void; loans: Loan[]; setPage: (p: Page) => void }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [page, setLocalPage] = useState(1);
  const PER = 7;

  const filtered = useMemo(() => readers.filter(r => {
    const q = search.toLowerCase();
    const matchQ = !q || r.name.toLowerCase().includes(q) || r.folio.toLowerCase().includes(q) || r.phone.includes(q) || r.address.toLowerCase().includes(q);
    const matchS = statusFilter === "Todos" || r.status === statusFilter;
    return matchQ && matchS;
  }), [readers, search, statusFilter]);

  const totalPages = Math.ceil(filtered.length / PER);
  const shown = filtered.slice((page - 1) * PER, page * PER);

  const getActiveLoans = (id: number) => loans.filter(l => l.readerId === id && l.status === "Activo").length;
  const toggleStatus = (id: number) => setReaders(readers.map(r => r.id === id ? { ...r, status: r.status === "Activo" ? "Suspendido" : "Activo" } : r));

  return (
    <div style={{ padding: 32 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: "#1f2937", margin: "0 0 4px" }}>Gestión de Lectores</h1>
          <p style={{ color: "#6b7280", fontSize: 14, margin: 0 }}>Administra el padrón de usuarios, registra nuevos lectores y supervisa su estatus de préstamos.</p>
        </div>
        <Btn onClick={() => setPage("register-reader")}>+ Registrar Lector</Btn>
      </div>
      <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
        <input placeholder="Buscar por folio, nombre, dirección o teléfono..." value={search} onChange={e => { setSearch(e.target.value); setLocalPage(1); }} style={{ flex: 1, border: "1.5px solid #e5e7eb", borderRadius: 8, padding: "9px 12px", fontSize: 14, outline: "none" }} />
        <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setLocalPage(1); }} style={{ border: "1.5px solid #e5e7eb", borderRadius: 8, padding: "9px 12px", fontSize: 14, background: "#fff" }}>
          {["Todos", "Activo", "Suspendido"].map(s => <option key={s}>{s}</option>)}
        </select>
      </div>
      <div style={{ background: "#fff", borderRadius: 12, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
              {["Folio", "Nombre", "Dirección", "Teléfono", "Fecha Registro", "Préstamos Activos", "Estado", "Acciones"].map(h => (
                <th key={h} style={{ textAlign: "left", padding: "11px 14px", color: "#6b7280", fontWeight: 500 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {shown.map(r => {
              const al = getActiveLoans(r.id);
              return (
                <tr key={r.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                  <td style={{ padding: "11px 14px", color: teal, fontWeight: 600 }}>{r.folio}</td>
                  <td style={{ padding: "11px 14px", fontWeight: 600, color: "#1f2937" }}>{r.name}</td>
                  <td style={{ padding: "11px 14px", color: "#6b7280", maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.address}, {r.colonia}</td>
                  <td style={{ padding: "11px 14px", color: "#374151" }}>{r.phone}</td>
                  <td style={{ padding: "11px 14px", color: "#6b7280" }}>{r.registrationDate}</td>
                  <td style={{ padding: "11px 14px", color: "#374151" }}>{al} {al === 1 ? "libro" : "libros"}</td>
                  <td style={{ padding: "11px 14px" }}><Badge status={r.status} /></td>
                  <td style={{ padding: "11px 14px", display: "flex", gap: 8 }}>
                    <button onClick={() => toggleStatus(r.id)} title={r.status === "Activo" ? "Suspender" : "Activar"} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 15, color: "#6b7280" }}>✏️</button>
                    <button title="Ver historial" style={{ background: "none", border: "none", cursor: "pointer", fontSize: 15, color: "#6b7280" }}>⊞</button>
                  </td>
                </tr>
              );
            })}
            {shown.length === 0 && <tr><td colSpan={8} style={{ padding: 32, textAlign: "center", color: "#9ca3af" }}>No se encontraron lectores.</td></tr>}
          </tbody>
        </table>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", borderTop: "1px solid #f3f4f6" }}>
          <span style={{ fontSize: 13, color: "#6b7280" }}>Mostrando {(page - 1) * PER + 1}–{Math.min(page * PER, filtered.length)} de {filtered.length} lectores</span>
          <div style={{ display: "flex", gap: 6 }}>
            <Btn variant="outline" small onClick={() => setLocalPage(p => Math.max(1, p - 1))}>Anterior</Btn>
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i} onClick={() => setLocalPage(i + 1)} style={{ width: 32, height: 32, border: "1.5px solid #e5e7eb", borderRadius: 6, fontSize: 13, cursor: "pointer", background: page === i + 1 ? teal : "#fff", color: page === i + 1 ? "#fff" : "#374151", fontWeight: page === i + 1 ? 700 : 400 }}>{i + 1}</button>
            ))}
            <Btn variant="outline" small onClick={() => setLocalPage(p => Math.min(totalPages, p + 1))}>Siguiente</Btn>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Register Reader ──────────────────────────────────────────────────────────
function RegisterReader({ readers, setReaders, setPage }: { readers: Reader[]; setReaders: (r: Reader[]) => void; setPage: (p: Page) => void }) {
  const [form, setForm] = useState({ name: "", birthdate: "", address: "", colonia: "", municipio: "", phone: "", email: "", idType: "INE (Credencial de Elector)", idNumber: "" });
  const set = (k: string) => (v: string) => setForm(f => ({ ...f, [k]: v }));
  const save = () => {
    if (!form.name) return;
    const id = readers.reduce((max, current) => Math.max(max, current.id), 0) + 1;
    const folioNum = 453 + id;
    const today = new Date();
    const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    const reg = `${today.getDate()}/${months[today.getMonth()]}/${today.getFullYear()}`;
    const newReader: Reader = { id, folio: `#LEC-${String(folioNum).padStart(4, "0")}`, ...form, registrationDate: reg, status: "Activo" };
    setReaders([...readers, newReader]);
    setPage("readers");
  };
  return (
    <div style={{ padding: 32 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, color: "#1f2937", margin: "0 0 4px" }}>Registrar Nuevo Lector</h1>
      <p style={{ color: "#6b7280", fontSize: 14, margin: "0 0 24px" }}>Completa el formulario para incorporar un nuevo lector a la base de datos de Bibliotech.</p>
      <div style={{ background: "#fff", borderRadius: 12, padding: 32, maxWidth: 680 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: "#1f2937", margin: "0 0 16px", paddingBottom: 10, borderBottom: "1px solid #f3f4f6" }}>Información Personal &amp; de Contacto</h3>
        <div style={{ display: "grid", gap: 14 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Input label="Nombre Completo" placeholder="Ej. Alejandro Ruiz Gómez" value={form.name} onChange={set("name")} />
            <Input label="Fecha de Nacimiento" placeholder="DD/MM/AAAA" value={form.birthdate} onChange={set("birthdate")} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Input label="Dirección (Calle y Número)" placeholder="Ej. Calle Flores #14" value={form.address} onChange={set("address")} />
            <Input label="Colonia" placeholder="Ej. Centro" value={form.colonia} onChange={set("colonia")} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Input label="Municipio" placeholder="Ej. Amatitlán" value={form.municipio} onChange={set("municipio")} />
            <Input label="Teléfono" placeholder="Ej. 5512345678" value={form.phone} onChange={set("phone")} />
          </div>
          <Input label="Correo Electrónico" placeholder="Ej. alejandro.ruiz@ejemplo.com" value={form.email} onChange={set("email")} />
        </div>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: "#1f2937", margin: "20px 0 16px", paddingBottom: 10, borderBottom: "1px solid #f3f4f6" }}>Documento de Identificación</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Select label="Tipo de Identificación" value={form.idType} onChange={set("idType")} options={["INE (Credencial de Elector)", "Pasaporte", "Credencial Estudiantil", "CURP", "Otro"]} />
          <Input label="Número de Identificación / Folio" placeholder="Ej. IDMEX18293028" value={form.idNumber} onChange={set("idNumber")} />
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 24 }}>
          <Btn variant="outline" onClick={() => setPage("readers")}>Cancelar</Btn>
          <Btn onClick={save}>Registrar Lector</Btn>
        </div>
      </div>
    </div>
  );
}

// ─── Reports ──────────────────────────────────────────────────────────────────
function Reports({ loans, books, readers }: { loans: Loan[]; books: Book[]; readers: Reader[] }) {
  const overdue = loans.filter(l => l.status === "Vencido");
  const morosity = loans.length > 0 ? ((overdue.length / loans.length) * 100).toFixed(1) : "0.0";
  const thisMonth = loans.filter(l => l.status === "Activo").length;
  const monthData = [
    { label: "Ene", value: 32 }, { label: "Feb", value: 48 }, { label: "Mar", value: 56 },
    { label: "Abr", value: 44 }, { label: "May", value: 67 }, { label: "Jun", value: thisMonth + 40 },
  ];
  const topBooks = [
    { title: "Cien años de soledad", count: 48 },
    { title: "El principito", count: 36 },
    { title: "Pedro Páramo", count: 31 },
    { title: "Breve historia del tiempo", count: 24 },
    { title: "Sapiens", count: 19 },
  ];
  const available = books.filter(b => b.status === "Disponible").length;
  const pct = Math.round((available / books.length) * 100);

  const exportCSV = () => {
    const header = "Folio,Lector,Libro,Fecha Préstamo,Fecha Límite,Estado\n";
    const rows = loans.map(l => `${l.folio},${l.readerName},${l.bookTitle},${l.loanDate},${l.dueDate},${l.status}`).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "reporte_bibliotech.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ padding: 32 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: "#1f2937", margin: "0 0 4px" }}>Reportes Analíticos</h1>
          <p style={{ color: "#6b7280", fontSize: 14, margin: 0 }}>Monitorea el rendimiento operativo, préstamos por mes y morosidad de la biblioteca.</p>
        </div>
        <Btn onClick={exportCSV}>Generar Reporte (CSV)</Btn>
      </div>
      <div style={{ display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
        <div style={{ background: "#fff", borderRadius: 12, padding: 20, flex: 1, minWidth: 160 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: 13, color: "#6b7280" }}>Libros Más Prestados</span>
            <span style={{ fontSize: 18 }}>📖</span>
          </div>
          <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 4 }}>
            {topBooks.map((b, i) => (
              <div key={b.title} style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                <span style={{ color: "#374151" }}>{i + 1}. {b.title}</span>
                <span style={{ color: teal, fontWeight: 600 }}>{b.count} préstamos</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ background: "#fff", borderRadius: 12, padding: 20, flex: 1, minWidth: 160 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: 13, color: "#6b7280" }}>Tasa de Morosidad</span>
            <span style={{ fontSize: 18 }}>↗</span>
          </div>
          <div style={{ fontSize: 40, fontWeight: 800, color: "#dc2626", margin: "8px 0 4px" }}>{morosity}%</div>
          <p style={{ fontSize: 12, color: "#6b7280", margin: 0 }}>Un total de {overdue.length} lectores tienen préstamos con fecha límite vencida de entrega.</p>
        </div>
        <div style={{ background: "#fff", borderRadius: 12, padding: 20, flex: 1, minWidth: 160 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: 13, color: "#6b7280" }}>Préstamos Este Mes</span>
            <span style={{ fontSize: 18 }}>💱</span>
          </div>
          <div style={{ fontSize: 40, fontWeight: 800, color: "#1f2937", margin: "8px 0 4px" }}>{thisMonth + 47}</div>
          <p style={{ fontSize: 12, color: "#6b7280", margin: 0 }}>Préstamos registrados en lo que va de Junio. Un 12% más que el mes anterior.</p>
        </div>
        <div style={{ background: "#fff", borderRadius: 12, padding: 20, flex: 1, minWidth: 160 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: 13, color: "#6b7280" }}>Estado del Inventario</span>
            <span style={{ fontSize: 18 }}>⊞</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 10 }}>
            <DonutChartSmall pct={pct} />
            <div style={{ fontSize: 12, color: "#374151" }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{books.length} Libros Totales</div>
              <div>• {pct}% Disponible</div>
              <div>• {100 - pct}% Otros Estados</div>
            </div>
          </div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        <div style={{ background: "#fff", borderRadius: 12, padding: 24, flex: 2, minWidth: 260 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: "#1f2937", margin: "0 0 16px" }}>Flujo de Préstamos Mensual</h3>
          <BarChart data={monthData} />
        </div>
        <div style={{ background: "#fff", borderRadius: 12, padding: 24, flex: 1, minWidth: 200 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: "#1f2937", margin: "0 0 16px" }}>Lectores con Morosidad Crítica</h3>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #f3f4f6" }}>
                <th style={{ textAlign: "left", padding: "6px 0", color: "#6b7280", fontWeight: 500 }}>Lector</th>
                <th style={{ textAlign: "left", padding: "6px 0", color: "#6b7280", fontWeight: 500 }}>Días Vencido</th>
                <th style={{ textAlign: "left", padding: "6px 0", color: "#6b7280", fontWeight: 500 }}>Estatus</th>
              </tr>
            </thead>
            <tbody>
              {overdue.slice(0, 5).map(l => (
                <tr key={l.id} style={{ borderBottom: "1px solid #f9fafb" }}>
                  <td style={{ padding: "8px 0", color: "#374151" }}>{l.readerName}</td>
                  <td style={{ padding: "8px 0", color: "#dc2626", fontWeight: 600 }}>14 días</td>
                  <td style={{ padding: "8px 0" }}><Badge status="Vencido" /></td>
                </tr>
              ))}
              {overdue.length === 0 && <tr><td colSpan={3} style={{ padding: "16px 0", textAlign: "center", color: "#9ca3af" }}>Sin morosidad activa</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function DonutChartSmall({ pct }: { pct: number }) {
  const r = 24, cx = 28, cy = 28, sw = 10, circ = 2 * Math.PI * r;
  return (
    <svg width={56} height={56}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f3f4f6" strokeWidth={sw} />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={teal} strokeWidth={sw} strokeDasharray={`${(pct / 100) * circ} ${circ}`} style={{ transformOrigin: `${cx}px ${cy}px`, transform: "rotate(-90deg)" }} />
    </svg>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState<Page>("login");
  const [books, setBooks] = useState<Book[]>(INITIAL_BOOKS);
  const [loans, setLoans] = useState<Loan[]>(INITIAL_LOANS);
  const [readers, setReaders] = useState<Reader[]>(INITIAL_READERS);

  if (page === "login") return <LoginPage onLogin={() => setPage("dashboard")} />;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#F5F3EE", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <Sidebar page={page} setPage={setPage} onLogout={() => setPage("login")} />
      <main style={{ flex: 1, overflowY: "auto" }}>
        {page === "dashboard" && <Dashboard books={books} loans={loans} readers={readers} />}
        {page === "catalog" && <Catalog books={books} setBooks={setBooks} setPage={setPage} />}
        {page === "add-book" && <AddBook books={books} setBooks={setBooks} setPage={setPage} />}
        {page === "loans" && <Loans loans={loans} setLoans={setLoans} books={books} readers={readers} setPage={setPage} />}
        {page === "returns" && <Returns loans={loans} setLoans={setLoans} books={books} setBooks={setBooks} />}
        {page === "readers" && <Readers readers={readers} setReaders={setReaders} loans={loans} setPage={setPage} />}
        {page === "register-reader" && <RegisterReader readers={readers} setReaders={setReaders} setPage={setPage} />}
        {page === "reports" && <Reports loans={loans} books={books} readers={readers} />}
      </main>
    </div>
  );
}
