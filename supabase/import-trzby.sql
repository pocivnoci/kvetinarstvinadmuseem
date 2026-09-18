-- ════════════════════════════════════════════════════════════════════
--  Import denních tržeb ze sešitu (2. 6. – 18. 9. 2026)
--
--  Vloží 74 dní do tabulky takings. Dny, které už v databázi jsou,
--  nechá být — nic nepřepisuje.
--
--  Do tržby se počítají jen zaplacené položky. Řádky označené v sešitě
--  jako nezaplacené nebo nepřevzaté jsou z částky vynechané a zmíněné
--  v poznámce u dne.
--
--  Na konci se zvedne číslo revize. Bez toho by otevřená záložka adminu
--  mohla při dalším uložení tenhle import přepsat.
-- ════════════════════════════════════════════════════════════════════

begin;

insert into public.takings (id, date, cash, card, other, note) values
  ('sesit-2026-06-02', '2026-06-02', 1765, 0, 0, 'ze sešitu'),
  ('sesit-2026-06-03', '2026-06-03', 0, 1792, 0, 'ze sešitu; 1792 Kč bez uvedeného způsobu platby, vedeno jako karta'),
  ('sesit-2026-06-04', '2026-06-04', 0, 2283, 0, 'ze sešitu; ruční součet v sešitě 2287 Kč'),
  ('sesit-2026-06-05', '2026-06-05', 625, 3997, 0, 'ze sešitu'),
  ('sesit-2026-06-06', '2026-06-06', 365, 938, 0, 'ze sešitu'),
  ('sesit-2026-06-08', '2026-06-08', 0, 677, 0, 'ze sešitu'),
  ('sesit-2026-06-09', '2026-06-09', 469, 2264, 0, 'ze sešitu; ruční součet v sešitě 3129 Kč'),
  ('sesit-2026-06-10', '2026-06-10', 378, 2118, 0, 'ze sešitu'),
  ('sesit-2026-06-11', '2026-06-11', 493, 1035, 0, 'ze sešitu'),
  ('sesit-2026-06-12', '2026-06-12', 1555, 3247, 0, 'ze sešitu'),
  ('sesit-2026-06-13', '2026-06-13', 0, 1500, 0, 'ze sešitu'),
  ('sesit-2026-06-15', '2026-06-15', 199, 1265, 0, 'ze sešitu'),
  ('sesit-2026-06-16', '2026-06-16', 150, 4178, 0, 'ze sešitu; ruční součet v sešitě 4364 Kč'),
  ('sesit-2026-06-17', '2026-06-17', 1245, 2780, 0, 'ze sešitu; ruční součet v sešitě 4037 Kč'),
  ('sesit-2026-06-18', '2026-06-18', 189, 2534, 0, 'ze sešitu; nezaplaceno 199 Kč (v sešitě započteno)'),
  ('sesit-2026-06-19', '2026-06-19', 0, 5545, 0, 'ze sešitu; nezaplaceno 299 Kč (v sešitě započteno)'),
  ('sesit-2026-06-22', '2026-06-22', 500, 4432, 0, 'ze sešitu'),
  ('sesit-2026-06-23', '2026-06-23', 837, 2066, 0, 'ze sešitu'),
  ('sesit-2026-06-24', '2026-06-24', 3670, 1123, 0, 'ze sešitu'),
  ('sesit-2026-06-25', '2026-06-25', 458, 3790, 0, 'ze sešitu; nezaplaceno 299 Kč (v sešitě započteno)'),
  ('sesit-2026-06-26', '2026-06-26', 370, 2988, 2600, 'ze sešitu'),
  ('sesit-2026-06-29', '2026-06-29', 1432, 1812, 0, 'ze sešitu; nezaplaceno 299 Kč (v sešitě započteno)'),
  ('sesit-2026-06-30', '2026-06-30', 0, 1506, 0, 'ze sešitu'),
  ('sesit-2026-07-01', '2026-07-01', 489, 1311, 0, 'ze sešitu; ruční součet v sešitě 1732 Kč'),
  ('sesit-2026-07-02', '2026-07-02', 0, 3264, 0, 'ze sešitu; nezaplaceno 498 Kč (v sešitě započteno)'),
  ('sesit-2026-07-03', '2026-07-03', 819, 0, 0, 'ze sešitu'),
  ('sesit-2026-07-07', '2026-07-07', 1454, 2770, 0, 'ze sešitu; nezaplaceno 299 Kč (v sešitě započteno)'),
  ('sesit-2026-07-08', '2026-07-08', 299, 1100, 0, 'ze sešitu'),
  ('sesit-2026-07-09', '2026-07-09', 127, 2147, 0, 'ze sešitu'),
  ('sesit-2026-07-10', '2026-07-10', 49, 1107, 0, 'ze sešitu'),
  ('sesit-2026-07-13', '2026-07-13', 467, 1240, 0, 'ze sešitu'),
  ('sesit-2026-07-14', '2026-07-14', 395, 4617, 0, 'ze sešitu; nezaplaceno 299 Kč (v sešitě započteno); ruční součet v sešitě 5551 Kč'),
  ('sesit-2026-07-15', '2026-07-15', 841, 2298, 0, 'ze sešitu'),
  ('sesit-2026-07-20', '2026-07-20', 3112, 1427, 0, 'ze sešitu'),
  ('sesit-2026-07-21', '2026-07-21', 207, 1757, 0, 'ze sešitu; nezaplaceno 199 Kč (v sešitě započteno); ruční součet v sešitě 2169 Kč'),
  ('sesit-2026-07-23', '2026-07-23', 946, 1150, 0, 'ze sešitu; ruční součet v sešitě 2596 Kč'),
  ('sesit-2026-07-24', '2026-07-24', 2000, 1573, 0, 'ze sešitu'),
  ('sesit-2026-07-27', '2026-07-27', 450, 2686, 0, 'ze sešitu; nezaplaceno 448 Kč (v sešitě započteno); ruční součet v sešitě 3334 Kč'),
  ('sesit-2026-07-28', '2026-07-28', 0, 2378, 0, 'ze sešitu; nezaplaceno 299 Kč (v sešitě započteno); ruční součet v sešitě 2657 Kč'),
  ('sesit-2026-07-29', '2026-07-29', 0, 920, 0, 'ze sešitu; nezaplaceno 498 Kč (v sešitě započteno)'),
  ('sesit-2026-07-30', '2026-07-30', 1049, 1901, 0, 'ze sešitu'),
  ('sesit-2026-07-31', '2026-07-31', 0, 2045, 0, 'ze sešitu'),
  ('sesit-2026-08-03', '2026-08-03', 0, 740, 0, 'ze sešitu; nezaplaceno 697 Kč (v sešitě započteno)'),
  ('sesit-2026-08-04', '2026-08-04', 1171, 3660, 0, 'ze sešitu; ruční součet v sešitě 4837 Kč'),
  ('sesit-2026-08-05', '2026-08-05', 0, 2302, 0, 'ze sešitu; nezaplaceno 498 Kč (v sešitě započteno)'),
  ('sesit-2026-08-06', '2026-08-06', 1323, 520, 0, 'ze sešitu; nezaplaceno 498 Kč (v sešitě započteno)'),
  ('sesit-2026-08-07', '2026-08-07', 198, 2550, 0, 'ze sešitu'),
  ('sesit-2026-08-10', '2026-08-10', 633, 1685, 2400, 'ze sešitu; nezaplaceno 199 Kč (v sešitě započteno); ruční součet v sešitě 5112 Kč'),
  ('sesit-2026-08-11', '2026-08-11', 1250, 4301, 3000, 'ze sešitu; nezaplaceno 598 Kč (v sešitě započteno); ruční součet v sešitě 9129 Kč'),
  ('sesit-2026-08-12', '2026-08-12', 793, 1373, 0, 'ze sešitu; nezaplaceno 199 Kč (v sešitě započteno); ruční součet v sešitě 2464 Kč'),
  ('sesit-2026-08-13', '2026-08-13', 799, 2383, 0, 'ze sešitu; ruční součet v sešitě 3162 Kč'),
  ('sesit-2026-08-14', '2026-08-14', 185, 1890, 0, 'ze sešitu; nezaplaceno 996 Kč (v sešitě započteno)'),
  ('sesit-2026-08-17', '2026-08-17', 2183, 1394, 0, 'ze sešitu; ruční součet v sešitě 3520 Kč'),
  ('sesit-2026-08-18', '2026-08-18', 512, 1898, 0, 'ze sešitu'),
  ('sesit-2026-08-19', '2026-08-19', 545, 2896, 0, 'ze sešitu; nezaplaceno 598 Kč (v sešitě započteno); ruční součet v sešitě 4102 Kč'),
  ('sesit-2026-08-20', '2026-08-20', 1079, 1482, 0, 'ze sešitu; nezaplaceno 299 Kč (v sešitě započteno); ruční součet v sešitě 2780 Kč'),
  ('sesit-2026-08-21', '2026-08-21', 0, 3817, 0, 'ze sešitu'),
  ('sesit-2026-08-22', '2026-08-22', 189, 0, 0, 'ze sešitu'),
  ('sesit-2026-08-31', '2026-08-31', 300, 4798, 0, 'ze sešitu; nezaplaceno 500 Kč (v sešitě započteno)'),
  ('sesit-2026-09-01', '2026-09-01', 667, 1983, 0, 'ze sešitu'),
  ('sesit-2026-09-02', '2026-09-02', 1540, 6882, 0, 'ze sešitu; nezaplaceno 598 Kč (v sešitě započteno)'),
  ('sesit-2026-09-03', '2026-09-03', 1144, 5198, 0, 'ze sešitu; nezaplaceno 199 Kč (v sešitě započteno); ruční součet v sešitě 6741 Kč'),
  ('sesit-2026-09-04', '2026-09-04', 0, 9128, 0, 'ze sešitu; nezaplaceno 299 Kč (v sešitě započteno); ruční součet v sešitě 9482 Kč'),
  ('sesit-2026-09-07', '2026-09-07', 99, 1803, 0, 'ze sešitu; nezaplaceno 299 Kč (v sešitě započteno)'),
  ('sesit-2026-09-08', '2026-09-08', 0, 3857, 0, 'ze sešitu; nezaplaceno 299 Kč (v sešitě započteno); ruční součet v sešitě 4186 Kč'),
  ('sesit-2026-07-16', '2026-07-16', 1849, 3891, 0, 'ze sešitu; ruční součet v sešitě 5930 Kč'),
  ('sesit-2026-07-17', '2026-07-17', 409, 1946, 0, 'ze sešitu; nezaplaceno 498 Kč (v sešitě započteno)'),
  ('sesit-2026-09-10', '2026-09-10', 1995, 3833, 0, 'ze sešitu'),
  ('sesit-2026-09-11', '2026-09-11', 450, 2239, 0, 'ze sešitu'),
  ('sesit-2026-09-12', '2026-09-12', 833, 3458, 0, 'ze sešitu; nezaplaceno 1295 Kč (v sešitě započteno)'),
  ('sesit-2026-09-15', '2026-09-15', 0, 7284, 0, 'ze sešitu; nezaplaceno 498 Kč (v sešitě započteno); ruční součet v sešitě 8182 Kč'),
  ('sesit-2026-09-16', '2026-09-16', 2300, 4162, 0, 'ze sešitu; nezaplaceno 299 Kč (v sešitě započteno); ruční součet v sešitě 6805 Kč'),
  ('sesit-2026-09-17', '2026-09-17', 3008, 3860, 0, 'ze sešitu; ruční součet v sešitě 6851 Kč'),
  ('sesit-2026-09-18', '2026-09-18', 750, 4666, 0, 'ze sešitu; nezaplaceno 299 Kč (v sešitě započteno)')
on conflict (date) do nothing;

-- Posunout revizi, ať si admin data načte znovu a nepřepíše je.
update public.sync_state set revision = revision + 1, saved_at = now() where id;

commit;
