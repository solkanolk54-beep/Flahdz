import React, { useState } from 'react';
import { useAccessibility } from '../context/AccessibilityContext';
import { Crop, PreOrderRequest, PaymentDeposit } from '../types/agritech';
import { 
  X, 
  CreditCard, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  AlertCircle, 
  QrCode, 
  Download, 
  ArrowRight,
  Smartphone,
  Sparkles,
  Receipt,
  Volume2,
  VolumeX
} from 'lucide-react';

interface EdahabiaCibPaymentModalProps {
  preOrder: PreOrderRequest;
  onClose: () => void;
  onPaymentSuccess: (depositRecord: PaymentDeposit) => void;
}

export const EdahabiaCibPaymentModal: React.FC<EdahabiaCibPaymentModalProps> = ({
  preOrder,
  onClose,
  onPaymentSuccess,
}) => {
  const { isAccessibleMode, speakText, isSpeaking, stopSpeaking, currentlySpeakingText } = useAccessibility();
  const [cardType, setCardType] = useState<'Edahabia' | 'CIB'>('Edahabia');
  const [cardNumber, setCardNumber] = useState<string>('5030');
  const [cardHolder, setCardHolder] = useState<string>(preOrder.buyerName || 'محمد بوعلام');
  const [expiryMonth, setExpiryMonth] = useState<string>('08');
  const [expiryYear, setExpiryYear] = useState<string>('28');
  const [cvv, setCvv] = useState<string>('724');
  
  // Step flow: 1 = Card details, 2 = 2FA SMS OTP, 3 = Receipt success
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [otpCode, setOtpCode] = useState<string>('');
  const [simulatedOtp, setSimulatedOtp] = useState<string>('8491');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [completedDeposit, setCompletedDeposit] = useState<PaymentDeposit | null>(null);

  // Deposit calculation (10% of total pre-order value)
  const totalCropValue = preOrder.quantity * preOrder.offeredPricePerUnit;
  const depositAmount = Math.round(totalCropValue * 0.10);

  const handleCardTypeSelect = (type: 'Edahabia' | 'CIB') => {
    setCardType(type);
    if (type === 'Edahabia') {
      setCardNumber('5030 4589 1234 7741');
    } else {
      setCardNumber('6280 2190 8821 4192');
    }
  };

  const handleProceedToOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setStep(2);
    }, 800);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      const depositRecord: PaymentDeposit = {
        id: `dep-${Date.now()}`,
        preOrderId: preOrder.id,
        cropTitle: preOrder.cropTitle,
        amountDzd: depositAmount,
        depositPercentage: 10,
        cardType,
        cardNumberMasked: cardNumber.substring(0, 4) + ' •••• •••• ' + cardNumber.substring(cardNumber.length - 4),
        holderName: cardHolder,
        status: 'مضمون في حساب الضمان (Escrow)',
        transactionDate: new Date().toISOString().replace('T', ' ').substring(0, 16),
        authCode: `${cardType.toUpperCase()}-AUTH-${Math.floor(10000 + Math.random() * 90000)}`,
        satimRef: `SATIM-DZ-${Math.floor(100000 + Math.random() * 900000)}`
      };

      setCompletedDeposit(depositRecord);
      onPaymentSuccess(depositRecord);
      setStep(3);
    }, 1200);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="payment-modal-title"
      aria-describedby="payment-modal-description"
    >
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-stone-200">
        {/* Modal Top Header with SATIM & GIE Monétique compliance branding */}
        <div className="bg-gradient-to-r from-emerald-900 to-stone-900 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-700/60 rounded-2xl border border-emerald-500/40" aria-hidden="true">
              <Lock className="w-6 h-6 text-emerald-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 id="payment-modal-title" className="font-extrabold text-base sm:text-lg">
                  بوابة الدفع الإلكتروني وتأكيد العربون
                </h3>
                <span className="bg-emerald-500/30 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-400/40">
                  SATIM / GIE Monétique
                </span>
              </div>
              <p id="payment-modal-description" className="text-xs text-stone-300">
                حماية العربون في حساب الضمان المشترك المشفر (Escrow Deposit)
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            {/* Screen reader audio trigger */}
            <button
              type="button"
              onClick={() => {
                const speech = `بوابة الدفع الإلكتروني وتأكيد العربون. المحصول: ${preOrder.cropTitle}. إجمالي القيمة: ${totalCropValue} دينار جزائري. قيمة العربون المطلوب إيداعه في حساب الضمان إسكرو بنسبة 10 بالمائة هي ${depositAmount} دينار جزائري. لا يتم تسليم العربون للفلاح إلا بعد فحص شهادة المخبر المعتمدة واستلامكم للمحصول.`;
                speakText(speech, 'تفاصيل عربون الضمان المالي');
              }}
              className="p-1.5 rounded-full bg-emerald-800/80 hover:bg-emerald-700 text-amber-300 transition"
              title="قراءة صوتية لتفاصيل العربون وحساب الضمان للمكفوفين وضعاف البصر"
              aria-label="قراءة صوتية لتفاصيل العربون وحساب الضمان للمكفوفين وضعاف البصر"
            >
              <Volume2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition"
              aria-label="إغلاق نافذة الدفع"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Escrow Mechanism Explainer Strip with screen reader live attributes */}
        <div 
          className="bg-amber-50 border-b border-amber-200/80 p-3.5 px-6 text-xs text-amber-950 flex items-start gap-2.5"
          role="note"
          aria-label="معلومات نظام الضمان المالي المشترك"
        >
          <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" aria-hidden="true" />
          <p className="leading-relaxed">
            <strong>نظام الضمان المشترك (Escrow):</strong> لا يتم تحويل العربون لحساب الفلاح إلا بعد وصول المحصول وفحص شهادة المخبر المعتمدة من قِبلكم. في حال عدم مطابقة المعايير يتم استرجاع المبلغ فورياً.
          </p>
        </div>

        {/* Step 1: Card Input & Payment Amount */}
        {step === 1 && (
          <form onSubmit={handleProceedToOtp} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto" aria-label="نموذج تفاصيل بطاقة الدفع وإيداع العربون">
            {/* Calculation summary */}
            <div 
              className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2 text-xs"
              role="region"
              aria-label="ملخص الحسابات المالية للعربون"
            >
              <div className="flex justify-between items-center text-stone-600">
                <span>المحصول المحجوز:</span>
                <strong className="text-stone-900">{preOrder.cropTitle}</strong>
              </div>
              <div className="flex justify-between items-center text-stone-600">
                <span>إجمالي قيمة الطلبية التعاقدية:</span>
                <span className="font-mono font-bold text-stone-800" aria-label={`${totalCropValue} دينار جزائري`}>
                  {totalCropValue.toLocaleString()} دج
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-stone-200 font-extrabold text-sm">
                <span className="text-emerald-900">قيمة العربون المالي لضمان الجدية (10%):</span>
                <span className="text-emerald-800 font-mono text-base" aria-label={`قيمة العربون المودع في حساب الضمان ${depositAmount} دينار جزائري`}>
                  {depositAmount.toLocaleString()} دج
                </span>
              </div>
            </div>

            {/* Select Card Type: Edahabia or CIB */}
            <fieldset>
              <legend className="block text-xs font-bold text-stone-700 mb-2">
                اختر وسيلة الدفع الإلكتروني الوطنية:
              </legend>
              <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="نوع البطاقة البنكية">
                <button
                  type="button"
                  role="radio"
                  aria-checked={cardType === 'Edahabia'}
                  onClick={() => handleCardTypeSelect('Edahabia')}
                  className={`p-3 rounded-2xl border text-right transition flex items-center justify-between ${
                    cardType === 'Edahabia'
                      ? 'border-amber-500 bg-amber-50/60 shadow-xs ring-2 ring-amber-400/30'
                      : 'border-stone-200 bg-white hover:bg-stone-50'
                  }`}
                  aria-label="البطاقة الذهبية بريد الجزائر"
                >
                  <div>
                    <strong className="text-xs font-extrabold text-amber-950 block">البطاقة الذهبية</strong>
                    <span className="text-[10px] text-amber-800">بريد الجزائر (Algérie Poste)</span>
                  </div>
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-stone-950 font-black text-xs shadow-xs" aria-hidden="true">
                    EP
                  </div>
                </button>

                <button
                  type="button"
                  role="radio"
                  aria-checked={cardType === 'CIB'}
                  onClick={() => handleCardTypeSelect('CIB')}
                  className={`p-3 rounded-2xl border text-right transition flex items-center justify-between ${
                    cardType === 'CIB'
                      ? 'border-blue-600 bg-blue-50/60 shadow-xs ring-2 ring-blue-500/30'
                      : 'border-stone-200 bg-white hover:bg-stone-50'
                  }`}
                  aria-label="بطاقة CIB البنكية شبكة ساتيم"
                >
                  <div>
                    <strong className="text-xs font-extrabold text-blue-950 block">بطاقة CIB البنكية</strong>
                    <span className="text-[10px] text-blue-800">شبكة البنوك الجزائرية (SATIM)</span>
                  </div>
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-700 to-blue-500 flex items-center justify-center text-white font-black text-xs shadow-xs" aria-hidden="true">
                    CIB
                  </div>
                </button>
              </div>
            </fieldset>

            {/* Card Simulation Visual Preview */}
            <div className={`rounded-2xl p-4 text-white shadow-md relative overflow-hidden transition-all ${
              cardType === 'Edahabia'
                ? 'bg-gradient-to-br from-amber-700 via-amber-800 to-amber-950'
                : 'bg-gradient-to-br from-blue-900 via-blue-950 to-slate-900'
            }`}>
              <div className="flex items-center justify-between text-xs font-bold text-amber-200">
                <span>{cardType === 'Edahabia' ? 'البطاقة الذهبية EDAHABIA' : 'CARTE BANCAIRE CIB'}</span>
                <span className="font-mono text-[10px] opacity-80">SATIM-SECURE</span>
              </div>
              <div className="my-3 font-mono text-sm tracking-widest font-black">
                {cardNumber || '•••• •••• •••• ••••'}
              </div>
              <div className="flex justify-between items-end text-[11px]">
                <div>
                  <span className="text-[9px] text-stone-300 block">صاحب البطاقة:</span>
                  <span className="font-bold">{cardHolder}</span>
                </div>
                <div className="text-left font-mono">
                  <span className="text-[9px] text-stone-300 block">الصلاحية:</span>
                  <span>{expiryMonth}/{expiryYear}</span>
                </div>
              </div>
            </div>

            {/* Inputs */}
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  رقم البطاقة (16 رقماً):
                </label>
                <input
                  type="text"
                  required
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 font-mono text-xs font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  الاسم واللقب المسجل على البطاقة:
                </label>
                <input
                  type="text"
                  required
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    تاريخ انتهاء الصلاحية:
                  </label>
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      maxLength={2}
                      value={expiryMonth}
                      onChange={(e) => setExpiryMonth(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 font-mono text-center text-xs font-bold text-stone-900"
                      placeholder="MM"
                    />
                    <span className="text-stone-400">/</span>
                    <input
                      type="text"
                      maxLength={2}
                      value={expiryYear}
                      onChange={(e) => setExpiryYear(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 font-mono text-center text-xs font-bold text-stone-900"
                      placeholder="YY"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    رمز الأمان CVV2 (خلف البطاقة):
                  </label>
                  <input
                    type="password"
                    maxLength={3}
                    required
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 font-mono text-center text-xs font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="•••"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-black shadow-md transition flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <span>جاري الاتصال بنظام SATIM...</span>
                ) : (
                  <>
                    <span>متابعة وتأكيد إيداع العربون ({depositAmount.toLocaleString()} دج)</span>
                    <ArrowRight className="w-4 h-4 rotate-180" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Step 2: 2FA SMS OTP Simulation */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="p-6 space-y-4">
            <div className="w-12 h-12 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center mx-auto">
              <Smartphone className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h4 className="font-extrabold text-sm text-stone-900">
                تأكيد العملية عبر رسالة نصية قصيرة (SMS OTP)
              </h4>
              <p className="text-xs text-stone-500">
                تم إرسال رمز الأمان المكون من 4 أرقام من {cardType === 'Edahabia' ? 'بريد الجزائر' : 'مركزية SATIM'} إلى هاتفك المسجل.
              </p>
            </div>

            {/* Quick Demo Code helper */}
            <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl text-center text-xs text-emerald-900">
              <span>رمز المحاكاة للتجربة الفورية: </span>
              <strong className="font-mono text-sm underline">{simulatedOtp}</strong>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1 text-center">
                أدخل رمز التأكيد:
              </label>
              <input
                type="text"
                maxLength={4}
                required
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                placeholder="8491"
                className="w-40 mx-auto block bg-stone-50 border-2 border-emerald-600 rounded-xl px-3 py-2.5 font-mono text-center text-lg font-black tracking-widest text-stone-900 focus:outline-none"
              />
            </div>

            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold"
              >
                تعديل البيانات
              </button>
              <button
                type="submit"
                disabled={isProcessing}
                className="flex-2 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-black shadow-md flex items-center justify-center gap-1.5"
              >
                {isProcessing ? 'جاري التحقق...' : 'تأكيد الخصم والإيداع في الضمان'}
              </button>
            </div>
          </form>
        )}

        {/* Step 3: Receipt & Success */}
        {step === 3 && completedDeposit && (
          <div className="p-6 space-y-4 text-center">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h4 className="text-base font-black text-stone-900">
                تم تأكيد إيداع العربون في حساب الضمان المشترك بنجاح!
              </h4>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                تم إشعار الفلاح بحجز المحصول وتأكيد جدية الطلبية. يتم الاحتفاظ بالمبلغ آمناً حتى اكتمال التسليم والفحص المخبري.
              </p>
            </div>

            {/* Official SATIM electronic receipt */}
            <div 
              className="bg-stone-50 border border-stone-200 rounded-2xl p-4 text-right text-xs space-y-2"
              role="region"
              aria-label="الوصل الإلكتروني الرسمي الموثق لعملية إيداع الضمان"
            >
              <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                <span className="font-extrabold text-stone-900">وصل إلكتروني رسمي SATIM / GIE</span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      const speech = `تم تأكيد إيداع العربون في حساب الضمان المشترك بنجاح. المبلغ المقتطع هو ${completedDeposit.amountDzd} دينار جزائري عبر ${completedDeposit.cardType}. رمز الترخيص البنكي هو ${completedDeposit.authCode}. المرجع الوطني ساتيم هو ${completedDeposit.satimRef}. تاريخ المعاملة هو ${completedDeposit.transactionDate}. المبلغ محفوظ ومضمون في حساب الضمان إسكرو حتى تسليم المحصول واعتماد فحص المخبر.`;
                      speakText(speech, 'تفاصيل وصل إيداع الضمان');
                    }}
                    className="p-1 rounded-md bg-emerald-100 hover:bg-emerald-200 text-emerald-900 transition flex items-center gap-1 text-[10px] font-bold"
                    title="الاستماع لتفاصيل الوصل البنكي بصوت مسموع"
                    aria-label="الاستماع لتفاصيل الوصل البنكي بصوت مسموع"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-emerald-700" />
                    <span>قراءة الوصل</span>
                  </button>
                  <span className="text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded text-[10px]">
                    مضمون (Escrow)
                  </span>
                </div>
              </div>

              <div className="space-y-1 text-stone-600">
                <div className="flex justify-between">
                  <span>المبلغ المقتطع:</span>
                  <strong className="text-stone-900 font-mono" aria-label={`المبلغ ${completedDeposit.amountDzd} دينار جزائري`}>{completedDeposit.amountDzd.toLocaleString()} دج</strong>
                </div>
                <div className="flex justify-between">
                  <span>نوع البطاقة:</span>
                  <strong className="text-stone-800">{completedDeposit.cardType} ({completedDeposit.cardNumberMasked})</strong>
                </div>
                <div className="flex justify-between">
                  <span>رمز الترخيص البنكي:</span>
                  <strong className="text-emerald-800 font-mono">{completedDeposit.authCode}</strong>
                </div>
                <div className="flex justify-between">
                  <span>المرجع الوطني:</span>
                  <span className="font-mono text-stone-500">{completedDeposit.satimRef}</span>
                </div>
                <div className="flex justify-between">
                  <span>تاريخ المعاملة:</span>
                  <span className="font-mono text-stone-500">{completedDeposit.transactionDate}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-stone-200 flex items-center justify-between">
                <span className="text-[10px] text-stone-400">منظومة Fllah.dz لحماية المعاملات الزراعية</span>
                <QrCode className="w-7 h-7 text-stone-800" />
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2">
              <button
                onClick={() => alert('تم تنزيل الوصل البنكي بصيغة PDF')}
                className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>تنزيل الوصل PDF</span>
              </button>

              <button
                onClick={onClose}
                className="flex-1 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition"
              >
                إغلاق والعودة للسوق
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
