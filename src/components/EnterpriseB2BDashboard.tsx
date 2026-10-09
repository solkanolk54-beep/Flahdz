import React, { useState } from 'react';
import { B2BEnterpriseContract, B2BShipment } from '../types/agritech';
import { 
  Building2, 
  FileCheck2, 
  CalendarDays, 
  Truck, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  ArrowUpRight, 
  Sparkles, 
  PlusCircle, 
  Download, 
  FileText,
  AlertCircle,
  TrendingUp,
  Receipt,
  Server,
  Database
} from 'lucide-react';

interface EnterpriseB2BDashboardProps {
  contracts: B2BEnterpriseContract[];
  onOpenNewContractModal: () => void;
  onOpenShipmentLabReport: (shipment: B2BShipment) => void;
  onOpenContractAgreement?: (contractNumber?: string) => void;
  onOpenNodeEscrowModal?: () => void;
}

export const EnterpriseB2BDashboard: React.FC<EnterpriseB2BDashboardProps> = ({
  contracts,
  onOpenNewContractModal,
  onOpenShipmentLabReport,
  onOpenContractAgreement,
  onOpenNodeEscrowModal,
}) => {
  const [selectedContractId, setSelectedContractId] = useState<string>(contracts[0]?.id || 'cnt-1');
  const [filterType, setFilterType] = useState<string>('الكل');

  const activeContract = contracts.find(c => c.id === selectedContractId) || contracts[0];

  // Aggregated KPIs
  const totalVolumeContracted = contracts.reduce((acc, c) => acc + c.totalContractedQuantity, 0);
  const totalVolumeDelivered = contracts.reduce((acc, c) => acc + c.deliveredQuantity, 0);
  const totalFinancialValue = contracts.reduce((acc, c) => acc + (c.totalContractedQuantity * c.pricePerUnit), 0);

  const filteredContracts = contracts.filter(c => {
    if (filterType === 'الكل') return true;
    return c.enterpriseType === filterType;
  });

  return (
    <div className="space-y-6">
      {/* Enterprise Header Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-emerald-950 to-stone-900 rounded-3xl p-6 sm:p-7 text-white shadow-lg border border-stone-800">
        <div className="flex flex-wrap items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-emerald-800/80 border border-emerald-500/40 px-3 py-1 rounded-full text-xs font-bold text-emerald-200">
              <Building2 className="w-4 h-4 text-emerald-400" />
              <span>بوابة المؤسسات وسلاسل التوريد (B2B Enterprise Portal)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              إدارة عقود التوريد السنوية وجدولة الشحنات الدورية
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 max-w-2xl leading-relaxed">
              منصة مركزية للفنادق، سلاسل المطاعم، ومصانع التحويل الغذائي لضبط الحصص الدورية، فحص تقارير المخابر المعتمدة (INRAA/ITDAS)، وضمان سلسلة التوريد المباشرة من المزارع الوطنية.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <button
              onClick={onOpenNodeEscrowModal}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-800 to-teal-800 hover:from-emerald-700 hover:to-teal-700 text-white border border-emerald-400/30 px-3.5 py-3 rounded-2xl text-xs font-black shadow-md transition active:scale-95"
              title="محاكي REST API وكود Node.js ومخطط PostgreSQL"
            >
              <Server className="w-4 h-4 text-emerald-300" />
              <span>محرك Node.js & Escrow API</span>
            </button>

            <button
              onClick={() => onOpenContractAgreement?.(activeContract?.contractNumber)}
              className="flex items-center justify-center gap-2 bg-stone-800 hover:bg-stone-700 border border-emerald-500/40 text-emerald-300 px-4 py-3 rounded-2xl text-xs font-black shadow-md transition active:scale-95"
            >
              <FileCheck2 className="w-4 h-4 text-emerald-400" />
              <span>وثيقة العقد السنوي (AGRO-B2B)</span>
            </button>

            <button
              onClick={onOpenNewContractModal}
              className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 rounded-2xl text-xs font-black shadow-md shadow-emerald-700/25 transition active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>عقد جديد</span>
            </button>
          </div>
        </div>

        {/* Global Enterprise KPI Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-6 border-t border-stone-800/80">
          <div className="bg-white/5 backdrop-blur rounded-2xl p-3.5 border border-white/10">
            <span className="text-[11px] text-stone-400 font-semibold block">إجمالي العقود النشطة</span>
            <div className="text-lg font-black text-white font-mono mt-0.5">
              {contracts.length} مؤسسات كبرى
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur rounded-2xl p-3.5 border border-white/10">
            <span className="text-[11px] text-stone-400 font-semibold block">نسبة استيفاء الحصص الدورية</span>
            <div className="text-lg font-black text-emerald-400 font-mono mt-0.5">
              {Math.round((totalVolumeDelivered / totalVolumeContracted) * 100)}% من المتعاقد
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur rounded-2xl p-3.5 border border-white/10">
            <span className="text-[11px] text-stone-400 font-semibold block">القيمة الإجمالية للعقود</span>
            <div className="text-lg font-black text-white font-mono mt-0.5">
              {(totalFinancialValue / 1000000).toFixed(1)} مليون دج
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur rounded-2xl p-3.5 border border-white/10">
            <span className="text-[11px] text-stone-400 font-semibold block">معيار الجودة المخبرية</span>
            <div className="text-lg font-black text-emerald-300 font-mono mt-0.5 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>مطابقة 100% (INRAA)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Contract Selector & Filter Tabs */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        {/* Enterprise Type Pills */}
        <div className="flex gap-2 overflow-x-auto scrollbar-none">
          {['الكل', 'سلسلة فنادق', 'مصنع تحويل وتصبير غذائي', 'سلسلة مطاعم فاخرة'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                filterType === type
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <span className="text-xs text-stone-500 font-semibold hidden sm:inline">
          اختر العقد لاستعراض جدول الشحنات وسجل المطابقة المخبرية
        </span>
      </div>

      {/* Main Split Layout: Active Contracts List + Selected Contract Detail Ledger */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Contracts Left List (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="text-xs font-extrabold text-stone-700 px-1">
            العقود المبرمة للمؤسسات ({filteredContracts.length})
          </h3>

          <div className="space-y-3">
            {filteredContracts.map((contract) => {
              const isSelected = contract.id === selectedContractId;
              const progressPercent = Math.round((contract.deliveredQuantity / contract.totalContractedQuantity) * 100);

              return (
                <div
                  key={contract.id}
                  onClick={() => setSelectedContractId(contract.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-white border-emerald-600 shadow-md ring-2 ring-emerald-500/20'
                      : 'bg-white border-stone-200 hover:border-emerald-300 shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md font-bold">
                      {contract.contractNumber}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      contract.status === 'عقد نشط وساري'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {contract.status}
                    </span>
                  </div>

                  <h4 className="font-extrabold text-stone-900 text-sm mt-2">
                    {contract.enterpriseName}
                  </h4>
                  <p className="text-xs text-stone-500 mt-0.5 truncate">
                    المحصول: <strong className="text-stone-800">{contract.cropTitle}</strong>
                  </p>
                  <p className="text-[11px] text-stone-400">
                    المورد: {contract.farmName} ({contract.wilaya})
                  </p>

                  {/* Progress bar */}
                  <div className="mt-3 pt-2.5 border-t border-stone-100 space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-stone-500">الحصة المستلمة:</span>
                      <strong className="text-emerald-700 font-mono">
                        {contract.deliveredQuantity} / {contract.totalContractedQuantity} {contract.unit} ({progressPercent}%)
                      </strong>
                    </div>
                    <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                        style={{ width: `${progressPercent}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="mt-2.5 flex items-center justify-between text-[11px] text-stone-600">
                    <span>دورية التوريد: <strong>{contract.periodicDeliveryInterval}</strong></span>
                    <span className="text-amber-800 font-bold bg-amber-50 px-1.5 py-0.5 rounded">
                      شحنة قادمة: {contract.nextDeliveryDate}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Contract Inspection & Shipment Ledger (8 cols) */}
        <div className="lg:col-span-8 space-y-5">
          {activeContract ? (
            <>
              {/* Contract Header Details Card */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-xs space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-stone-100 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-black text-stone-900">
                        {activeContract.enterpriseName}
                      </h3>
                      <span className="bg-stone-100 text-stone-700 text-xs font-bold px-2 py-0.5 rounded-lg">
                        {activeContract.enterpriseType}
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 mt-1">
                      عقد توريد سنوي رقم: <span className="font-mono text-emerald-800 font-bold">{activeContract.contractNumber}</span>
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <div className="text-left font-mono">
                      <span className="text-xs text-stone-400 block">سعر التوريد المتفق عليه</span>
                      <span className="text-base font-black text-emerald-800">
                        {activeContract.pricePerUnit.toLocaleString()} دج
                        <span className="text-xs font-normal text-stone-600 mr-1">/ {activeContract.unit}</span>
                      </span>
                    </div>

                    <button
                      onClick={() => onOpenContractAgreement?.(activeContract.contractNumber)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-[11px] font-bold transition active:scale-95"
                    >
                      <FileCheck2 className="w-3.5 h-3.5 text-emerald-700" />
                      <span>عرض وثيقة العقد الموثقة (PDF)</span>
                    </button>
                  </div>
                </div>

                {/* Lab Certification Requirement Spec Box */}
                <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-emerald-950 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-700" />
                      اشتراطات الفحص المخبري الإلزامية للعقد (Lab Quality Requirement):
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={onOpenNodeEscrowModal}
                        className="text-[10px] bg-emerald-800 hover:bg-emerald-900 text-white font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 transition"
                      >
                        <Server className="w-3 h-3 text-emerald-300" />
                        <span>منطق تحرير الضمان (Node.js Escrow)</span>
                      </button>
                      <span className="text-[10px] bg-emerald-200/60 text-emerald-900 font-bold px-2 py-0.5 rounded-full">
                        مفحوص رسمياً
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-emerald-800 leading-relaxed font-medium">
                    {activeContract.labRequirementSpec}
                  </p>
                </div>

                {/* Logistics & Timing metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-stone-50 p-3.5 rounded-2xl border border-stone-100 text-xs">
                  <div>
                    <span className="text-stone-400 block text-[11px]">المزرعة الموردة:</span>
                    <strong className="text-stone-900 font-bold block truncate">{activeContract.farmName}</strong>
                    <span className="text-stone-500 text-[10px]">{activeContract.wilaya}</span>
                  </div>

                  <div>
                    <span className="text-stone-400 block text-[11px]">الشحنة الدورية القادمة:</span>
                    <strong className="text-amber-800 font-bold block font-mono">{activeContract.nextDeliveryDate}</strong>
                    <span className="text-stone-500 text-[10px]">دورية: {activeContract.periodicDeliveryInterval}</span>
                  </div>

                  <div className="col-span-2 sm:col-span-1">
                    <span className="text-stone-400 block text-[11px]">إجمالي الحصة المتبقية:</span>
                    <strong className="text-stone-900 font-mono font-bold block">
                      {activeContract.totalContractedQuantity - activeContract.deliveredQuantity} {activeContract.unit}
                    </strong>
                    <span className="text-emerald-700 text-[10px] font-bold">جاهزة في الحقل</span>
                  </div>
                </div>
              </div>

              {/* Periodic Shipments Ledger */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-extrabold text-stone-900 flex items-center gap-2">
                    <Truck className="w-4 h-4 text-emerald-700" />
                    <span>جدول الشحنات الدورية وسجل الفحص المخبري</span>
                  </h4>
                  <span className="text-xs text-stone-500 font-mono">
                    {activeContract.shipments.length} شحنات مسجلة
                  </span>
                </div>

                <div className="space-y-3">
                  {activeContract.shipments.map((shipment) => (
                    <div
                      key={shipment.id}
                      className="p-4 rounded-2xl border border-stone-200 bg-stone-50/50 hover:bg-white hover:border-emerald-300 transition space-y-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs bg-stone-200 text-stone-800 px-2 py-0.5 rounded">
                            {shipment.shipmentNumber}
                          </span>
                          <span className="text-xs font-bold text-stone-900">
                            تاريخ التسليم: {shipment.deliveryDate}
                          </span>
                        </div>

                        {/* Tracking Status Badge */}
                        <div className="flex items-center gap-2">
                          <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                            shipment.trackingStatus === 'تم الفحص والاستلام'
                              ? 'bg-emerald-100 text-emerald-800'
                              : shipment.trackingStatus === 'في الطريق إلى المؤسسة'
                              ? 'bg-blue-100 text-blue-800 animate-pulse'
                              : 'bg-stone-100 text-stone-600'
                          }`}>
                            {shipment.trackingStatus === 'تم الفحص والاستلام' && <CheckCircle2 className="w-3.5 h-3.5" />}
                            {shipment.trackingStatus === 'في الطريق إلى المؤسسة' && <Truck className="w-3.5 h-3.5" />}
                            {shipment.trackingStatus}
                          </span>
                        </div>
                      </div>

                      {/* Shipment specs */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                        <div className="bg-white p-2.5 rounded-xl border border-stone-200">
                          <span className="text-stone-400 text-[10px] block">الكمية المسلّمة:</span>
                          <strong className="text-stone-900 font-mono">{shipment.quantity} {shipment.unit}</strong>
                          <span className="text-stone-400 block text-[10px] mt-0.5">
                            القيمة: {shipment.invoiceAmountDzd.toLocaleString()} دج
                          </span>
                        </div>

                        <div className="bg-white p-2.5 rounded-xl border border-stone-200">
                          <span className="text-stone-400 text-[10px] block">الناقل وسلسلة التبريد:</span>
                          <strong className="text-stone-800 truncate block">{shipment.carrierName}</strong>
                          <span className="text-blue-700 text-[10px] block truncate">{shipment.vehicleType}</span>
                        </div>

                        <div className="bg-white p-2.5 rounded-xl border border-stone-200">
                          <span className="text-stone-400 text-[10px] block">حالة التحليل المخبري:</span>
                          <strong className={`block text-[11px] truncate ${
                            shipment.labStatus === 'مفحوص ومطابق مخبرياً' ? 'text-emerald-700' : 'text-amber-700'
                          }`}>
                            {shipment.labStatus}
                          </strong>
                          <button
                            onClick={() => onOpenShipmentLabReport(shipment)}
                            className="text-emerald-700 hover:text-emerald-900 underline text-[10px] font-bold mt-0.5 block"
                          >
                            عرض شهادة المطابقة
                          </button>
                        </div>
                      </div>

                      {/* Summary Note */}
                      <div className="text-[11px] text-stone-600 bg-white/80 p-2 rounded-xl border border-stone-100 flex items-center justify-between">
                        <span><strong>ملخص تقرير المخبر:</strong> {shipment.labReportSummary}</span>
                        <button
                          onClick={() => alert(`تم تنزيل وصل الاستلام والفحص المخبري للشحنة ${shipment.shipmentNumber}`)}
                          className="text-stone-500 hover:text-stone-800 flex items-center gap-1 text-[10px] font-bold"
                          title="تنزيل إيصال الشحنة"
                        >
                          <Download className="w-3 h-3" />
                          <span>تنزيل الإيصال</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-3xl p-8 text-center text-stone-400 border border-stone-200">
              يرجى اختيار أحد العقود المبرمة لعرض تفاصيله
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
