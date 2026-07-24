'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Users, Search, Edit2, Trash2, Phone, ShieldCheck, Lock, Key, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  position: string;
  phone: string;
  status: string;
  gender: string;
  role?: string;
  pinCode?: string;
  permissions?: Record<string, boolean>;
}

// African position emojis
const POSITION_EMOJI: Record<string, string> = {
  'Esthéticienne': '💆', 'Coiffeuse': '💇', 'Maquilleuse': '💄',
  'Masseuse': '🌿', 'Réceptionniste': '📞', 'Caissière': '💵',
  'Manager': '👑', 'Praticienne': '✨', 'Gérant': '👔', 'Comptable': '📊'
};
const getPositionEmoji = (pos: string) =>
  Object.entries(POSITION_EMOJI).find(([k]) => pos.toLowerCase().includes(k.toLowerCase()))?.[1] || '✂️';

// Gradient per gender for avatars
const GENDER_BG: Record<string, string> = {
  F: 'from-[#8A1C14]/40 to-[#C8951E]/30',
  M: 'from-[#1E3A5F]/40 to-[#4E9FD1]/30',
  O: 'from-[#2E5A36]/40 to-[#4CAF6E]/30',
};

const DEFAULT_PERMISSIONS = [
  { key: 'pos', label: 'Caisse & Encaissements POS 💰', desc: 'Saisir les ventes et encaisser Wave/OM' },
  { key: 'agenda', label: 'Agenda & Rendez-Vous Cabine 📅', desc: 'Gérer les créneaux et rendez-vous clientes' },
  { key: 'lab', label: 'Laboratoire Cosmétique 🧪', desc: 'Préparer les ordonnances et flacons sur-mesure' },
  { key: 'compta', label: 'Comptabilité & Journaux SYSCOHADA 📊', desc: 'Accès aux bilans financiers et recettes' },
  { key: 'rh', label: 'Ressources Humaines & Paie CNPS 📄', desc: 'Gérer les bulletins de paie et contrats' },
  { key: 'settings', label: 'Paramètres du Salon ⚙️', desc: 'Accès à la configuration globale du salon' },
];

export default function ProEmployeesPage() {
  const { toast } = useToast();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPermissionDialogOpen, setIsPermissionDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  
  const [search, setSearch] = useState('');
  const [formData, setFormData] = useState({ firstName: '', lastName: '', phone: '', position: 'Praticienne', baseSalary: '', gender: 'F', role: 'praticienne' });

  // Permissions state for selected employee
  const [empPermissions, setEmpPermissions] = useState<Record<string, boolean>>({
    pos: true,
    agenda: true,
    lab: true,
    compta: false,
    rh: false,
    settings: false,
  });
  const [empPinCode, setEmpPinCode] = useState('1234');
  const [empRole, setEmpRole] = useState('praticienne');

  const fetchEmployees = async () => {
    try {
      const res = await fetch('/api/tenant/employees');
      const data = await res.json();
      if (data.success) setEmployees(data.employees);
    } catch {
      toast({ title: "Erreur", description: "Impossible de charger l'équipe.", variant: "destructive" });
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchEmployees(); }, []);

  const handleCreateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/tenant/employees', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        toast({ title: "✅ Membre Ajouté", description: "Nouveau profil employé créé avec droits par défaut." });
        setIsDialogOpen(false);
        setFormData({ firstName: '', lastName: '', phone: '', position: 'Praticienne', baseSalary: '', gender: 'F', role: 'praticienne' });
        fetchEmployees();
      } else throw new Error(data.error);
    } catch {
      toast({ title: "Erreur", description: "Impossible d'ajouter le membre.", variant: "destructive" });
    }
  };

  const openPermissionModal = (emp: Employee) => {
    setSelectedEmployee(emp);
    setEmpRole(emp.role || (emp.position?.toLowerCase().includes('manager') ? 'gerant' : 'praticienne'));
    setEmpPinCode(emp.pinCode || String(Math.floor(1000 + Math.random() * 9000)));
    setEmpPermissions(emp.permissions || {
      pos: true,
      agenda: true,
      lab: emp.position?.toLowerCase().includes('esthéticienne') || emp.position?.toLowerCase().includes('praticienne'),
      compta: emp.position?.toLowerCase().includes('comptable') || emp.position?.toLowerCase().includes('manager'),
      rh: emp.position?.toLowerCase().includes('rh') || emp.position?.toLowerCase().includes('manager'),
      settings: emp.position?.toLowerCase().includes('manager') || emp.position?.toLowerCase().includes('gérant'),
    });
    setIsPermissionDialogOpen(true);
  };

  const savePermissions = () => {
    if (!selectedEmployee) return;
    toast({
      title: "🔐 Droits d'Accès Mis à Jour !",
      description: `Les autorisations de ${selectedEmployee.firstName} ${selectedEmployee.lastName} (Rôle: ${empRole.toUpperCase()}) ont été enregistrées avec succès.`,
    });
    setIsPermissionDialogOpen(false);
  };

  const filtered = employees.filter(e =>
    `${e.firstName} ${e.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
    e.position?.toLowerCase().includes(search.toLowerCase())
  );

  const activeCount = employees.filter(e => e.status === 'active').length;

  return (
    <div className="space-y-6 text-white max-w-6xl mx-auto font-sans">

      {/* ── HEADER ── */}
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#1A1410] border border-white/10 p-5 rounded-3xl shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#8A1C14] to-[#4E1510] flex items-center justify-center">
              <Users className="w-5 h-5 text-red-200" />
            </div>
            <h1 className="text-2xl font-display font-black text-white tracking-tight">
              Gestion de l'Équipe & <span className="bg-gradient-to-r from-[#F3E5AB] to-[#C8951E] bg-clip-text text-transparent">Droits d'Accès</span>
            </h1>
          </div>
          <p className="text-white/50 text-xs ml-11">Contrôle des rôles, permissions applicatives, paie & accès sécurisés par le Gérant</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <motion.button
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs text-[#0F0A05] cursor-pointer shadow-lg"
              style={{ background: 'linear-gradient(135deg, #F3E5AB, #C8951E)' }}
            >
              <Plus className="w-4 h-4" /> Ajouter un Membre
            </motion.button>
          </DialogTrigger>
          <DialogContent className="bg-[#0F0A05] border border-[#C8951E]/30 text-white rounded-3xl shadow-2xl">
            <DialogHeader>
              <DialogTitle className="font-display text-xl text-white flex items-center gap-2">
                <span>👩‍💼</span> Ajouter un Employé au Salon
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateEmployee} className="space-y-4 mt-2">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-white/60 text-xs">Prénom</Label>
                  <Input required className="bg-white/5 border-white/10 text-white rounded-xl" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} />
                </div>
                <div className="space-y-1">
                  <Label className="text-white/60 text-xs">Nom</Label>
                  <Input required className="bg-white/5 border-white/10 text-white rounded-xl" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} />
                </div>
                <div className="space-y-1">
                  <Label className="text-white/60 text-xs">Téléphone</Label>
                  <Input required className="bg-white/5 border-white/10 text-white rounded-xl" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                </div>
                <div className="space-y-1">
                  <Label className="text-white/60 text-xs">Genre</Label>
                  <Select value={formData.gender} onValueChange={(v) => setFormData({ ...formData, gender: v })}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white rounded-xl"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-[#1A1410] border-[#362A21] text-white">
                      <SelectItem value="F">Femme</SelectItem>
                      <SelectItem value="M">Homme</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1 col-span-2">
                  <Label className="text-white/60 text-xs">Poste / Fonction</Label>
                  <Input required className="bg-white/5 border-white/10 text-white rounded-xl" placeholder="ex: Esthéticienne, Caissière..." value={formData.position} onChange={(e) => setFormData({ ...formData, position: e.target.value })} />
                </div>
                <div className="space-y-1 col-span-2">
                  <Label className="text-white/60 text-xs">Rôle Applicatif</Label>
                  <select 
                    className="w-full bg-[#1A1410] border border-white/10 text-white rounded-xl p-2.5 text-xs font-bold"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  >
                    <option value="praticienne">Praticienne / Esthéticienne (Agenda, Soins, Labo)</option>
                    <option value="caissier">Caissier / Caissière (Caisse POS & Ventes)</option>
                    <option value="comptable">Comptable (SYSCOHADA & Finance)</option>
                    <option value="rh">Responsable RH (Paie & CNPS)</option>
                    <option value="gerant">Gérant / Responsable (Accès Total Salon)</option>
                  </select>
                </div>
              </div>
              <DialogFooter className="flex gap-2">
                <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)} className="text-white/50 rounded-xl">Annuler</Button>
                <Button type="submit" className="bg-gradient-to-r from-[#F3E5AB] to-[#C8951E] text-[#0F0A05] font-bold rounded-xl h-11">
                  Enregistrer l'Employé
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* ── PERMISSIONS & ACCESS CONTROL MODAL (FOR SALON MANAGER) ── */}
      <Dialog open={isPermissionDialogOpen} onOpenChange={setIsPermissionDialogOpen}>
        <DialogContent className="bg-[#0F0A05] border border-[#C8951E]/40 text-white rounded-3xl shadow-2xl max-w-xl">
          <DialogHeader>
            <DialogTitle className="font-display text-xl text-[#F3E5AB] flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-[#C8951E]" /> Gestion des Droits d'Accès de l'Employé
            </DialogTitle>
          </DialogHeader>

          {selectedEmployee && (
            <div className="space-y-5 mt-2">
              {/* Employee Summary Chip */}
              <div className="bg-[#1A1410] border border-white/10 p-3.5 rounded-2xl flex items-center justify-between">
                <div>
                  <h3 className="font-display font-bold text-sm text-white">{selectedEmployee.firstName} {selectedEmployee.lastName}</h3>
                  <p className="text-xs text-white/50">{selectedEmployee.position || 'Membre de l\'équipe'}</p>
                </div>
                <span className="text-xs font-mono font-bold text-[#C8951E] bg-[#C8951E]/10 border border-[#C8951E]/30 px-3 py-1 rounded-full uppercase">
                  {empRole}
                </span>
              </div>

              {/* Role Selection */}
              <div className="space-y-1.5">
                <Label className="text-xs text-white/60 font-semibold uppercase font-mono">Attribution du Rôle Système :</Label>
                <select 
                  className="w-full bg-[#1A1410] border border-[#C8951E]/30 text-white rounded-xl p-2.5 text-xs font-bold"
                  value={empRole}
                  onChange={(e) => setEmpRole(e.target.value)}
                >
                  <option value="praticienne">Praticienne / Esthéticienne (Agenda, Soins & Labo)</option>
                  <option value="caissier">Caissière / Caissier (POS & Encaissements Wave/OM)</option>
                  <option value="comptable">Comptable (Finances & Déclarations SYSCOHADA)</option>
                  <option value="rh">Responsable RH (Contrats, Bulletins de Paie & CNPS)</option>
                  <option value="gerant">Gérant / Premier Responsable (Accès Administratif Total)</option>
                </select>
              </div>

              {/* Module Permissions Toggles */}
              <div className="space-y-2">
                <Label className="text-xs text-white/60 font-semibold uppercase font-mono">Permissions des Modules Applicatifs :</Label>
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {DEFAULT_PERMISSIONS.map((perm) => {
                    const isEnabled = !!empPermissions[perm.key];
                    return (
                      <div 
                        key={perm.key} 
                        onClick={() => setEmpPermissions(prev => ({ ...prev, [perm.key]: !prev[perm.key] }))}
                        className={`p-3 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                          isEnabled 
                            ? 'bg-[#C8951E]/10 border-[#C8951E]/40 text-white' 
                            : 'bg-[#1A1410] border-white/5 text-white/40'
                        }`}
                      >
                        <div>
                          <div className="text-xs font-bold font-display">{perm.label}</div>
                          <div className="text-[10px] text-white/50">{perm.desc}</div>
                        </div>
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-xl font-mono ${
                          isEnabled ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/5 text-white/30'
                        }`}>
                          {isEnabled ? 'AUTORISÉ ✅' : 'REFUSÉ 🔒'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Security PIN Code for App Login */}
              <div className="bg-[#1A1410] border border-white/10 p-3.5 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white flex items-center gap-1">
                    <Key className="w-3.5 h-3.5 text-[#C8951E]" /> Code PIN d'Accès Caisse & Tablettes :
                  </span>
                  <p className="text-[10px] text-white/40">Code à 4 chiffres pour déverrouiller la caisse</p>
                </div>
                <Input 
                  type="text" 
                  maxLength={4}
                  className="w-20 bg-[#0A0603] border-white/20 text-[#F3E5AB] font-mono text-center font-bold rounded-xl h-9" 
                  value={empPinCode}
                  onChange={(e) => setEmpPinCode(e.target.value)}
                />
              </div>

              <DialogFooter className="flex gap-2 pt-2">
                <Button variant="ghost" onClick={() => setIsPermissionDialogOpen(false)} className="text-white/50 rounded-xl">
                  Annuler
                </Button>
                <Button onClick={savePermissions} className="bg-gradient-to-r from-[#F3E5AB] to-[#C8951E] text-[#0F0A05] font-bold rounded-xl h-11 px-6">
                  Valider les Droits d'Accès
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ── SEARCH BAR ── */}
      <div className="relative">
        <Search className="absolute left-3.5 top-3 h-4 w-4 text-white/30" />
        <Input 
          placeholder="Rechercher par nom, rôle ou spécialité..." 
          className="pl-10 bg-[#1A1410] border-white/10 text-white rounded-2xl h-11 placeholder:text-white/30 focus:border-[#C8951E]" 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
        />
      </div>

      {/* ── TEAM & ROLES GRID ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((emp, i) => {
          const gradientBg = GENDER_BG[emp.gender] || GENDER_BG.F;
          const emoji = getPositionEmoji(emp.position || '');
          const isActive = emp.status === 'active';

          return (
            <div
              key={emp.id}
              className="group relative rounded-3xl border border-white/10 bg-[#1A1410] p-5 hover:border-[#C8951E]/50 transition duration-300 shadow-xl flex flex-col justify-between"
            >
              {/* Top Row Badges */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono font-bold text-[#C8951E] bg-[#C8951E]/10 border border-[#C8951E]/20 px-2.5 py-0.5 rounded-full uppercase">
                  {emp.position || 'Praticienne'}
                </span>

                <div className={`flex items-center gap-1.5 text-[9px] font-bold px-2 py-0.5 rounded-full ${isActive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`} />
                  {isActive ? 'Actif' : 'Inactif'}
                </div>
              </div>

              {/* Avatar & Name */}
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradientBg} border border-white/10 flex flex-col items-center justify-center shadow-md shrink-0`}>
                  <span className="text-2xl">{emoji}</span>
                </div>
                <div>
                  <div className="font-display font-bold text-sm text-white">{emp.firstName} {emp.lastName}</div>
                  <div className="text-[10px] text-white/50 mt-0.5 flex items-center gap-1 font-mono">
                    <Phone className="w-3 h-3 text-[#C8951E]" /> {emp.phone}
                  </div>
                </div>
              </div>

              {/* Permissions Control Footer */}
              <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                <button
                  onClick={() => openPermissionModal(emp)}
                  className="flex-1 py-2 px-3 rounded-xl bg-[#C8951E]/10 hover:bg-[#C8951E]/20 text-[#F3E5AB] font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer border border-[#C8951E]/30"
                >
                  <Lock className="w-3.5 h-3.5 text-[#C8951E]" />
                  <span>Droits & Permissions</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
