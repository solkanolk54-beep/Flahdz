import React, { useState } from 'react';
import { 
  X, 
  Database, 
  Server, 
  ShieldCheck, 
  Play, 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  Code, 
  Copy, 
  FileCode, 
  Lock, 
  Send, 
  Check, 
  AlertTriangle,
  QrCode,
  FlaskConical,
  CreditCard,
  Building2,
  DollarSign
} from 'lucide-react';

interface EscrowNodeBackendModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EscrowNodeBackendModal: React.FC<EscrowNodeBackendModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'simulation' | 'node-code' | 'postgres-schema'>('simulation');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  // Simulation form states
  const [contractId, setContractId] = useState('b2b-cnt-9081');
  const [contractStatus, setContractStatus] = useState<'SIGNED' | 'ESCROW_FUNDED'>('SIGNED');
  const [depositAmount, setDepositAmount] = useState(712500); // 15% of 4.75M
  const [paymentRef, setPaymentRef] = useState('SATIM-CIB-9081-REF');

  // Shipment release simulation states
  const [shipmentId, setShipmentId] = useState('shp-mla-01');
  const [shipmentAmount, setShipmentAmount] = useState(1056000);
  const [labReportCode, setLabReportCode] = useState('INRAA-QC-2026-9041');
  const [acidityPercentage, setAcidityPercentage] = useState<number>(0.24);
  const [pesticideFree, setPesticideFree] = useState<boolean>(true);
  const [buyerApproved, setBuyerApproved] = useState<boolean>(true);

  // Live simulation execution outputs
  const [fundLogs, setFundLogs] = useState<any | null>(null);
  const [fundLoading, setFundLoading] = useState(false);
  const [releaseLogs, setReleaseLogs] = useState<any | null>(null);
  const [releaseLoading, setReleaseLoading] = useState(false);

  if (!isOpen) return null;

  const handleCopy = (text: string, sectionKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionKey);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  // Run simulated POST /api/v1/escrow/fund
  const executeFundSimulation = () => {
    setFundLoading(true);
    setTimeout(() => {
      if (contractStatus !== 'SIGNED') {
        setFundLogs({
          status: 404,
          success: false,
          timestamp: new Date().toISOString(),
          endpoint: 'POST /api/v1/escrow/fund',
          response: {
            success: false,
            message: 'العقد غير موجود أو لم يتم توقيعه إلكترونياً بعد (يجب أن تكون حالته SIGNED).'
          }
        });
      } else {
        setContractStatus('ESCROW_FUNDED');
        setFundLogs({
          status: 200,
          success: true,
          timestamp: new Date().toISOString(),
          endpoint: 'POST /api/v1/escrow/fund',
          request: {
            contract_id: contractId,
            payment_ref: paymentRef,
            amount: depositAmount
          },
          response: {
            success: true,
            message: 'تم حجز مبلغ العربون بنجاح في حساب الضمان المشفر (Escrow Account).',
            contract_id: contractId,
            escrow_status: 'HELD_IN_ESCROW',
            deposit_amount_dzd: depositAmount,
            cib_satim_auth: 'SATIM-TX-AUT-2026-OK'
          }
        });
      }
      setFundLoading(false);
    }, 600);
  };

  // Run simulated POST /api/v1/escrow/verify-and-release
  const executeReleaseSimulation = () => {
    setReleaseLoading(true);
    setTimeout(() => {
      const isQualityApproved = Number(acidityPercentage) <= 0.8 && pesticideFree === true;

      if (!isQualityApproved || !buyerApproved) {
        setReleaseLogs({
          status: 422,
          success: false,
          timestamp: new Date().toISOString(),
          endpoint: 'POST /api/v1/escrow/verify-and-release',
          reasons: {
            acidity_check: Number(acidityPercentage) <= 0.8 ? 'مطابق (<= 0.8%)' : `مرفوض: نسبة حموضة مرتفعة (${acidityPercentage}%)`,
            pesticide_check: pesticideFree ? 'مطابق: خلو تام من المبيدات' : 'مرفوض: تم رصد متبقيات كيميائية',
            buyer_approval: buyerApproved ? 'موافق عليه' : 'مرفوض من مدير الجودة بالمؤسسة'
          },
          response: {
            success: false,
            message: 'تم رفض الشحنة لعدم مطابقتها للمواصفات المخبرية. تم إرجاع المبلغ لحساب المشتري.',
            escrow_status: 'REFUNDED_TO_BUYER',
            shipment_id: shipmentId
          }
        });
      } else {
        setReleaseLogs({
          status: 200,
          success: true,
          timestamp: new Date().toISOString(),
          endpoint: 'POST /api/v1/escrow/verify-and-release',
          request: {
            shipment_id: shipmentId,
            lab_report_code: labReportCode,
            acidity_percentage: acidityPercentage,
            pesticide_free: pesticideFree,
            buyer_approved: buyerApproved
          },
          response: {
            success: true,
            message: 'تم التحقق من الفحص المخبري بنجاح وتحرير الأموال لحساب المزرعة المعتمدة.',
            shipment_id: shipmentId,
            amount_released: shipmentAmount,
            escrow_status: 'RELEASED_TO_FARMER',
            released_at: new Date().toISOString(),
            bank_transfer_ref: 'BADR-DZ-TRANS-90812'
          }
        });
      }
      setReleaseLoading(false);
    }, 700);
  };

  const POSTGRESQL_SCHEMA_SQL = `-- ========================================================
-- 1. مخطط جدول العقود وحساب الضمان (PostgreSQL Migration Schema)
-- منصة فلاّح تيك (Fllah.dz) - B2B Agro-Industrial Contracts
-- ========================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- جدول عقود التوريد B2B
CREATE TABLE b2b_contracts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contract_number VARCHAR(50) UNIQUE NOT NULL,
    farm_id UUID NOT NULL REFERENCES farms(id),
    buyer_user_id UUID NOT NULL REFERENCES users(id),
    total_amount NUMERIC(12, 2) NOT NULL,
    escrow_deposit_amount NUMERIC(12, 2) NOT NULL, -- نسبة العربون (مثل 15%)
    status VARCHAR(30) DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'SIGNED', 'ESCROW_FUNDED', 'FULFILLED', 'CANCELLED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- جدول الشحنات والحساب المشفر (Escrow Shipments)
CREATE TABLE contract_shipments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contract_id UUID NOT NULL REFERENCES b2b_contracts(id) ON DELETE CASCADE,
    shipment_number VARCHAR(50) UNIQUE NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    escrow_status VARCHAR(30) DEFAULT 'HELD' CHECK (escrow_status IN ('HELD', 'RELEASED', 'REFUNDED')),
    lab_report_verified BOOLEAN DEFAULT FALSE,
    lab_acidity_percentage NUMERIC(4, 2), -- نسبة الحموضة (مثال: 0.24%)
    pesticide_free BOOLEAN DEFAULT FALSE,
    qr_code_token VARCHAR(100) UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    released_at TIMESTAMP WITH TIME ZONE
);

-- مؤشرات البحث والسرعة
CREATE INDEX idx_b2b_contracts_farm ON b2b_contracts(farm_id);
CREATE INDEX idx_contract_shipments_contract ON contract_shipments(contract_id);
CREATE INDEX idx_contract_shipments_escrow ON contract_shipments(escrow_status);
`;

  const NODE_EXPRESS_CODE = `// ========================================================
// 2. كود Node.js / Express (escrowController.js)
// إدارة حساب الضمان Escrow وفحص تقارير المخابر المعتمدة
// ========================================================

const express = require('express');
const router = express.Router();
const db = require('./db'); // وحدة الاتصال بقاعدة البيانات PostgreSQL

/**
 * @route   POST /api/v1/escrow/fund
 * @desc    تجميع ودفع عربون العقد وإيداعه في حساب الضمان Escrow
 */
router.post('/fund', async (req, res) => {
  const client = await db.pool.connect();
  try {
    const { contract_id, payment_ref, amount } = req.body;

    await client.query('BEGIN');

    // 1. التحقق من وجود العقد وحالته
    const contractRes = await client.query(
      \`SELECT * FROM b2b_contracts WHERE id = $1 AND status = 'SIGNED'\`,
      [contract_id]
    );

    if (contractRes.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        success: false,
        message: 'العقد غير موجود أو لم يتم توقيعه إلكترونياً بعد.',
      });
    }

    // 2. تحديث حالة العقد إلى ESCROW_FUNDED وتأكيد العربون
    await client.query(
      \`UPDATE b2b_contracts 
       SET status = 'ESCROW_FUNDED' 
       WHERE id = $1\`,
      [contract_id]
    );

    await client.query('COMMIT');

    return res.status(200).json({
      success: true,
      message: 'تم حجز مبلغ العربون بنجاح في حساب الضمان المشفر (Escrow Account).',
      contract_id,
      escrow_status: 'HELD_IN_ESCROW',
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ خطأ أثناء تمويل حساب الضمان:', error);
    return res.status(500).json({ success: false, message: 'خطأ في معالجة عملية الضمان.' });
  } finally {
    client.release();
  }
});

/**
 * @route   POST /api/v1/escrow/verify-and-release
 * @desc    اعتماد التقرير المخبري وتأكيد استلام الشحنة ثم تحرير الأموال للمزرعة تلقائياً
 */
router.post('/verify-and-release', async (req, res) => {
  const client = await db.pool.connect();
  try {
    const { 
      shipment_id, 
      lab_report_code, 
      acidity_percentage, 
      pesticide_free, 
      buyer_approved 
    } = req.body;

    await client.query('BEGIN');

    // 1. جلب الشحنة وحالة الضمان
    const shipmentRes = await client.query(
      \`SELECT * FROM contract_shipments WHERE id = $1 AND escrow_status = 'HELD'\`,
      [shipment_id]
    );

    if (shipmentRes.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        message: 'الشحنة غير موجودة أو تم تحرير أموال الضمان الخاصة بها سابقاً.',
      });
    }

    const shipment = shipmentRes.rows[0];

    // 2. فحص معايير الجودة المخبرية (محلية / INRAA / CACQE)
    // اشتراط نسبة حموضة <= 0.8% وخلو تام من المبيدات
    const isQualityApproved = parseFloat(acidity_percentage) <= 0.8 && pesticide_free === true;

    if (!isQualityApproved || !buyer_approved) {
      // إرجاع الأموال للمشتري في حال إخلال المورد بالمعايير
      await client.query(
        \`UPDATE contract_shipments 
         SET escrow_status = 'REFUNDED' 
         WHERE id = $1\`,
        [shipment_id]
      );

      await client.query('COMMIT');
      return res.status(422).json({
        success: false,
        message: 'تم رفض الشحنة لعدم مطابقتها للمواصفات المخبرية. تم إرجاع المبلغ لحساب المشتري.',
        escrow_status: 'REFUNDED_TO_BUYER',
      });
    }

    // 3. تحرير المبلغ وتحديث حالة الضمان إلى RELEASED
    await client.query(
      \`UPDATE contract_shipments 
       SET escrow_status = 'RELEASED',
           lab_report_verified = TRUE,
           lab_acidity_percentage = $1,
           pesticide_free = $2,
           released_at = CURRENT_TIMESTAMP
       WHERE id = $3\`,
      [acidity_percentage, pesticide_free, shipment_id]
    );

    await client.query('COMMIT');

    return res.status(200).json({
      success: true,
      message: 'تم التحقق من الفحص المخبري بنجاح وتحرير الأموال لحساب المزرعة المعتمدة.',
      shipment_id,
      amount_released: shipment.amount,
      escrow_status: 'RELEASED_TO_FARMER',
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ خطأ أثناء تحرير أموال الضمان:', error);
    return res.status(500).json({ success: false, message: 'خطأ في خادم عملية تحرير الضمان.' });
  } finally {
    client.release();
  }
});

module.exports = router;
`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-stone-900 rounded-3xl max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl border border-stone-700 text-stone-100">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-stone-950 via-emerald-950 to-stone-950 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-700/50 rounded-2xl border border-emerald-500/40 text-emerald-300">
              <Server className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base sm:text-lg text-white">
                  محرك عقود التوريد B2B وحساب الضمان Escrow (Node.js + PostgreSQL)
                </h3>
                <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-mono px-2 py-0.5 rounded-full border border-emerald-500/30 font-bold">
                  v1.2 Live Engine
                </span>
              </div>
              <p className="text-xs text-stone-400">
                إدارة دورة حياة العقود، حجز العربون 15%، واشتراط اعتماد تقارير INRAA/CACQE لتحرير الأموال
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-stone-950 px-5 py-3 border-b border-stone-800 flex items-center justify-between text-xs">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('simulation')}
              className={`px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition ${
                activeTab === 'simulation'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-stone-800 text-stone-400 hover:bg-stone-700'
              }`}
            >
              <Play className="w-3.5 h-3.5" />
              <span>المحاكي التفاعلي المباشر (Live Endpoint Sandbox)</span>
            </button>

            <button
              onClick={() => setActiveTab('node-code')}
              className={`px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition ${
                activeTab === 'node-code'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-stone-800 text-stone-400 hover:bg-stone-700'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>كود Node.js / Express (escrowController.js)</span>
            </button>

            <button
              onClick={() => setActiveTab('postgres-schema')}
              className={`px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition ${
                activeTab === 'postgres-schema'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-stone-800 text-stone-400 hover:bg-stone-700'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>مخطط PostgreSQL Schema (DDL)</span>
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-stone-400 text-[11px] font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>REST API Active: /api/v1/escrow/*</span>
          </div>
        </div>

        {/* Scrollable Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* TAB 1: INTERACTIVE SIMULATION SANDBOX */}
          {activeTab === 'simulation' && (
            <div className="space-y-6">
              
              {/* Endpoint 1: /api/v1/escrow/fund */}
              <div className="bg-stone-800/80 rounded-2xl border border-stone-700 p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-700 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-emerald-500/20 text-emerald-400 font-mono font-bold px-2 py-0.5 rounded text-xs border border-emerald-500/30">
                      POST
                    </span>
                    <span className="font-mono text-xs text-stone-200 font-bold">
                      /api/v1/escrow/fund
                    </span>
                    <span className="text-xs text-stone-400">(تمويل وحجز عربون العقد 15%)</span>
                  </div>
                  <span className="text-[11px] text-stone-400">الجدول المتأثر: b2b_contracts</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="block text-stone-400 font-semibold mb-1">معرف العقد (contract_id):</label>
                    <input
                      type="text"
                      value={contractId}
                      onChange={(e) => setContractId(e.target.value)}
                      className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-stone-100 font-mono text-xs focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-400 font-semibold mb-1">حالة العقد الأولية:</label>
                    <select
                      value={contractStatus}
                      onChange={(e) => setContractStatus(e.target.value as any)}
                      className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-stone-100 font-bold text-xs focus:ring-1 focus:ring-emerald-500"
                    >
                      <option value="SIGNED">SIGNED (موقّع إلكترونياً)</option>
                      <option value="DRAFT">DRAFT (مسودة - يسبب خطأ)</option>
                      <option value="ESCROW_FUNDED">ESCROW_FUNDED (ممكّن مسبقاً)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-stone-400 font-semibold mb-1">مبلغ العربون (15% دج):</label>
                    <input
                      type="number"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(Number(e.target.value))}
                      className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-stone-100 font-mono text-xs focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-400 font-semibold mb-1">مرجع الدفع (payment_ref):</label>
                    <input
                      type="text"
                      value={paymentRef}
                      onChange={(e) => setPaymentRef(e.target.value)}
                      className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-stone-100 font-mono text-xs focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <p className="text-[11px] text-stone-400">
                    يقوم هذا الإجراء ببدء معاملة PostgreSQL Transaction (BEGIN/COMMIT) وتأكيد حالة <code className="text-emerald-400">ESCROW_FUNDED</code>.
                  </p>
                  <button
                    onClick={executeFundSimulation}
                    disabled={fundLoading}
                    className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition active:scale-95 disabled:opacity-50"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>{fundLoading ? 'جاري التنفيذ...' : 'إرسال الطلب (Execute)'}</span>
                  </button>
                </div>

                {fundLogs && (
                  <div className={`p-3.5 rounded-xl border font-mono text-xs ${
                    fundLogs.success 
                      ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' 
                      : 'bg-red-950/40 border-red-500/40 text-red-300'
                  }`}>
                    <div className="flex items-center justify-between border-b border-current/20 pb-1.5 mb-2">
                      <span className="font-bold flex items-center gap-1">
                        {fundLogs.success ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                        HTTP Response Status: {fundLogs.status}
                      </span>
                      <span className="text-[10px] opacity-75">{fundLogs.timestamp}</span>
                    </div>
                    <pre className="overflow-x-auto whitespace-pre-wrap text-[11px]">
                      {JSON.stringify(fundLogs.response, null, 2)}
                    </pre>
                  </div>
                )}
              </div>

              {/* Endpoint 2: /api/v1/escrow/verify-and-release */}
              <div className="bg-stone-800/80 rounded-2xl border border-stone-700 p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-700 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-emerald-500/20 text-emerald-400 font-mono font-bold px-2 py-0.5 rounded text-xs border border-emerald-500/30">
                      POST
                    </span>
                    <span className="font-mono text-xs text-stone-200 font-bold">
                      /api/v1/escrow/verify-and-release
                    </span>
                    <span className="text-xs text-stone-400">(فحص تقرير المخبر وتحرير الدفعة للمزرعة)</span>
                  </div>
                  <span className="text-[11px] text-stone-400">الجدول المتأثر: contract_shipments</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block text-stone-400 font-semibold mb-1">معرف الشحنة (shipment_id):</label>
                    <input
                      type="text"
                      value={shipmentId}
                      onChange={(e) => setShipmentId(e.target.value)}
                      className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-stone-100 font-mono text-xs focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-400 font-semibold mb-1">رمز تقرير المخبر (INRAA/CACQE):</label>
                    <input
                      type="text"
                      value={labReportCode}
                      onChange={(e) => setLabReportCode(e.target.value)}
                      className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-stone-100 font-mono text-xs focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-400 font-semibold mb-1">قيمة الشحنة (دج):</label>
                    <input
                      type="number"
                      value={shipmentAmount}
                      onChange={(e) => setShipmentAmount(Number(e.target.value))}
                      className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-stone-100 font-mono text-xs focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-stone-900/60 p-3.5 rounded-xl border border-stone-700">
                  <div>
                    <label className="block text-stone-300 font-bold mb-1">
                      نسبة الحموضة المخبرية (Acidity %):
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="3.0"
                        value={acidityPercentage}
                        onChange={(e) => setAcidityPercentage(parseFloat(e.target.value))}
                        className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-stone-100 font-mono text-xs focus:ring-1 focus:ring-emerald-500"
                      />
                      <span className={`text-[10px] font-bold px-2 py-1 rounded whitespace-nowrap ${
                        acidityPercentage <= 0.8 ? 'bg-emerald-900 text-emerald-300' : 'bg-red-900 text-red-300'
                      }`}>
                        {acidityPercentage <= 0.8 ? 'مطابق (<= 0.8%)' : 'مخالف (> 0.8%)'}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-stone-300 font-bold mb-1">
                      خلو تام من المبيدات (Pesticide Free):
                    </label>
                    <select
                      value={pesticideFree ? 'true' : 'false'}
                      onChange={(e) => setPesticideFree(e.target.value === 'true')}
                      className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-stone-100 text-xs focus:ring-1 focus:ring-emerald-500"
                    >
                      <option value="true">نعم (0.00 mg/kg - سليم ومطابق)</option>
                      <option value="false">لا (يحتوي متبقيات - رفض فوري)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-stone-300 font-bold mb-1">
                      موافقة استلام المؤسسة (Buyer Approved):
                    </label>
                    <select
                      value={buyerApproved ? 'true' : 'false'}
                      onChange={(e) => setBuyerApproved(e.target.value === 'true')}
                      className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-stone-100 text-xs focus:ring-1 focus:ring-emerald-500"
                    >
                      <option value="true">نعم (تم توقيع وصل الاستلام)</option>
                      <option value="false">لا (معترض - إرجاع العربون)</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <p className="text-[11px] text-stone-400">
                    معيار الجودة: <code className="text-emerald-400">acidity_percentage &le; 0.8</code> و <code className="text-emerald-400">pesticide_free = true</code> و <code className="text-emerald-400">buyer_approved = true</code>.
                  </p>
                  <button
                    onClick={executeReleaseSimulation}
                    disabled={releaseLoading}
                    className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition active:scale-95 disabled:opacity-50"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>{releaseLoading ? 'جاري الفحص...' : 'فحص التقرير وتحرير الدفعة'}</span>
                  </button>
                </div>

                {releaseLogs && (
                  <div className={`p-3.5 rounded-xl border font-mono text-xs ${
                    releaseLogs.success 
                      ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' 
                      : 'bg-red-950/40 border-red-500/40 text-red-300'
                  }`}>
                    <div className="flex items-center justify-between border-b border-current/20 pb-1.5 mb-2">
                      <span className="font-bold flex items-center gap-1">
                        {releaseLogs.success ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                        HTTP Status: {releaseLogs.status} - {releaseLogs.success ? 'RELEASED_TO_FARMER' : 'REFUNDED_TO_BUYER'}
                      </span>
                      <span className="text-[10px] opacity-75">{releaseLogs.timestamp}</span>
                    </div>
                    {releaseLogs.reasons && (
                      <div className="mb-2 p-2 bg-black/40 rounded text-[11px] space-y-0.5">
                        <p>• فحص الحموضة: {releaseLogs.reasons.acidity_check}</p>
                        <p>• فحص المبيدات: {releaseLogs.reasons.pesticide_check}</p>
                        <p>• موافقة المشتري: {releaseLogs.reasons.buyer_approval}</p>
                      </div>
                    )}
                    <pre className="overflow-x-auto whitespace-pre-wrap text-[11px]">
                      {JSON.stringify(releaseLogs.response, null, 2)}
                    </pre>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 2: NODE.JS / EXPRESS CONTROLLER CODE */}
          {activeTab === 'node-code' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-stone-400">
                <span className="font-mono text-emerald-400">controllers/escrowController.js (Express + pg Router)</span>
                <button
                  onClick={() => handleCopy(NODE_EXPRESS_CODE, 'node-code')}
                  className="flex items-center gap-1.5 px-3 py-1 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg transition"
                >
                  {copiedSection === 'node-code' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSection === 'node-code' ? 'تم النسخ!' : 'نسخ الكود'}</span>
                </button>
              </div>

              <div className="bg-stone-950 p-4 rounded-2xl border border-stone-800 font-mono text-xs overflow-x-auto text-stone-300 leading-relaxed max-h-[55vh]">
                <pre>{NODE_EXPRESS_CODE}</pre>
              </div>
            </div>
          )}

          {/* TAB 3: POSTGRESQL SCHEMA DDL */}
          {activeTab === 'postgres-schema' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-stone-400">
                <span className="font-mono text-emerald-400">migrations/20261009_b2b_escrow_schema.sql</span>
                <button
                  onClick={() => handleCopy(POSTGRESQL_SCHEMA_SQL, 'postgres-schema')}
                  className="flex items-center gap-1.5 px-3 py-1 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg transition"
                >
                  {copiedSection === 'postgres-schema' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSection === 'postgres-schema' ? 'تم النسخ!' : 'نسخ المخطط'}</span>
                </button>
              </div>

              <div className="bg-stone-950 p-4 rounded-2xl border border-stone-800 font-mono text-xs overflow-x-auto text-stone-300 leading-relaxed max-h-[55vh]">
                <pre>{POSTGRESQL_SCHEMA_SQL}</pre>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-950 border-t border-stone-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-stone-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>نظام الضمان المشفر Escrow متوافق مع معايير بنك الجزائر والمدفوعات الإلكترونية CIB/الذهبية.</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl font-bold transition"
          >
            إغلاق المحاكي
          </button>
        </div>

      </div>
    </div>
  );
};
