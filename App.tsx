'use client'

import React, { useState, useEffect } from 'react'
import { 
  Card, 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableCell,
  Button, 
  Input,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Badge,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  Label,
  Textarea,
  Switch,
  Alert,
  AlertDescription,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Tooltip,
  TooltipContent,
  TooltipProvider
} from '@/components/ui'

import { 
  Package, 
  PackagePlus, 
  PackageDown, 
  PackageUp, 
  ClipboardCheck, 
  Truck, 
  FileSpreadsheet, 
  History, 
  ChartLine, 
  Shield, 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Download,
  RefreshCw,
  Warehouse,
  AlertTriangle,
  LogOut,
  User,
  LayoutDashboard,
  Menu,
  X,
  ChevronLeft
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { motion, AnimatePresence } from 'framer-motion'

// Types
interface Barang {
  id: string
  kode: string
  nama: string
  satuanDefault: string
  minStok: number
  satuanAlt1?: string
  konvAlt1?: number
  satuanAlt2?: string
  konvAlt2?: number
  keterangan?: string
  stok: number
}

interface Supplier {
  id: string
  nama: string
  alamat?: string
  telp?: string
  email?: string
  pic?: string
  ket?: string
}

interface TransaksiItem {
  barangId: string
  nama: string
  kode: string
  qty: number
  satuan: string
  qtyDefault: number
  satuanDefault: string
  stok?: number
}

interface DashboardStats {
  totalBarang: number
  totalStok: number
  stockLow: number
  masukBulanIni: number
  keluarBulanIni: number
}

export default function WarehousePage() {
  const { toast } = useToast()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentTab, setCurrentTab] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [user, setUser] = useState({ username: '', role: 'GUEST' })

  // Data States
  const [barangList, setBarangList] = useState<Barang[]>([])
  const [supplierList, setSupplierList] = useState<Supplier[]>([])
  const [listMasuk, setListMasuk] = useState<TransaksiItem[]>([])
  const [listKeluar, setListKeluar] = useState<TransaksiItem[]>([])

  // Form States
  const [formDataMasuk, setFormDataMasuk] = useState({
    tgl: new Date().toISOString().split('T')[0],
    noSJ: '',
    supplier: '',
    noPO: ''
  })

  const [formDataKeluar, setFormDataKeluar] = useState({
    tgl: new Date().toISOString().split('T')[0],
    ketGlobal: ''
  })

  const [selectedBarangMasuk, setSelectedBarangMasuk] = useState<Barang | null>(null)
  const [selectedBarangKeluar, setSelectedBarangKeluar] = useState<Barang | null>(null)
  const [qtyMasuk, setQtyMasuk] = useState('')
  const [satuanMasuk, setSatuanMasuk] = useState('PCS')
  const [qtyKeluar, setQtyKeluar] = useState('')
  const [satuanKeluar, setSatuanKeluar] = useState('PCS')

  // Supplier Modal State
  const [supplierModalOpen, setSupplierModalOpen] = useState(false)
  const [formDataSupplier, setFormDataSupplier] = useState({
    nama: '',
    alamat: '',
    telp: '',
    email: '',
    pic: '',
    ket: ''
  })

  // Confirm Dialog State
  const [showConfirm, setShowConfirm] = useState(false)
  const [confirmCallback, setConfirmCallback] = useState<() => void>(() => {})

  // Load Data
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    // Sample data for development
    setBarangList([
      {
        id: '1',
        kode: 'MIN-001',
        nama: 'Air Mineral 600ml',
        satuanDefault: 'BTL',
        minStok: 50,
        satuanAlt1: 'DUS',
        konvAlt1: 24,
        satuanAlt2: 'KARDUS',
        konvAlt2: 48,
        keterangan: 'Air mineral kemasan',
        stok: 120
      },
      {
        id: '2',
        kode: 'KRT-001',
        nama: 'Kertas A4 80gsm',
        satuanDefault: 'RIM',
        minStok: 20,
        satuanAlt1: 'BOX',
        konvAlt1: 5,
        satuanAlt2: 'LEMBAR',
        konvAlt2: 500,
        keterangan: 'Kertas HVS A4',
        stok: 15
      },
      {
        id: '3',
        kode: 'TNT-001',
        nama: 'Tinta Printer Black',
        satuanDefault: 'PCS',
        minStok: 10,
        satuanAlt1: 'BOX',
        konvAlt1: 12,
        stok: 5
      }
    ])

    setSupplierList([
      {
        id: '1',
        nama: 'PT Maju Mundur',
        alamat: 'Jl. Sudirman No. 123, Jakarta',
        telp: '021-1234567',
        email: 'info@majumundur.co.id',
        pic: 'Budi Santoso',
        ket: 'Supplier kertas'
      }
    ])
  }

  // Dashboard Stats
  const dashboardStats: DashboardStats = {
    totalBarang: barangList.length,
    totalStok: barangList.reduce((sum, b) => sum + b.stok, 0),
    stockLow: barangList.filter(b => b.stok <= b.minStok).length,
    masukBulanIni: 15,
    keluarBulanIni: 8
  }

  // Helper Functions
  const showToastMessage = (message: string, type: 'success' | 'error' | 'warning' | 'info') => {
    toast({
      title: message,
      variant: type === 'error' ? 'destructive' : 'default'
    })
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setIsAuthenticated(true)
    setUser({ username: 'admin', role: 'ADMIN' })
    showToastMessage('Login Berhasil! Selamat Datang.', 'success')
  }

  const handleLogout = () => {
    setShowConfirm(true)
    setConfirmCallback(() => {
      setIsAuthenticated(false)
      setUser({ username: '', role: 'GUEST' })
      setCurrentTab('dashboard')
      showToastMessage('Anda telah logout.', 'info')
    })
  }

  const switchTab = (tabName: string) => {
    setCurrentTab(tabName)
  }

  const handleTambahItemMasuk = () => {
    if (!selectedBarangMasuk) {
      showToastMessage('Pilih barang terlebih dahulu!', 'warning')
      return
    }

    if (!qtyMasuk || parseFloat(qtyMasuk) <= 0) {
      showToastMessage('Quantity harus lebih dari 0!', 'warning')
      return
    }

    const qty = parseFloat(qtyMasuk)
    const satuan = satuanMasuk
    let qtyDefault = qty

    if (satuan !== selectedBarangMasuk.satuanDefault) {
      if (satuan === selectedBarangMasuk.satuanAlt1) {
        qtyDefault = qty * (selectedBarangMasuk.konvAlt1 || 1)
      } else if (satuan === selectedBarangMasuk.satuanAlt2) {
        qtyDefault = qty * (selectedBarangMasuk.konvAlt2 || 1)
      }
    }

    setListMasuk([...listMasuk, {
      barangId: selectedBarangMasuk.id,
      nama: selectedBarangMasuk.nama,
      kode: selectedBarangMasuk.kode,
      qty,
      satuan,
      qtyDefault,
      satuanDefault: selectedBarangMasuk.satuanDefault
    }])

    setSelectedBarangMasuk(null)
    setQtyMasuk('')
    setSatuanMasuk('PCS')
    showToastMessage(`"${selectedBarangMasuk.nama}" ditambahkan (${qty} ${satuan})`, 'success')
  }

  const handleHapusItemMasuk = (index: number) => {
    setShowConfirm(true)
    setConfirmCallback(() => {
      const removedItem = listMasuk[index]
      setListMasuk(listMasuk.filter((_, i) => i !== index))
      showToastMessage(`"${removedItem.nama}" dihapus`, 'info')
    })
  }

  const handleSimpanMasuk = () => {
    setShowConfirm(true)
    setConfirmCallback(() => {
      showToastMessage(`${listMasuk.length} item barang masuk berhasil disimpan`, 'success')
      setListMasuk([])
      setFormDataMasuk({
        tgl: new Date().toISOString().split('T')[0],
        noSJ: '',
        supplier: '',
        noPO: ''
      })
    })
  }

  const handleTambahItemKeluar = () => {
    if (!selectedBarangKeluar) {
      showToastMessage('Pilih barang terlebih dahulu!', 'warning')
      return
    }

    const qtyInput = parseFloat(qtyKeluar) || 0
    const satuan = satuanKeluar

    if (qtyInput <= 0) {
      showToastMessage('Quantity harus lebih dari 0!', 'warning')
      return
    }

    const satuanDefault = selectedBarangKeluar.satuanDefault
    let qtyDefault = qtyInput

    if (satuan !== satuanDefault) {
      let nilaiKonversi = 1

      if (satuan === selectedBarangKeluar.satuanAlt1) {
        nilaiKonversi = selectedBarangKeluar.konvAlt1 || 1
      } else if (satuan === selectedBarangKeluar.satuanAlt2) {
        nilaiKonversi = selectedBarangKeluar.konvAlt2 || 1
      }

      qtyDefault = qtyInput * nilaiKonversi

      const sisa = qtyDefault % 1
      if (sisa !== 0) {
        showToastMessage(
          `âœ— Input tidak valid! ${qtyInput} ${satuan} = ${qtyDefault} ${satuanDefault} (bukan kelipatan bulat)`,
          'error'
        )
        return
      }
    }

    if (qtyDefault > selectedBarangKeluar.stok) {
      showToastMessage(
        `âœ— Stok tidak cukup! Stok tersedia: ${selectedBarangKeluar.stok} ${satuanDefault}, Diminta: ${qtyDefault} ${satuanDefault}`,
        'error'
      )
      return
    }

    setListKeluar([...listKeluar, {
      barangId: selectedBarangKeluar.id,
      nama: selectedBarangKeluar.nama,
      kode: selectedBarangKeluar.kode,
      qty: qtyInput,
      satuan,
      qtyDefault,
      satuanDefault,
      stok: selectedBarangKeluar.stok
    }])

    setSelectedBarangKeluar(null)
    setQtyKeluar('')
    setSatuanKeluar('PCS')
    showToastMessage(`"${selectedBarangKeluar.nama}" ditambahkan (${qtyInput} ${satuan} = ${qtyDefault} ${satuanDefault})`, 'success')
  }

  const handleHapusItemKeluar = (index: number) => {
    setShowConfirm(true)
    setConfirmCallback(() => {
      const removedItem = listKeluar[index]
      setListKeluar(listKeluar.filter((_, i) => i !== index))
      showToastMessage(`"${removedItem.nama}" dihapus`, 'info')
    })
  }

  const handleSimpanKeluar = () => {
    setShowConfirm(true)
    setConfirmCallback(() => {
      showToastMessage(`${listKeluar.length} item barang keluar berhasil disimpan`, 'success')
      setListKeluar([])
      setFormDataKeluar({
        tgl: new Date().toISOString().split('T')[0],
        ketGlobal: ''
      })
    })
  }

  const handleSimpanSupplier = () => {
    if (!formDataSupplier.nama) {
      showToastMessage('Nama supplier harus diisi!', 'warning')
      return
    }

    setSupplierList([...supplierList, {
      id: Date.now().toString(),
      ...formDataSupplier
    }])

    setSupplierModalOpen(false)
    setFormDataSupplier({
      nama: '',
      alamat: '',
      telp: '',
      email: '',
      pic: '',
      ket: ''
    })
    showToastMessage(`Supplier ${formDataSupplier.nama} berhasil ditambahkan`, 'success')
  }

  const handleEditSupplier = (supplier: Supplier) => {
    setFormDataSupplier({
      nama: supplier.nama,
      alamat: supplier.alamat || '',
      telp: supplier.telp || '',
      email: supplier.email || '',
      pic: supplier.pic || '',
      ket: supplier.ket || ''
    })
    setSupplierModalOpen(true)
  }

  const getAvailableSatuan = (barang: Barang | null) => {
    if (!barang) return ['PCS']
    const satuan = [barang.satuanDefault]
    if (barang.satuanAlt1) satuan.push(barang.satuanAlt1)
    if (barang.satuanAlt2) satuan.push(barang.satuanAlt2)
    return satuan
  }

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="w-full max-w-md p-8 bg-slate-800/50 backdrop-blur-xl border-slate-700">
            <div className="text-center mb-8">
              <Warehouse className="w-16 h-16 mx-auto mb-4 text-cyan-400" />
              <h1 className="text-3xl font-bold text-white mb-2">GUDANG MLASS</h1>
              <p className="text-slate-400">Masuk ke sistem manajemen stok</p>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input 
                  id="username" 
                  placeholder="admin" 
                  className="bg-slate-900/50 border-slate-600"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="â€¢â€¢â€¢â€¢â€¢â€¢" 
                  className="bg-slate-900/50 border-slate-600"
                />
              </div>
              <Button type="submit" className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700">
                MASUK DASHBOARD
              </Button>
            </form>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex">
      {/* Sidebar */}
      <motion.aside
        initial={{ width: sidebarOpen ? 280 : 0 }}
        animate={{ width: sidebarOpen ? 280 : 0 }}
        transition={{ duration: 0.3 }}
        className={`bg-slate-800/50 backdrop-blur-xl border-r border-slate-700 flex flex-col ${!sidebarOpen ? 'overflow-hidden' : ''}`}
      >
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <Warehouse className="w-8 h-8 text-cyan-400" />
            <span className="font-bold text-lg text-white">Gudang MLASS</span>
            <Button
              variant="ghost"
              size="sm"
              className="ml-auto text-slate-400 hover:text-white"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <NavItem icon={<ChartLine />} label="Dashboard" active={currentTab === 'dashboard'} onClick={() => switchTab('dashboard')} />
          <NavItem icon={<PackagePlus />} label="Masuk" active={currentTab === 'masuk'} onClick={() => switchTab('masuk')} />
          <NavItem icon={<PackageUp />} label="Keluar" active={currentTab === 'keluar'} onClick={() => switchTab('keluar')} />
          <NavItem icon={<ClipboardCheck />} label="Stock Opname" active={currentTab === 'opname'} onClick={() => switchTab('opname')} />
          <NavItem icon={<History />} label="Riwayat" active={currentTab === 'riwayat'} onClick={() => switchTab('riwayat')} />
          <NavItem icon={<Truck />} label="Supplier" active={currentTab === 'supplier'} onClick={() => switchTab('supplier')} />
          <NavItem icon={<FileSpreadsheet />} label="Export" active={currentTab === 'export'} onClick={() => switchTab('export')} />
          {user.role === 'ADMIN' && (
            <NavItem icon={<Shield />} label="Admin" active={currentTab === 'admin'} onClick={() => switchTab('admin')} />
          )}
        </nav>

        <div className="p-4 border-t border-slate-700">
          <div className="flex items-center gap-3 bg-slate-700/50 rounded-full px-4 py-2">
            <User className="w-5 h-5 text-slate-400" />
            <div className="text-sm">
              <div className="font-medium text-white">{user.username}</div>
              <div className="text-xs text-slate-400">{user.role}</div>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400 hover:text-red-400" onClick={handleLogout}>
                    <LogOut className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Keluar</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6">
        {/* Topbar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            {!sidebarOpen && (
              <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(!sidebarOpen)}>
                <Menu className="w-5 h-5 text-white" />
              </Button>
            )}
          </div>
          <div className="flex items-center gap-3 bg-slate-800/50 rounded-full px-4 py-2 border border-slate-700">
            <User className="w-5 h-5 text-slate-400" />
            <div className="text-sm">
              <div className="font-medium text-white">{user.username}</div>
              <div className="text-xs text-slate-400">{user.role}</div>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400 hover:text-red-400" onClick={handleLogout}>
                    <LogOut className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Keluar</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Dashboard Tab */}
        <AnimatePresence>
          {currentTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon={<Package />} title="Total Barang" value={dashboardStats.totalBarang} color="blue" />
                <StatCard icon={<Warehouse />} title="Total Stok" value={dashboardStats.totalStok} color="green" />
                <StatCard icon={<PackageDown />} title="Masuk Bulan Ini" value={dashboardStats.masukBulanIni} color="purple" />
                <StatCard icon={<PackageUp />} title="Keluar Bulan Ini" value={dashboardStats.keluarBulanIni} color="orange" />
              </div>

              {dashboardStats.stockLow > 0 && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Peringatan Stok Rendah:</strong> {dashboardStats.stockLow} item barang memiliki stok di bawah minimum.
                  </AlertDescription>
                </Alert>
              )}

              <Card>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Stok Menipis</h3>
                  <Badge variant="destructive">{dashboardStats.stockLow} Item</Badge>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHeaderCell>Kode</TableHeaderCell>
                      <TableHeaderCell>Nama Barang</TableHeaderCell>
                      <TableHeaderCell>Stok</TableHeaderCell>
                      <TableHeaderCell>Minimum</TableHeaderCell>
                      <TableHeaderCell>Status</TableHeaderCell>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {barangList.filter(b => b.stok <= b.minStok).map((barang) => (
                      <TableRow key={barang.id}>
                        <TableCell>{barang.kode}</TableCell>
                        <TableCell>{barang.nama}</TableCell>
                        <TableCell>{barang.stok}</TableCell>
                        <TableCell>{barang.minStok}</TableCell>
                        <TableCell>
                          <Badge variant="destructive">Rendah</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Masuk Tab */}
        <AnimatePresence>
          {currentTab === 'masuk' && (
            <motion.div key="masuk" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="space-y-6">
              <Card>
                <h3 className="text-lg font-semibold mb-4">Form Barang Masuk</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <Label htmlFor="tglMasuk">Tanggal *</Label>
                    <Input id="tglMasuk" type="date" value={formDataMasuk.tgl} onChange={(e) => setFormDataMasuk({...formDataMasuk, tgl: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="noSJ">No. Surat Jalan</Label>
                    <Input id="noSJ" placeholder="SJ-2025-001" value={formDataMasuk.noSJ} onChange={(e) => setFormDataMasuk({...formDataMasuk, noSJ: e.target.value})} />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <Label htmlFor="supplier">Supplier</Label>
                    <Input id="supplier" placeholder="Nama Supplier" value={formDataMasuk.supplier} onChange={(e) => setFormDataMasuk({...formDataMasuk, supplier: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="noPO">No. PO</Label>
                    <Input id="noPO" placeholder="PO-2025-001" value={formDataMasuk.noPO} onChange={(e) => setFormDataMasuk({...formDataMasuk, noPO: e.target.value})} />
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <Label htmlFor="namaBarangMasuk">Nama Barang *</Label>
                  <Select onValueChange={(value) => setSelectedBarangMasuk(barangList.find(b => b.id === value) || null)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Cari barang..." />
                    </SelectTrigger>
                    <SelectContent>
                      {barangList.map((barang) => (
                        <SelectItem key={barang.id} value={barang.id}>
                          <div>
                            <div className="font-medium">{barang.nama}</div>
                            <div className="text-sm text-slate-400">Kode: {barang.kode} | Stok: {barang.stok}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {selectedBarangMasuk && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="space-y-2">
                      <Label htmlFor="qtyMasuk">Quantity *</Label>
                      <Input id="qtyMasuk" type="number" placeholder="0" value={qtyMasuk} onChange={(e) => setQtyMasuk(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="satuanMasuk">Satuan</Label>
                      <Select value={satuanMasuk} onValueChange={setSatuanMasuk}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {getAvailableSatuan(selectedBarangMasuk).map((sat) => (
                            <SelectItem key={sat} value={sat}>{sat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button onClick={handleTambahItemMasuk} className="w-full"><Plus className="w-4 h-4 mr-2" />Tambah</Button>
                  </div>
                )}
              </Card>

              {listMasuk.length > 0 && (
                <Card>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Item yang Akan Masuk</h3>
                    <Badge>{listMasuk.length} Item</Badge>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHeaderCell>Nama Barang</TableHeaderCell>
                        <TableHeaderCell>Qty</TableHeaderCell>
                        <TableHeaderCell>Satuan</TableHeaderCell>
                        <TableHeaderCell>Aksi</TableHeaderCell>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {listMasuk.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.nama}</TableCell>
                          <TableCell>{item.qty}</TableCell>
                          <TableCell>{item.satuan}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm" onClick={() => handleHapusItemMasuk(index)}>
                              <Trash2 className="w-4 h-4 text-red-400" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <div className="flex gap-3 mt-4">
                    <Button variant="outline" onClick={() => setListMasuk([])}>Reset</Button>
                    <Button onClick={handleSimpanMasuk} className="flex-1"><FileSpreadsheet className="w-4 h-4 mr-2" />Simpan {listMasuk.length} Item</Button>
                  </div>
                </Card>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Keluar Tab */}
        <AnimatePresence>
          {currentTab === 'keluar' && (
            <motion.div key="keluar" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="space-y-6">
              <Card>
                <h3 className="text-lg font-semibold mb-4">Form Barang Keluar</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <Label htmlFor="tglKeluar">Tanggal *</Label>
                    <Input id="tglKeluar" type="date" value={formDataKeluar.tgl} onChange={(e) => setFormDataKeluar({...formDataKeluar, tgl: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ketGlobal">Keterangan Global</Label>
                    <Input id="ketGlobal" placeholder="Alasan pengeluaran" value={formDataKeluar.ketGlobal} onChange={(e) => setFormDataKeluar({...formDataKeluar, ketGlobal: e.target.value})} />
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <Label htmlFor="namaBarangKeluar">Nama Barang *</Label>
                  <Select onValueChange={(value) => setSelectedBarangKeluar(barangList.find(b => b.id === value) || null)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Cari barang..." />
                    </SelectTrigger>
                    <SelectContent>
                      {barangList.map((barang) => (
                        <SelectItem key={barang.id} value={barang.id}>
                          <div>
                            <div className="font-medium">{barang.nama}</div>
                            <div className="text-sm text-slate-400">Kode: {barang.kode} | Stok: {barang.stok}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {selectedBarangKeluar && (
                  <>
                    <div className="mb-4 p-3 bg-slate-800/50 rounded-lg">
                      <div className="text-sm text-slate-400">Stok Tersedia:</div>
                      <div className="text-2xl font-bold text-white">{selectedBarangKeluar.stok} {selectedBarangKeluar.satuanDefault}</div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="space-y-2">
                        <Label htmlFor="qtyKeluar">Quantity *</Label>
                        <Input id="qtyKeluar" type="number" placeholder="0" value={qtyKeluar} onChange={(e) => setQtyKeluar(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="satuanKeluar">Satuan</Label>
                        <Select value={satuanKeluar} onValueChange={setSatuanKeluar}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {getAvailableSatuan(selectedBarangKeluar).map((sat) => (
                              <SelectItem key={sat} value={sat}>{sat}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <Button onClick={handleTambahItemKeluar} className="w-full"><Plus className="w-4 h-4 mr-2" />Tambah</Button>
                    </div>
                  </>
                )}
              </Card>

              {listKeluar.length > 0 && (
                <Card>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Item yang Akan Keluar</h3>
                    <Badge variant="destructive">{listKeluar.length} Item</Badge>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHeaderCell>Nama Barang</TableHeaderCell>
                        <TableHeaderCell>Qty</TableHeaderCell>
                        <TableHeaderCell>Satuan</TableHeaderCell>
                        <TableHeaderCell>Aksi</TableHeaderCell>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {listKeluar.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.nama}</TableCell>
                          <TableCell>{item.qty}</TableCell>
                          <TableCell>{item.satuan}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm" onClick={() => handleHapusItemKeluar(index)}>
                              <Trash2 className="w-4 h-4 text-red-400" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <div className="flex gap-3 mt-4">
                    <Button variant="outline" onClick={() => setListKeluar([])}>Reset</Button>
                    <Button onClick={handleSimpanKeluar} className="flex-1 bg-gradient-to-r from-red-500 to-orange-600"><PackageUp className="w-4 h-4 mr-2" />Keluarkan {listKeluar.length} Item</Button>
                  </div>
                </Card>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Supplier Tab */}
        <AnimatePresence>
          {currentTab === 'supplier' && (
            <motion.div key="supplier" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="space-y-6">
              <Card>
                <div className="flex items-center justify-between mb-4">
                  <Button onClick={() => {
                    setFormDataSupplier({ nama: '', alamat: '', telp: '', email: '', pic: '', ket: '' })
                    setSupplierModalOpen(true)
                  }}><Plus className="w-4 h-4 mr-2" />Tambah Supplier</Button>
                </div>
              </Card>

              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHeaderCell className="w-[18%]">Nama Supplier</TableHeaderCell>
                      <TableHeaderCell className="w-[20%]">Alamat</TableHeaderCell>
                      <TableHeaderCell className="w-[12%]">Telepon</TableHeaderCell>
                      <TableHeaderCell className="w-[20%]">Email</TableHeaderCell>
                      <TableHeaderCell className="w-[15%]">PIC</TableHeaderCell>
                      <TableHeaderCell className="w-[15%]">Aksi</TableHeaderCell>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {supplierList.map((supplier) => (
                      <TableRow key={supplier.id}>
                        <TableCell className="w-[18%]">{supplier.nama}</TableCell>
                        <TableCell className="w-[20%]">{supplier.alamat || '-'}</TableCell>
                        <TableCell className="w-[12%]">{supplier.telp || '-'}</TableCell>
                        <TableCell className="w-[20%]">{supplier.email || '-'}</TableCell>
                        <TableCell className="w-[15%]">{supplier.pic || '-'}</TableCell>
                        <TableCell className="w-[15%]">
                          <Button variant="ghost" size="sm" onClick={() => handleEditSupplier(supplier)}>
                            <Edit className="w-4 h-4 text-blue-400" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Export Tab */}
        <AnimatePresence>
          {currentTab === 'export' && (
            <motion.div key="export" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="space-y-6">
              <Card>
                <h3 className="text-lg font-semibold mb-4">Export Data</h3>
                <p className="text-slate-400 mb-6">Pilih data yang ingin diexport dalam format CSV</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <ExportCard icon={<Package />} title="Master Barang" desc="Data semua barang" color="blue" onClick={() => showToastMessage('Mengexport data Master Barang...', 'info')} />
                  <ExportCard icon={<Truck />} title="Master Supplier" desc="Data semua supplier" color="green" onClick={() => showToastMessage('Mengexport data Supplier...', 'info')} />
                  <ExportCard icon={<PackageDown />} title="Transaksi Masuk" desc="Riwayat barang masuk" color="cyan" onClick={() => showToastMessage('Mengexport transaksi Masuk...', 'info')} />
                  <ExportCard icon={<PackageUp />} title="Transaksi Keluar" desc="Riwayat barang keluar" color="red" onClick={() => showToastMessage('Mengexport transaksi Keluar...', 'info')} />
                  <ExportCard icon={<Warehouse />} title="Data Stok" desc="Stok barang saat ini" color="orange" onClick={() => showToastMessage('Mengexport data Stok...', 'info')} />
                  <ExportCard icon={<ClipboardCheck />} title="Stock Opname" desc="Riwayat stock opname" color="purple" onClick={() => showToastMessage('Mengexport Stock Opname...', 'info')} />
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Admin Tab */}
        <AnimatePresence>
          {currentTab === 'admin' && user.role === 'ADMIN' && (
            <motion.div key="admin" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="space-y-6">
              <Card>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Manajemen Pengguna</h3>
                  <Button onClick={() => showToastMessage('Fitur tambah user...', 'info')}><Plus className="w-4 h-4 mr-2" />Tambah User</Button>
                </div>
                <div className="flex items-center gap-2 p-3 bg-slate-800/30 rounded-lg mb-4">
                  <Shield className="w-5 h-5 text-cyan-400" />
                  <div>
                    <div className="font-semibold text-white">Admin Access</div>
                    <div className="text-sm text-slate-400">Anda memiliki akses penuh</div>
                  </div>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHeaderCell>Username</TableHeaderCell>
                      <TableHeaderCell>Role</TableHeaderCell>
                      <TableHeaderCell>Status</TableHeaderCell>
                      <TableHeaderCell>Aksi</TableHeaderCell>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>admin</TableCell>
                      <TableCell><Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">ADMIN</Badge></TableCell>
                      <TableCell><Badge className="bg-green-500/20 text-green-400 border-green-500/30">Aktif</Badge></TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" onClick={() => showToastMessage('Edit user...', 'info')}><Edit className="w-4 h-4" /></Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Card>

              <Card>
                <h3 className="text-lg font-semibold mb-4">Pengaturan Sistem</h3>
                <div className="space-y-4">
                  <SystemItem icon={<Download />} title="Backup Data" desc="Download semua data spreadsheet" onClick={() => showToastMessage('Downloading backup...', 'info')} />
                  <SystemItem icon={<RefreshCw />} title="Clear Cache" desc="Bersihkan cache aplikasi" onClick={() => showToastMessage('Cache cleared!', 'success')} />
                  <SystemItem icon={<Trash2 />} title="Reset Data" desc="Hapus semua transaksi (berbahaya)" variant="destructive" onClick={() => showToastMessage('Reset data...', 'warning')} />
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi</DialogTitle>
            <DialogDescription>Apakah Anda yakin ingin melanjutkan tindakan ini?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Batal</Button>
            </DialogClose>
            <Button onClick={() => { confirmCallback(); setShowConfirm(false) }} className="bg-gradient-to-r from-blue-500 to-cyan-600">
              Ya, Lanjutkan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Supplier Modal */}
      <Dialog open={supplierModalOpen} onOpenChange={setSupplierModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah Supplier Baru</DialogTitle>
            <DialogDescription>Isi data supplier di bawah ini</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="supplierNama">Nama Supplier *</Label>
              <Input id="supplierNama" value={formDataSupplier.nama} onChange={(e) => setFormDataSupplier({...formDataSupplier, nama: e.target.value})} placeholder="Nama Supplier" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="supplierTelp">Telepon</Label>
                <Input id="supplierTelp" value={formDataSupplier.telp} onChange={(e) => setFormDataSupplier({...formDataSupplier, telp: e.target.value})} placeholder="Nomor telepon" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="supplierEmail">Email</Label>
                <Input id="supplierEmail" type="email" value={formDataSupplier.email} onChange={(e) => setFormDataSupplier({...formDataSupplier, email: e.target.value})} placeholder="email@domain.com" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="supplierAlamat">Alamat</Label>
              <Input id="supplierAlamat" value={formDataSupplier.alamat} onChange={(e) => setFormDataSupplier({...formDataSupplier, alamat: e.target.value})} placeholder="Alamat lengkap" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="supplierPIC">Nama PIC</Label>
              <Input id="supplierPIC" value={formDataSupplier.pic} onChange={(e) => setFormDataSupplier({...formDataSupplier, pic: e.target.value})} placeholder="Nama Penanggung Jawab" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="supplierKeterangan">Keterangan</Label>
              <Textarea id="supplierKeterangan" value={formDataSupplier.ket} onChange={(e) => setFormDataSupplier({...formDataSupplier, ket: e.target.value})} placeholder="Keterangan tambahan" rows={3} />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Batal</Button>
            </DialogClose>
            <Button onClick={handleSimpanSupplier}>Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Helper Components
function NavItem({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active: boolean; onClick: () => void }) {
  return (
    <motion.button
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
        active ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'hover:bg-slate-700/50 text-slate-400 border border-slate-700/50'
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </motion.button>
  )
}

function StatCard({ icon, title, value, color, onClick }: { icon: React.ReactNode; title: string; value: number; color: string; onClick?: () => void }) {
  const colorClasses = {
    blue: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30',
    green: 'from-green-500/20 to-emerald-500/20 border-green-500/30',
    purple: 'from-purple-500/20 to-pink-500/20 border-purple-500/30',
    orange: 'from-orange-500/20 to-red-500/20 border-orange-500/30'
  }
  const iconColorClasses = {
    blue: 'text-blue-400',
    green: 'text-green-400',
    purple: 'text-purple-400',
    orange: 'text-orange-400'
  }

  return (
    <Card className={`bg-gradient-to-br ${colorClasses[color as keyof typeof colorClasses]} p-6 hover:translate-y-[-5px] transition-transform`}>
      <div className="w-8 h-8 mx-auto mb-3">{icon}</div>
      <div className="text-3xl font-bold text-white mb-1">{value}</div>
      <div className="text-sm text-slate-300">{title}</div>
    </Card>
  )
}

function ExportCard({ icon, title, desc, color, onClick }: { icon: React.ReactNode; title: string; desc: string; color: string; onClick: () => void }) {
  const colorClasses = {
    blue: 'text-blue-400',
    green: 'text-green-400',
    cyan: 'text-cyan-400',
    red: 'text-red-400',
    orange: 'text-orange-400',
    purple: 'text-purple-400'
  }

  return (
    <Card className="hover:bg-slate-800/50 cursor-pointer transition-colors border border-slate-700 p-6" onClick={onClick}>
      <div className="w-10 h-10 mx-auto mb-3">{React.cloneElement(icon as React.ReactElement, { className: colorClasses[color as keyof typeof colorClasses] })}</div>
      <h4 className="font-semibold mb-1 text-white">{title}</h4>
      <p className="text-sm text-slate-400">{desc}</p>
    </Card>
  )
}

function SystemItem({ icon, title, desc, variant = 'default', onClick }: { icon: React.ReactNode; title: string; desc: string; variant?: 'default' | 'destructive'; onClick: () => void }) {
  const variantClasses = variant === 'destructive' ? 'bg-red-500/10 border-red-500/20' : 'bg-slate-800/30 border-slate-700'

  return (
    <div className={`flex items-center justify-between p-4 rounded-lg border ${variantClasses}`}>
      <div>
        <div className="font-medium text-white">{title}</div>
        <div className="text-sm text-slate-400">{desc}</div>
      </div>
      <Button variant="outline" onClick={onClick}>
        {React.cloneElement(icon as React.ReactElement, { className: 'w-4 h-4 mr-2' })}
        {title === 'Reset Data' ? 'Reset' : title}
      </Button>
    </div>
  )
}
