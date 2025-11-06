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

  // Fetch global dashboard summary (all users' stats + 3 recent audits)
  const { data: summary } = useQuery<{
    totalAudits: number;
    uniqueUsers: number;
    zonaHijauPercentage: string;
    recentAudits: Array<{
      id: string;
      nama: string;
      jabatan: string;
      cabang: string;
      zonaKinerja: string;
      zonaPerilaku: string;
      zonaFinal: string;
      createdAt: Date;
    }>;
  }>({
    queryKey: ["/api/dashboard/summary"],
  });

  // Fetch user's own audits for full list (with search/filter)
  const { data: audits = [], isLoading } = useQuery<Audit[]>({
    queryKey: ["/api/audits"],
  });

  const deleteMutation = useMutation({
    mutationFn: async (auditId: string) => {
      // Use soft-delete (PATCH) instead of hard-delete
      return apiRequest("PATCH", `/api/audit/${auditId}/soft-delete`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/audits"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/summary"] });
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

  // Use global stats from summary endpoint (all users)
  const totalAudits = summary?.totalAudits ?? 0;
  const uniqueUsers = summary?.uniqueUsers ?? 0;
  const zonaHijauPercentage = summary?.zonaHijauPercentage ?? "0.0";
  
  // Calculate pending reviews from user's own audits
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
              <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48">
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/40 via-orange-500/30 to-amber-500/40 rounded-full blur-2xl animate-pulse" />
                <div className="relative w-full h-full rounded-full overflow-hidden shadow-2xl ring-2 ring-amber-500/30">
                  <img 
                    src="/logo-aisg.jpg" 
                    alt="AiSG Logo" 
                    className="w-full h-full object-cover"
                  />
                </div>
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
            value={`${zonaHijauPercentage}%`}
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
              Audit Terbaru (3)
            </h2>
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-64 bg-card rounded-lg animate-pulse" />
                ))}
              </div>
            ) : audits.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p className="text-lg mb-2">Belum ada audit</p>
                <p className="text-sm">Klik "Audit Baru" untuk memulai audit pertama Anda</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {audits.slice(0, 3).map((audit) => (
                  <div
                    key={audit.id}
                    className="bg-card rounded-xl border border-border p-6 space-y-4 hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => setLocation(`/audit/${audit.id}`)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1">
                        <h3 className="font-semibold text-lg">{audit.nama}</h3>
                        <p className="text-sm text-muted-foreground">{audit.jabatan}</p>
                        <p className="text-xs text-muted-foreground">{audit.cabang}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        audit.zonaFinal === "hijau" 
                          ? "bg-green-500/20 text-green-400" 
                          : audit.zonaFinal === "kuning"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-red-500/20 text-red-400"
                      }`}>
                        {audit.zonaFinal === "hijau" ? "🟩 Hijau" : audit.zonaFinal === "kuning" ? "🟨 Kuning" : "🟥 Merah"}
                      </div>
                    </div>
                    
                    <p className="text-xs text-muted-foreground">
                      {formatDate(audit.createdAt)}
                    </p>
                  </div>
                ))}
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
              Audit akan dihapus dari tampilan Anda, tapi admin masih bisa melihat dan mengembalikannya jika diperlukan.
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
