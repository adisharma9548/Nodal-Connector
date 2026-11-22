import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Award, CheckCircle2, ShieldCheck, AlertCircle, ArrowLeft, Printer, Calendar, Building, UserCheck } from 'lucide-react';
import { api } from '../../services/api';
import { CertificateModal } from '../../components/common/CertificateModal';
import { Button } from '../../components/common/Button';

export const VerifyCertificatePage: React.FC = () => {
  const { certId } = useParams<{ certId: string }>();
  const [certData, setCertData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchCert = async () => {
      if (!certId) return;
      setLoading(true);
      try {
        const res = await api.learning.getCertificate(certId);
        if (res.data) {
          setCertData(res.data);
        } else {
          setError('Certificate not found or credential identifier invalid.');
        }
      } catch (err: any) {
        setError(err.message || 'Unable to verify credential at this time.');
      }
      setLoading(false);
    };

    fetchCert();
  }, [certId]);

  return (
    <div className="min-h-[85vh] bg-slate-50 dark:bg-slate-950 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="w-full max-w-2xl">
        {/* Back navigation */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to National Portal</span>
          </Link>
        </div>

        {/* Verification Status Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden transition-all">
          {/* Header Bar */}
          <div className="bg-slate-900 dark:bg-slate-950 px-6 py-5 text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
              <div>
                <h1 className="text-sm font-bold tracking-tight">
                  NodalConnector Credential Registry
                </h1>
                <p className="text-[10px] text-slate-400">
                  Industry Verification Protocol (NodalConnector Cryptographic Audit)
                </p>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-slate-800 dark:bg-slate-900 text-emerald-400 border border-slate-700 dark:border-slate-800">
              AUDIT: ACTIVE
            </span>
          </div>

          <div className="p-6 sm:p-8">
            {loading && (
              <div className="text-center py-12 space-y-3">
                <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Querying cryptographic credential ledger...</p>
              </div>
            )}

            {error && !loading && (
              <div className="text-center py-10 space-y-4">
                <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto border border-red-200 dark:border-red-800">
                  <AlertCircle className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">Verification Unsuccessful</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">{error}</p>
                </div>
              </div>
            )}

            {certData && !loading && (
              <div className="space-y-6">
                {/* Verified Banner */}
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-emerald-950 dark:text-emerald-200">
                      Authentic Credential Verified
                    </h2>
                    <p className="text-xs text-emerald-700 dark:text-emerald-400">
                      This certificate was legitimately issued and registered with the National Directorate.
                    </p>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block">
                      Awarded Scholar
                    </span>
                    <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm">
                      <UserCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span>{certData.studentName}</span>
                    </div>
                    {certData.studentEmail && (
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono block">
                        {certData.studentEmail}
                      </span>
                    )}
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block">
                      Accredited Institution
                    </span>
                    <div className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-200">
                      <Building className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span>{certData.institution}</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1 sm:col-span-2">
                    <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block">
                      Certified Program & Track
                    </span>
                    <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm">
                      <Award className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                      <span>{certData.courseTitle}</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block">
                      Credential ID
                    </span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200 text-[11px] block">
                      {certData.certificateId}
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block">
                      Issue Date
                    </span>
                    <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>
                        {certData.completedAt
                          ? new Date(certData.completedAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })
                          : 'Official Record Active'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                  <span className="text-[11px] text-slate-400">
                    Issuer: {certData.issuer}
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.print()}
                      leftIcon={<Printer className="w-3.5 h-3.5" />}
                    >
                      Print Verification
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => setShowModal(true)}
                      leftIcon={<Award className="w-3.5 h-3.5 text-amber-300" />}
                    >
                      View Full Certificate
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {certData && (
        <CertificateModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          certificate={certData}
        />
      )}
    </div>
  );
};
