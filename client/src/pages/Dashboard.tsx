import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import StatCard from "@/components/StatCard";
import AuditCard from "@/components/AuditCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { BarChart3, Users, TrendingUp, Clock, Plus, Search, Filter } from "lucide-react";
import type { Audit } from "@shared/schema";

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [auditToDelete, setAuditToDelete] = useState<{ id: string; nama: string } | null>(null);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: audits = [], isLoading } = useQuery<Audit[]>({
    queryKey: ["/api/audits"],
  });

  const deleteMutation = useMutation({
    mutationFn: async (auditId: string) => {
      return apiRequest("DELETE", `/api/audit/${auditId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/audits"] });
      toast({
        title: "Audit dihapus",
        description: "Audit berhasil dihapus dari sistem",
      });
      setDeleteDialogOpen(false);
      setAuditToDelete(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Gagal menghapus audit. Silakan coba lagi.",
        variant: "destructive",
      });
    },
  });

  const handleDeleteClick = (audit: Audit) => {
    setAuditToDelete({ id: audit.id, nama: audit.nama });
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (auditToDelete) {
      deleteMutation.mutate(auditToDelete.id);
    }
  };

  const filteredAudits = audits.filter(audit =>
    audit.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
    audit.jabatan.toLowerCase().includes(searchQuery.toLowerCase()) ||
    audit.cabang.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate stats from real data
  const totalAudits = audits.length;
  const uniqueUsers = new Set(audits.map(a => a.nama)).size;
  const avgKinerja = audits.length > 0
    ? audits.filter(a => a.zonaKinerja === "success").length / audits.length * 100
    : 0;
  const pendingReviews = audits.filter(a => 
    a.prodemRekomendasi.recommendation === "Promosi" || 
    a.prodemRekomendasi.recommendation === "Demosi"
  ).length;

  const formatDate = (date: string | Date) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString("id-ID", { 
      day: "numeric", 
      month: "short", 
      year: "numeric" 
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-b border-amber-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16">
          <div className="text-center space-y-4 sm:space-y-6">
            {/* Logo */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-red-500/30 rounded-2xl blur-2xl animate-pulse" />
                <img 
                  src="/logo-aisg.jpg" 
                  alt="AiSG Logo" 
                  className="relative w-48 sm:w-64 md:w-80 h-auto drop-shadow-2xl"
                />
              </div>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                AiSG – Audit Intelligence System Growth
              </h1>
              <p className="text-sm sm:text-base text-gray-300 flex items-center justify-center gap-2">
                <span>By community builder</span>
                <span className="text-amber-400">✨</span>
              </p>
            </div>

            {/* Description */}
            <div className="max-w-3xl mx-auto">
              <p className="text-xs sm:text-sm md:text-base text-gray-200 leading-relaxed px-4">
                A breakthrough AI system that helps you discover hidden potential & elevate performance.
              </p>
              <p className="text-xs sm:text-sm text-gray-400 mt-3">
                **Powered by Newsmaker.id × AiSG Team × ChatGPT–OpenAI**
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-2 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 bg-clip-text text-transparent">Dashboard Audit</h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              Sistem Audit Intelligence untuk Evaluasi Kinerja & Kepemimpinan
            </p>
          </div>
          <Button 
            className="gap-2 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-gray-900 font-semibold shadow-lg shadow-amber-500/30" 
            data-testid="button-new-audit"
            onClick={() => setLocation("/audit/new")}
          >
            <Plus className="w-4 h-4" />
            Audit Baru
          </Button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          <StatCard
            title="Total Audit"
            value={totalAudits}
            icon={BarChart3}
            data-testid="stat-total-audits"
          />
          <StatCard
            title="Pengguna Unik"
            value={uniqueUsers}
            icon={Users}
            data-testid="stat-active-users"
          />
          <StatCard
            title="Zona Hijau"
            value={`${avgKinerja.toFixed(1)}%`}
            icon={TrendingUp}
            data-testid="stat-avg-score"
          />
          <StatCard
            title="Pending Review"
            value={pendingReviews}
            icon={Clock}
            data-testid="stat-pending-review"
          />
        </div>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Cari berdasarkan nama, jabatan, atau cabang..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="input-search"
              />
            </div>
            <Button variant="outline" className="gap-2" data-testid="button-filter">
              <Filter className="w-4 h-4" />
              Filter
            </Button>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">
              {isLoading ? "Memuat data..." : `Audit Terbaru (${filteredAudits.length})`}
            </h2>
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-64 bg-card rounded-lg animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredAudits.map((audit) => (
                  <AuditCard
                    key={audit.id}
                    auditId={audit.id}
                    nama={audit.nama}
                    jabatan={audit.jabatan}
                    cabang={audit.cabang}
                    zonaKinerja={audit.zonaKinerja as "success" | "warning" | "critical"}
                    zonaPerilaku={audit.zonaPerilaku as "success" | "warning" | "critical"}
                    profil={audit.profil as "Leader" | "Visionary" | "Performer" | "At-Risk"}
                    tanggal={formatDate(audit.createdAt)}
                    onView={() => setLocation(`/audit/${audit.id}`)}
                    onDelete={() => handleDeleteClick(audit)}
                    data-testid={`audit-card-${audit.id}`}
                  />
                ))}
              </div>
            )}
            {!isLoading && filteredAudits.length === 0 && audits.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <p className="text-lg mb-2">Belum ada audit</p>
                <p className="text-sm">Klik "Audit Baru" untuk memulai audit pertama Anda</p>
              </div>
            )}
            {!isLoading && filteredAudits.length === 0 && audits.length > 0 && (
              <div className="text-center py-12 text-muted-foreground">
                Tidak ada audit yang ditemukan dengan kata kunci "{searchQuery}"
              </div>
            )}
          </div>
        </div>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent data-testid="dialog-delete-audit">
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Audit?</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus audit untuk <strong>{auditToDelete?.nama}</strong>? 
              Tindakan ini tidak dapat dibatalkan dan semua data termasuk chat history akan dihapus permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete">Batal</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete}
              disabled={deleteMutation.isPending}
              data-testid="button-confirm-delete"
            >
              {deleteMutation.isPending ? "Menghapus..." : "Hapus"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
