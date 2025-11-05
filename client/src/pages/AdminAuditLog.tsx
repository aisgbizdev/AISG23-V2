/**
 * Admin Audit Log Page
 * Shows all audits from all users with creator info and PDF download
 */

import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, User, Calendar, Building, TrendingUp, Award } from "lucide-react";
import { format } from "date-fns";
import { id as indonesian } from "date-fns/locale";

interface AuditLogEntry {
  id: string;
  nama: string;
  jabatan: string;
  cabang: string;
  zonaKinerja: string | null;
  zonaPerilaku: string | null;
  zonaFinal: string | null;
  totalSelfScore: number | null;
  totalRealityScore: number | null;
  prodemRekomendasi: any;
  createdAt: string;
  updatedAt: string | null;
  ownerId: string | null;
  createdById: string | null;
  ownerName: string | null;
  ownerUsername: string | null;
}

export default function AdminAuditLog() {
  const { data: audits = [], isLoading } = useQuery<AuditLogEntry[]>({
    queryKey: ["/api/admin/audit-log"],
  });

  const getZoneColor = (zone: string | null) => {
    if (!zone) return "bg-gray-500/20 text-gray-400";
    switch (zone) {
      case "Success": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "Warning": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "Critical": return "bg-red-500/20 text-red-400 border-red-500/30";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  const getProDemBadge = (prodem: any) => {
    if (!prodem || !prodem.recommendation) return null;
    const rec = prodem.recommendation;
    if (rec === "Promosi") {
      return <span className="px-2 py-1 text-xs rounded-full bg-green-500/20 text-green-400 border border-green-500/30">🚀 Promosi</span>;
    } else if (rec === "Demosi") {
      return <span className="px-2 py-1 text-xs rounded-full bg-red-500/20 text-red-400 border border-red-500/30">⚠️ Demosi</span>;
    } else {
      return <span className="px-2 py-1 text-xs rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">➡️ Stay</span>;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-card rounded-lg w-1/3" />
            <div className="h-64 bg-card rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Audit Log
            </h1>
            <p className="text-muted-foreground mt-1">
              Semua aktivitas audit dari seluruh user
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border">
            <FileText className="w-5 h-5 text-purple-400" />
            <span className="font-semibold">{audits.length}</span>
            <span className="text-sm text-muted-foreground">Total Audits</span>
          </div>
        </div>

        {/* Audit List */}
        <div className="space-y-4">
          {audits.length === 0 ? (
            <Card className="p-12 text-center">
              <FileText className="w-16 h-16 mx-auto text-muted-foreground opacity-50 mb-4" />
              <p className="text-muted-foreground">Belum ada audit yang dibuat</p>
            </Card>
          ) : (
            audits.map((audit) => (
              <Card key={audit.id} className="p-6 hover:border-purple-500/30 transition-all">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  {/* Left: Audit Info */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-bold flex items-center gap-2">
                          <User className="w-5 h-5 text-purple-400" />
                          {audit.nama}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {audit.jabatan} • {audit.cabang}
                        </p>
                      </div>
                      {getProDemBadge(audit.prodemRekomendasi)}
                    </div>

                    {/* Metadata */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Building className="w-4 h-4 text-blue-400" />
                        <span className="text-muted-foreground">User:</span>
                        <span className="font-medium">{audit.ownerUsername || "N/A"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-green-400" />
                        <span className="text-muted-foreground">
                          {audit.createdAt ? format(new Date(audit.createdAt), "dd MMM yyyy", { locale: indonesian }) : "-"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <TrendingUp className="w-4 h-4 text-amber-400" />
                        <span className={`px-2 py-0.5 rounded text-xs border ${getZoneColor(audit.zonaFinal)}`}>
                          {audit.zonaFinal || "N/A"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Award className="w-4 h-4 text-pink-400" />
                        <span className="text-muted-foreground">
                          Reality: {audit.totalRealityScore ? (audit.totalRealityScore / 18).toFixed(1) : "N/A"}/5.0
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.location.href = `/audit/${audit.id}`}
                      className="gap-2"
                    >
                      <FileText className="w-4 h-4" />
                      Lihat Detail
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => window.open(`/api/audit/${audit.id}/pdf`, "_blank")}
                      className="gap-2 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-gray-900 font-semibold shadow-lg shadow-amber-500/30"
                    >
                      <Download className="w-4 h-4" />
                      Download PDF
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
