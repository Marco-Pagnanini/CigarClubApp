-- ============================================================
-- SEED DATA — catalog_db
-- Brand famosi, Panels (sigari), Tobacconists (tabacchi sfusi), Barcodes
-- ============================================================

-- BRANDS
INSERT INTO "Brands" (id, "Name", "Country", "LogoUrl") VALUES
  ('a1000000-0000-0000-0000-000000000001', 'Cohiba',           'Cuba',              'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Cohiba_logo.svg/320px-Cohiba_logo.svg.png'),
  ('a1000000-0000-0000-0000-000000000002', 'Montecristo',      'Cuba',              'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Montecristo_cigars_logo.svg/320px-Montecristo_cigars_logo.svg.png'),
  ('a1000000-0000-0000-0000-000000000003', 'Partagás',         'Cuba',              NULL),
  ('a1000000-0000-0000-0000-000000000004', 'Romeo y Julieta',  'Cuba',              NULL),
  ('a1000000-0000-0000-0000-000000000005', 'Arturo Fuente',    'Repubblica Dominicana', NULL)
ON CONFLICT DO NOTHING;

-- PANELS (sigari)
-- Strength: 1=Mild 2=Medium-Mild 3=Medium 4=Medium-Full 5=Full
-- WrapperColor: 1=Claro 2=ColoradoClaro 3=Colorado 4=ColoradoMaduro 5=Maduro
-- Type: 1=HandMade 2=MachineMade
-- RollingType: "Handrolled" | "MachineRolled"

INSERT INTO "Panels" (id, "Name", "TobacconistCode", "BrandId", "Description", "Origin", "Strength", "Wrapper", "WrapperColor", "Binder", "Filler", "MasterLine", "RollingType", "Shape", "Price", "Rating", "NumberInBox", "Ring", "SmokingTime", "Type", "TobacconistId", "ImageUrl") VALUES

-- Cohiba
('b1000000-0000-0000-0000-000000000001', 'Cohiba Siglo I',    'COH-SI1', 'a1000000-0000-0000-0000-000000000001',
 'Sigaro corto e delicato, ideale per i fumatori principianti. Note di legno e nocciola.',
 'Cuba', 2, 'Ecuador Connecticut', 2, 'Nicaragua', 'Cuba', 'Linea Siglo', 'Handrolled', 'Petit Corona',
 14.50, 8.7, 25, 42, 30, 1, NULL, NULL),

('b1000000-0000-0000-0000-000000000002', 'Cohiba Siglo II',   'COH-SI2', 'a1000000-0000-0000-0000-000000000001',
 'Equilibrato e raffinato, con note di caffè e spezie dolci.',
 'Cuba', 3, 'Ecuador Connecticut', 2, 'Nicaragua', 'Cuba', 'Linea Siglo', 'Handrolled', 'Corona',
 18.00, 9.0, 25, 42, 45, 1, NULL, NULL),

('b1000000-0000-0000-0000-000000000003', 'Cohiba Behike 52',  'COH-BH52', 'a1000000-0000-0000-0000-000000000001',
 'Tra i sigari più pregiati al mondo. Foglia Medio Tiempo unica al mondo. Note di cedro, cuoio e cacao.',
 'Cuba', 4, 'Cuba', 4, 'Cuba', 'Cuba', 'Linea Behike', 'Handrolled', 'Robusto',
 58.00, 9.8, 10, 52, 60, 1, NULL, NULL),

('b1000000-0000-0000-0000-000000000004', 'Cohiba Robustos',   'COH-ROB', 'a1000000-0000-0000-0000-000000000001',
 'Corpo medio-pieno, con note di cioccolato fondente e pepe bianco.',
 'Cuba', 4, 'Cuba Colorado', 4, 'Cuba', 'Cuba', 'Linea Clasica', 'Handrolled', 'Robusto',
 28.00, 9.3, 25, 50, 55, 1, NULL, NULL),

('b1000000-0000-0000-0000-000000000005', 'Cohiba Esplendidos', 'COH-ESP', 'a1000000-0000-0000-0000-000000000001',
 'Churchill di grande eleganza. Lungo e complesso, con finale persistente.',
 'Cuba', 4, 'Cuba Colorado', 4, 'Cuba', 'Cuba', 'Linea Clasica', 'Handrolled', 'Churchill',
 36.00, 9.5, 25, 47, 90, 1, NULL, NULL),

-- Montecristo
('b1000000-0000-0000-0000-000000000006', 'Montecristo No.2',  'MON-N2', 'a1000000-0000-0000-0000-000000000002',
 'Il torpedo cubano per eccellenza. Intenso e bilanciato, note di cacao, spezie e legno.',
 'Cuba', 4, 'Cuba Colorado', 4, 'Cuba', 'Cuba', 'Linea Clasica', 'Handrolled', 'Torpedo',
 24.00, 9.6, 25, 52, 60, 1, NULL, NULL),

('b1000000-0000-0000-0000-000000000007', 'Montecristo No.4',  'MON-N4', 'a1000000-0000-0000-0000-000000000002',
 'Il sigaro cubano più venduto al mondo. Equilibrato, cremoso, con note di miele e spezie.',
 'Cuba', 3, 'Cuba Colorado Claro', 3, 'Cuba', 'Cuba', 'Linea Clasica', 'Handrolled', 'Petit Corona',
 16.00, 9.2, 25, 42, 40, 1, NULL, NULL),

('b1000000-0000-0000-0000-000000000008', 'Montecristo Edmundo', 'MON-EDM', 'a1000000-0000-0000-0000-000000000002',
 'Vitola moderna e robusta. Note di noce moscata, caffè e cuoio.',
 'Cuba', 4, 'Cuba Colorado', 4, 'Cuba', 'Cuba', 'Linea Edmundo', 'Handrolled', 'Robusto Extra',
 22.00, 9.1, 25, 52, 50, 1, NULL, NULL),

-- Partagás
('b1000000-0000-0000-0000-000000000009', 'Partagás Serie D No.4', 'PAR-D4', 'a1000000-0000-0000-0000-000000000003',
 'Robusto intenso e corposo, con note di terra, pepe e cuoio.',
 'Cuba', 5, 'Cuba Colorado Maduro', 5, 'Cuba', 'Cuba', 'Serie D', 'Handrolled', 'Robusto',
 20.00, 9.4, 25, 50, 50, 1, NULL, NULL),

('b1000000-0000-0000-0000-000000000010', 'Partagás 8-9-8',    'PAR-898', 'a1000000-0000-0000-0000-000000000003',
 'Confezionato in scatola di legno con 8 sigari. Leggendario per complessità e persistenza.',
 'Cuba', 5, 'Cuba Maduro', 5, 'Cuba', 'Cuba', 'Linea Clasica', 'Handrolled', 'Churchill',
 32.00, 9.5, 8, 47, 90, 1, NULL, NULL),

-- Romeo y Julieta
('b1000000-0000-0000-0000-000000000011', 'Romeo y Julieta Churchill', 'ROM-CHU', 'a1000000-0000-0000-0000-000000000004',
 'Il Churchill originale. Cremoso ed elegante, con note di vaniglia e noce.',
 'Cuba', 3, 'Cuba Colorado Claro', 3, 'Cuba', 'Cuba', 'Linea Clasica', 'Handrolled', 'Churchill',
 26.00, 9.0, 25, 47, 90, 1, NULL, NULL),

('b1000000-0000-0000-0000-000000000012', 'Romeo y Julieta Wide Churchill', 'ROM-WCH', 'a1000000-0000-0000-0000-000000000004',
 'Churchill extra largo con ring gauge 55. Ricco e vellutato.',
 'Cuba', 3, 'Cuba Colorado', 3, 'Cuba', 'Cuba', 'Linea Wide', 'Handrolled', 'Churchill Extra',
 30.00, 9.1, 10, 55, 100, 1, NULL, NULL),

-- Arturo Fuente
('b1000000-0000-0000-0000-000000000013', 'Fuente Fuente OpusX', 'AF-OPX', 'a1000000-0000-0000-0000-000000000005',
 'Uno dei sigari più rari e ricercati. Wrapper dominicano unico al mondo. Note di moka, spezie e cedro.',
 'Repubblica Dominicana', 5, 'Dominican Colorado Maduro', 5, 'Dominican', 'Dominican', 'OpusX', 'Handrolled', 'Perfection No.2',
 55.00, 9.9, 20, 52, 70, 1, NULL, NULL),

('b1000000-0000-0000-0000-000000000014', 'Arturo Fuente Hemingway', 'AF-HEM', 'a1000000-0000-0000-0000-000000000005',
 'Formato Perfecto ispirato a Hemingway. Dolce e cremoso, con note di caffè e cacao.',
 'Repubblica Dominicana', 3, 'Cameroon', 3, 'Dominican', 'Dominican', 'Hemingway', 'Handrolled', 'Perfecto',
 22.00, 9.2, 25, 48, 55, 1, NULL, NULL),

('b1000000-0000-0000-0000-000000000015', 'Arturo Fuente Don Carlos Eye of the Shark', 'AF-DON', 'a1000000-0000-0000-0000-000000000005',
 'Torpedo esclusivo dalla collezione Don Carlos. Intenso e complesso.',
 'Repubblica Dominicana', 4, 'Dominican Colorado', 4, 'Dominican', 'Dominican', 'Don Carlos', 'Handrolled', 'Torpedo',
 38.00, 9.6, 20, 52, 65, 1, NULL, NULL)

ON CONFLICT DO NOTHING;

-- TOBACCONISTS (tabacchi sfusi venduti a peso)
INSERT INTO "Tobacconists" ("Id", "Code", "Category", "Description", "PriceKg", "StackPrice", "StackType", "CurrentPricingValidity", "NextPrice", "NextStackPrice", "NextPricingValidity", "PanelId", "BrandId") VALUES

('c1000000-0000-0000-0000-000000000001', 'TAB-CUB-VOL', 'Foglia Volante',
 'Foglia cubana di prima scelta, adatta come wrapper. Colore colorado maduro, texture vellutata.',
 180.00, 9.00, 'Mazzo da 50g',
 '2025-01-01T00:00:00Z', 195.00, 9.75, '2026-01-01T00:00:00Z',
 NULL, 'a1000000-0000-0000-0000-000000000001'),

('c1000000-0000-0000-0000-000000000002', 'TAB-NIC-CAP', 'Capote',
 'Foglia nicaraguense di fascia, spessore uniforme. Ideale per legante.',
 120.00, 6.00, 'Mazzo da 50g',
 '2025-01-01T00:00:00Z', 130.00, 6.50, '2026-01-01T00:00:00Z',
 NULL, 'a1000000-0000-0000-0000-000000000002'),

('c1000000-0000-0000-0000-000000000003', 'TAB-CAM-WRP', 'Wrapper',
 'Wrapper camerunense rinomato per la sua consistenza e aroma dolce con note di spezie.',
 250.00, 12.50, 'Mazzo da 50g',
 '2025-03-01T00:00:00Z', 265.00, 13.25, '2026-03-01T00:00:00Z',
 NULL, 'a1000000-0000-0000-0000-000000000005'),

('c1000000-0000-0000-0000-000000000004', 'TAB-BRA-MAD', 'Maduro',
 'Foglia brasiliana Arapiraca maturata 3 anni. Note di cioccolato e dolcezza intensa.',
 160.00, 8.00, 'Mazzo da 50g',
 '2025-06-01T00:00:00Z', 170.00, 8.50, '2026-06-01T00:00:00Z',
 NULL, 'a1000000-0000-0000-0000-000000000003'),

('c1000000-0000-0000-0000-000000000005', 'TAB-ECU-CON', 'Connecticut',
 'Ecuador Connecticut shade-grown. Foglia chiara e sericea, per sigari mild e cremosi.',
 210.00, 10.50, 'Mazzo da 50g',
 '2025-01-01T00:00:00Z', 220.00, 11.00, '2026-01-01T00:00:00Z',
 NULL, 'a1000000-0000-0000-0000-000000000004')

ON CONFLICT DO NOTHING;

-- BARCODES
INSERT INTO "Barcodes" ("Id", "TobacconistId", "Value") VALUES
  ('d1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', '8410024001001'),
  ('d1000000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000001', '8410024001018'),
  ('d1000000-0000-0000-0000-000000000003', 'c1000000-0000-0000-0000-000000000002', '8410024002001'),
  ('d1000000-0000-0000-0000-000000000004', 'c1000000-0000-0000-0000-000000000003', '8410024003001'),
  ('d1000000-0000-0000-0000-000000000005', 'c1000000-0000-0000-0000-000000000004', '8410024004001'),
  ('d1000000-0000-0000-0000-000000000006', 'c1000000-0000-0000-0000-000000000005', '8410024005001'),
  ('d1000000-0000-0000-0000-000000000007', 'c1000000-0000-0000-0000-000000000005', '8410024005018')
ON CONFLICT DO NOTHING;
