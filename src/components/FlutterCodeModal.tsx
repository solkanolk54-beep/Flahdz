import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  Smartphone, 
  Code2, 
  Layers, 
  Database, 
  ShieldCheck, 
  ExternalLink,
  MapPin,
  Sparkles,
  Volume2
} from 'lucide-react';
import { useAccessibility } from '../context/AccessibilityContext';

interface FlutterCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FlutterCodeModal: React.FC<FlutterCodeModalProps> = ({ isOpen, onClose }) => {
  const { speakText } = useAccessibility();
  const [copiedTab, setCopiedTab] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'ui' | 'gis' | 'escrow'>('ui');

  if (!isOpen) return null;

  const handleCopy = (code: string, tabKey: string) => {
    navigator.clipboard.writeText(code);
    setCopiedTab(tabKey);
    setTimeout(() => setCopiedTab(null), 2500);
  };

  const flutterUiCode = `// lib/screens/category_grid_home_screen.dart
// منصة فلاّح تيك (Fllah.dz) - تطبيق الهاتف النقال Flutter
// شبكة التصنيفات البصرية المرتبطة بنظام GIS وخدمات التتبع والدفع المشفر

import 'package:flutter/material.dart';

class CategoryGridHomeScreen extends StatefulWidget {
  const CategoryGridHomeScreen({Key? key}) : super(key: key);

  @override
  State<CategoryGridHomeScreen> createState() => _CategoryGridHomeScreenState();
}

class _CategoryGridHomeScreenState extends State<CategoryGridHomeScreen> {
  int _selectedIndex = 0;
  String _selectedWilaya = 'الكل';
  bool _radius50kmActive = false;
  bool _inraaOnlyActive = false;
  bool _escrowOnlyActive = false;
  String? _activeCategory;

  // قائمة التصنيفات الفلاحية المدعومة مع العدادات الذكية الفورية (Smart Badges)
  final List<Map<String, dynamic>> categories = [
    {
      "id": "veg",
      "title": "الخضر",
      "icon": "🥦",
      "count": "120 مزرعة",
      "badgeColor": 0xFF198754,
      "tag": "طماطم، بطاطا، ثوم"
    },
    {
      "id": "fruit",
      "title": "الفواكه",
      "icon": "🍎",
      "count": "85 بستان",
      "badgeColor": 0xFFDC3545,
      "tag": "حمضيات، تمور، تين"
    },
    {
      "id": "livestock",
      "title": "المواشي",
      "icon": "🐑",
      "count": "45 عرض",
      "badgeColor": 0xFF856404,
      "tag": "أولاد جلال، مراعي حرة"
    },
    {
      "id": "poultry",
      "title": "الدواجن",
      "icon": "🐔",
      "count": "32 مزرعة",
      "badgeColor": 0xFFFD7E14,
      "tag": "دجاج عرب بلدي طليق"
    },
    {
      "id": "eggs",
      "title": "البيض",
      "icon": "🥚",
      "count": "28 منتج",
      "badgeColor": 0xFFFFC107,
      "tag": "بيض بلدي مخصب طازج"
    },
    {
      "id": "rabbits",
      "title": "الأرانب",
      "icon": "🐇",
      "count": "14 مربي",
      "badgeColor": 0xFF6F42C1,
      "tag": "أرانب مهجنة عالية الخصوبة"
    },
    {
      "id": "seeds",
      "title": "البذور",
      "icon": "🌾",
      "count": "36 مخزن",
      "badgeColor": 0xFF20C997,
      "tag": "قمح صلب سيميتو R1"
    },
    {
      "id": "nurseries",
      "title": "المشاتل المعتمدة",
      "icon": "🪴",
      "count": "18 مشتلة",
      "badgeColor": 0xFF0D6EFD,
      "tag": "شتلات سيغواز وشملال نقية"
    },
    {
      "id": "equipment",
      "title": "المعدات الفلاحية",
      "icon": "🚜",
      "count": "24 عتاد",
      "badgeColor": 0xFF6610F2,
      "tag": "جرارات سيرتا، صهاريج، طاقة"
    },
    {
      "id": "wilaya",
      "title": "حسب الولاية",
      "icon": "📍",
      "count": "58 ولاية",
      "badgeColor": 0xFF0DCAF0,
      "tag": "ميلة، بسكرة، البليدة.."
    },
    {
      "id": "others",
      "title": "منتجات أخرى",
      "icon": "🧺",
      "count": "19 عرض",
      "badgeColor": 0xFF6C757D,
      "tag": "عسل سدر، مربى، أعلاف"
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAF9),
      appBar: AppBar(
        title: const Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.eco, color: Color(0xFF85E3B3)),
            SizedBox(width: 8),
            Text(
              'فلاّح تيك • Fllah.dz',
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
            ),
          ],
        ),
        backgroundColor: const Color(0xFF1B4D3E),
        centerTitle: true,
        elevation: 2,
        actions: [
          IconButton(
            icon: const Icon(Icons.volume_up, color: Colors.amber),
            tooltip: 'القارئ الصوتي العربي',
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('القارئ الصوتي باللغة العربية والدارجة مفعّل')),
              );
            },
          ),
        ],
      ),
      body: Directionality(
        textDirection: TextDirection.rtl,
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // 1. أزرار الحركة السريعة العلويّة (الخرائط / عرض المنتجات)
              Row(
                children: [
                  Expanded(
                    child: _buildBannerCard(
                      title: 'استكشف المزارع على الخريطة',
                      subtitle: 'مسح جغرافي GIS لكل الولايات',
                      color: const Color(0xFF0D6EFD),
                      icon: Icons.map,
                      onTap: () {
                        // الانتقال لشاشة الخريطة التفاعلية
                      },
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: _buildBannerCard(
                      title: 'عرض منتجات مزرعتك',
                      subtitle: 'سجّل الآن وبع المباشر',
                      color: const Color(0xFF198754),
                      icon: Icons.storefront,
                      onTap: () {
                        // إضافة منتج جديد للفلاح
                      },
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),

              // 2. خط أنابيب الفلترة الجغرافية السريعة (GIS Quick Filter Bar)
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: Colors.grey.shade200),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'الفلترة الجغرافية السريعة والتحقق المخبري (GIS & QA)',
                      style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFF1B4D3E)),
                    ),
                    const SizedBox(height: 8),
                    Wrap(
                      spacing: 8,
                      runSpacing: 8,
                      children: [
                        FilterChip(
                          selected: _radius50kmActive,
                          label: const Text('شعاع 50 كم من موقعك'),
                          avatar: const Icon(Icons.near_me, size: 16),
                          selectedColor: const Color(0xFFD1E7DD),
                          onSelected: (val) => setState(() => _radius50kmActive = val),
                        ),
                        FilterChip(
                          selected: _inraaOnlyActive,
                          label: const Text('شارة مخبر INRAA'),
                          avatar: const Icon(Icons.verified, size: 16),
                          selectedColor: const Color(0xFFD1E7DD),
                          onSelected: (val) => setState(() => _inraaOnlyActive = val),
                        ),
                        FilterChip(
                          selected: _escrowOnlyActive,
                          label: const Text('عربون مضمون (Escrow)'),
                          avatar: const Icon(Icons.lock, size: 16),
                          selectedColor: const Color(0xFFFFF3CD),
                          onSelected: (val) => setState(() => _escrowOnlyActive = val),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),

              // 3. شبكة التصنيفات البصرية مع العدادات الذكية (Category Grid)
              const Text(
                'التصنيفات الفلاحية والخدمات التقنية المعتمدة',
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
              ),
              const SizedBox(height: 10),

              GridView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 3,
                  crossAxisSpacing: 10,
                  mainAxisSpacing: 10,
                  childAspectRatio: 0.88,
                ),
                itemCount: categories.length,
                itemBuilder: (context, index) {
                  final cat = categories[index];
                  final isSelected = _activeCategory == cat["id"];
                  return Card(
                    elevation: isSelected ? 4 : 1,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16),
                      side: BorderSide(
                        color: isSelected ? const Color(0xFF1B4D3E) : Colors.grey.shade200,
                        width: isSelected ? 2 : 1,
                      ),
                    ),
                    child: InkWell(
                      borderRadius: BorderRadius.circular(16),
                      onTap: () {
                        setState(() {
                          _activeCategory = isSelected ? null : cat["id"];
                        });
                      },
                      child: Padding(
                        padding: const EdgeInsets.all(8.0),
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text(cat["icon"]!, style: const TextStyle(fontSize: 28)),
                            const SizedBox(height: 4),
                            Text(
                              cat["title"]!,
                              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12),
                              textAlign: TextAlign.center,
                            ),
                            const SizedBox(height: 4),
                            // العداد الذكي المعتمد (Smart Badge)
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                              decoration: BoxDecoration(
                                color: Color(cat["badgeColor"]).withOpacity(0.12),
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: Text(
                                cat["count"],
                                style: TextStyle(
                                  fontSize: 9,
                                  fontWeight: FontWeight.bold,
                                  color: Color(cat["badgeColor"]),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  );
                },
              ),
            ],
          ),
        ),
      ),

      // 4. شريط الملاحة السفلي (Bottom Navigation Bar)
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _selectedIndex,
        onTap: (index) => setState(() => _selectedIndex = index),
        type: BottomNavigationBarType.fixed,
        selectedItemColor: const Color(0xFF1B4D3E),
        unselectedItemColor: Colors.grey,
        selectedLabelStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 11),
        unselectedLabelStyle: const TextStyle(fontSize: 10),
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.home), label: 'الرئيسية'),
          BottomNavigationBarItem(icon: Icon(Icons.shopping_basket), label: 'السوق'),
          BottomNavigationBarItem(
            icon: CircleAvatar(
              backgroundColor: Color(0xFF1B4D3E),
              radius: 18,
              child: Icon(Icons.add, color: Colors.white, size: 20),
            ),
            label: 'أضف منتوج',
          ),
          BottomNavigationBarItem(icon: Icon(Icons.assignment), label: 'طلبات الشراء'),
          BottomNavigationBarItem(icon: Icon(Icons.person), label: 'حسابي'),
        ],
      ),
    );
  }

  Widget _buildBannerCard({
    required String title,
    required String subtitle,
    required Color color,
    required IconData icon,
    required VoidCallback onTap,
  }) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: color,
        borderRadius: BorderRadius.circular(14),
        boxShadow: [
          BoxShadow(
            color: color.withOpacity(0.25),
            blurRadius: 8,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: InkWell(
        onTap: onTap,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Icon(icon, color: Colors.white, size: 26),
            const SizedBox(height: 6),
            Text(title, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 12)),
            const SizedBox(height: 2),
            Text(subtitle, style: const TextStyle(color: Colors.white70, fontSize: 9)),
          ],
        ),
      ),
    );
  }
}
`;

  const flutterGisCode = `// lib/services/gis_spatial_service.dart
// استعلامات النطاق الجغرافي PostGIS (EPSG:4326) وحساب المسافات الدقيقة

import 'dart:convert';
import 'package:http/http.dart' as http;

class GisSpatialService {
  static const String baseUrl = 'https://api.fllah.dz/v1';

  /// استعلام شعاع 50 كم باستخدام ST_DWithin على خادم PostGIS
  static Future<List<Map<String, dynamic>>> queryRadius50Km({
    required double userLat,
    required double userLng,
    String? categoryFilter,
    bool requireInraa = false,
  }) async {
    final uri = Uri.parse('$baseUrl/gis/radius-query').replace(
      queryParameters: {
        'lat': userLat.toString(),
        'lng': userLng.toString(),
        'radius_km': '50',
        'srid': '4326',
        if (categoryFilter != null) 'category': categoryFilter,
        'require_inraa': requireInraa.toString(),
      },
    );

    final response = await http.get(uri);
    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      return List<Map<String, dynamic>>.from(data['results']);
    } else {
      throw Exception('فشل استعلام النطاق الجغرافي: \${response.statusCode}');
    }
  }

  /// حساب المسافة الكيلومترية المباشرة (Haversine Formula) في وضع عدم الاتصال (Offline)
  static double calculateDistanceKm(double lat1, double lon1, double lat2, double lon2) {
    const double p = 0.017453292519943295; // Math.PI / 180
    final a = 0.5 -
        Math.cos((lat2 - lat1) * p) / 2 +
        Math.cos(lat1 * p) * Math.cos(lat2 * p) * (1 - Math.cos((lon2 - lon1) * p)) / 2;
    return 12742 * Math.asin(Math.sqrt(a)); // 2 * R * asin
  }
}
`;

  const flutterEscrowCode = `// lib/blocs/escrow_satim_bloc.dart
// دورة حياة الضمان المالي المشفر (Escrow) عبر SATIM / Edahabia / CIB

class EscrowSatimBloc {
  /// بدء عملية إيداع العربون (10% - 15%)
  Future<Map<String, dynamic>> initiateEscrowDeposit({
    required String preOrderId,
    required double depositAmountDzd,
    required String cardType, // 'Edahabia' or 'CIB'
  }) async {
    // 1. طلب رمز المصادقة من خادم SATIM الوطني
    // 2. حجز المبلغ في حالة HELD_IN_ESCROW
    // 3. إصدار وصل الدفع الإلكتروني المعتمد
    return {
      'escrow_id': 'ESC-SATIM-\${DateTime.now().millisecondsSinceEpoch}',
      'status': 'HELD_IN_ESCROW',
      'amount_dzd': depositAmountDzd,
      'release_conditions': [
        'تقرير مخبر INRAA يثبت نسبة حموضة <= 0.8%',
        'فحص مسح QR Code وتأكيد المشتري للاستلام الفعلي'
      ]
    };
  }
}
`;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-xs animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="flutter-modal-title"
    >
      <div className="bg-stone-900 rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl border border-stone-700 text-stone-100">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-900 to-stone-950 border-b border-stone-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-600/30 text-emerald-300 rounded-2xl border border-emerald-500/40">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 id="flutter-modal-title" className="text-base sm:text-lg font-black text-white">
                  كود Flutter المصدري للهاتف النقال (Fllah.dz Mobile SDK)
                </h3>
                <span className="bg-blue-900/60 text-blue-300 border border-blue-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Flutter 3.x • Dart
                </span>
              </div>
              <p className="text-xs text-stone-300">
                شبكة التصنيفات البصرية • استعلامات PostGIS • الضمان المالي Escrow • الملاحة السفلية
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                const speech = `كود فلاتر المصدري لتطبيق الهاتف النقال فلاّح تيك. يدمج شبكة التصنيفات البصرية الإحدى عشرة، العدادات الذكية الفورية، فلترة شعاع خمسين كيلومتر عبر بوست جيس، وربط العربون المالي المشفر بشبكة ساتيم والبطاقة الذهبية.`;
                speakText(speech, 'كود فلاتر لتطبيق الهاتف');
              }}
              className="p-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-300 transition"
              title="الاستماع لشرح كود فلاتر"
              aria-label="الاستماع لشرح كود فلاتر"
            >
              <Volume2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-stone-800 text-stone-400 hover:text-white transition"
              aria-label="إغلاق النافذة"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center justify-between border-b border-stone-800 bg-stone-950 px-4 py-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('ui')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                activeTab === 'ui'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-stone-400 hover:text-white hover:bg-stone-800'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>واجهة شبكة التصنيفات (UI)</span>
            </button>
            <button
              onClick={() => setActiveTab('gis')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                activeTab === 'gis'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-stone-400 hover:text-white hover:bg-stone-800'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>استعلامات PostGIS (50km)</span>
            </button>
            <button
              onClick={() => setActiveTab('escrow')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                activeTab === 'escrow'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-stone-400 hover:text-white hover:bg-stone-800'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>حساب الضمان Escrow BlOC</span>
            </button>
          </div>

          <button
            onClick={() => handleCopy(
              activeTab === 'ui' ? flutterUiCode : activeTab === 'gis' ? flutterGisCode : flutterEscrowCode,
              activeTab
            )}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-emerald-400 rounded-xl text-xs font-bold transition border border-stone-700"
          >
            {copiedTab === activeTab ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedTab === activeTab ? 'تم النسخ بنجاح ✓' : 'نسخ كود الملف'}</span>
          </button>
        </div>

        {/* Code Content */}
        <div className="flex-1 overflow-y-auto p-4 bg-stone-950 font-mono text-xs text-stone-200">
          <pre className="whitespace-pre overflow-x-auto leading-relaxed selection:bg-emerald-600 selection:text-white">
            {activeTab === 'ui' && flutterUiCode}
            {activeTab === 'gis' && flutterGisCode}
            {activeTab === 'escrow' && flutterEscrowCode}
          </pre>
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 bg-stone-900 border-t border-stone-800 flex flex-wrap items-center justify-between gap-3 text-xs text-stone-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>جاهز للإدماج المباشر في مشروع Flutter عبر مجلد <code className="text-emerald-300">lib/screens/</code></span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl font-bold transition"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
