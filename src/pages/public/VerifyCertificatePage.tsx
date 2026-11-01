import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, ShieldCheck, Award, CheckCircle2, AlertCircle, Printer } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { TetraLogo } from '../../components/common/TetraLogo';
import { Certificate } from '../../types';

export const VerifyCertificatePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { verifyCertificateNumber } = useData();

  const [inputNum, setInputNum] = useState(searchParams.get('id') || '');
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    const id = searchParams.get('id');
    if (id) {
      setInputNum(id);
      const found = verifyCertificateNumber(id);
      setCertificate(found || null);
      setSearched(true);
    }
  }, [searchParams, verifyCertificateNumber]);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputNum.trim()) return;
    const found = verifyCertificateNumber(inputNum.trim());
    setCertificate(found || null);
    setSearched(true);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-[#F5F7FC] min-h-screen py-14">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-[#00A9FF] text-xs font-bold uppercase tracking-wider mb-3">
            Digital Credential System
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#071426] tracking-tight">
            Official Certificate <span className="text-[#00A9FF]">Verification</span>
          </h1>
          <p className="text-sm text-slate-500 mt-2">
            Authenticate genuine certificates issued by TETRA Training Institute.
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-md border border-slate-200 mb-10 max-w-2xl mx-auto">
          <form onSubmit={handleVerify} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={inputNum}
                onChange={(e) => setInputNum(e.target.value)}
                placeholder="Enter Certificate ID (e.g. TETRA-2026-AI-8839)"
                required
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 text-sm font-mono text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#00A9FF]"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-[#00A9FF] hover:bg-[#0096e6] text-white font-bold text-sm transition shadow-md shadow-[#00A9FF]/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Verify Now</span>
            </button>
          </form>

          {/* Quick Demo Certificate IDs */}
          <div className="mt-3 text-xs text-slate-500 flex items-center gap-2 flex-wrap">
            <span>Try sample certificate:</span>
            <button
              type="button"
              onClick={() => {
                setInputNum('TETRA-2026-AI-8839');
                const found = verifyCertificateNumber('TETRA-2026-AI-8839');
                setCertificate(found || null);
                setSearched(true);
              }}
              className="text-[#00A9FF] font-mono hover:underline font-semibold"
            >
              TETRA-2026-AI-8839
            </button>
            <span>or</span>
            <button
              type="button"
              onClick={() => {
                setInputNum('TETRA-2026-FS-9421');
                const found = verifyCertificateNumber('TETRA-2026-FS-9421');
                setCertificate(found || null);
                setSearched(true);
              }}
              className="text-[#00A9FF] font-mono hover:underline font-semibold"
            >
              TETRA-2026-FS-9421
            </button>
          </div>
        </div>

        {/* Certificate Display Result */}
        {searched && certificate && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5" />
                <span>Verified Official Credential Issued by TETRA</span>
              </div>
              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-sm cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print / Download PDF</span>
              </button>
            </div>

            {/* Official Printable Certificate Mockup matching Brand */}
            <div
              id="printable-certificate"
              className="bg-white rounded-3xl p-8 sm:p-14 border-8 border-double border-[#071426] shadow-2xl relative overflow-hidden"
            >
              {/* Corner Watermarks */}
              <div className="absolute top-4 left-4 w-16 h-16 border-t-2 border-l-2 border-[#00A9FF]" />
              <div className="absolute top-4 right-4 w-16 h-16 border-t-2 border-r-2 border-[#00A9FF]" />
              <div className="absolute bottom-4 left-4 w-16 h-16 border-b-2 border-l-2 border-[#00A9FF]" />
              <div className="absolute bottom-4 right-4 w-16 h-16 border-b-2 border-r-2 border-[#00A9FF]" />

              <div className="relative z-10 text-center space-y-6">
                <div className="flex justify-center">
                  <TetraLogo variant="horizontal" theme="light" size="lg" />
                </div>

                <div className="space-y-1">
                  <div className="text-xs uppercase tracking-[0.25em] text-[#00A9FF] font-extrabold">
                    Certificate of Competence &amp; Completion
                  </div>
                  <p className="text-xs text-slate-400">
                    This certifies that
                  </p>
                </div>

                <div className="text-3xl sm:text-4xl font-serif font-black text-[#071426] border-b-2 border-slate-200 pb-3 max-w-lg mx-auto">
                  {certificate.studentName}
                </div>

                <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
                  has successfully completed all required modules, practical assignments, and final capstone evaluation for the course
                </p>

                <div className="text-xl sm:text-2xl font-extrabold text-[#00A9FF]">
                  {certificate.courseTitle}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-slate-200 text-center text-xs">
                  <div>
                    <div className="text-slate-400">Date of Issue</div>
                    <div className="font-bold text-slate-800 mt-1">{certificate.issueDate}</div>
                  </div>
                  <div>
                    <div className="text-slate-400">Evaluation Grade</div>
                    <div className="font-bold text-emerald-600 mt-1">{certificate.grade}</div>
                  </div>
                  <div>
                    <div className="text-slate-400">Lead Instructor</div>
                    <div className="font-bold text-slate-800 mt-1">{certificate.trainerName}</div>
                  </div>
                </div>

                <div className="pt-4 flex flex-col items-center">
                  <div className="font-mono text-[11px] text-slate-400">
                    Certificate ID: <strong className="text-slate-700">{certificate.certificateNumber}</strong>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    Verified through TETRA Central Blockchain &amp; Database Registry
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {searched && !certificate && (
          <div className="text-center py-12 bg-white rounded-3xl border border-red-200 p-8 shadow-sm max-w-md mx-auto">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800">No Record Found</h3>
            <p className="text-xs text-slate-500 mt-1">
              Certificate ID <strong className="text-slate-700 font-mono">"{inputNum}"</strong> is not recognized in our database. Please double check the ID format.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
