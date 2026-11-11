# Cannalchemy lineage research and expansion

Research date: November 10, 2026 (America/New_York). This is a curated playable catalog, not an estimate of every cannabis cultivar in existence.

## Playable totals

| Unlock method | Entries |
| --- | ---: |
| Regional founding starters | 8 |
| Two-parent cross outcomes | 106 |
| Established seed-bank accessions | 68 |
| Named selections / stabilized accessions | 17 |
| **Total** | **199** |

The 106 outcomes use **104 unordered parent pairs**. One outcome is the explicitly documented Biscotti S1 × Sherbert BX1 breeding intermediate, not a separately marketed strain. Critical Mass / Super Skunk and Kalashnikova / White Russian share broad parental labels but refer to different breeder selections. Both results remain in the database; combining a pair awards undiscovered outcomes before repeats. These are cultivar unlocks, not a promise that repeating any two plants recreates a historical clone.

The original React/MySQL catalog had 44 entries and 71 recipe declarations across 61 unordered pairs. Its seed routine silently retained only the first outcome for each pair. Only one declaration survived this audit with the exact same parent IDs: Blueberry × Haze → Blue Dream. It remains a **reported** pedigree, not a laboratory-verified fact. The other declarations needed replacement, parental specificity, or conversion to an accession/selection.

## Evidence and uncertainty

Primary evidence was prioritized: Green House Seed Co., Sensi Seeds, Serious Seeds, Mr. Nice, Archive Seed Bank, DNA Genetics, Royal Queen Seeds, Dutch Passion, and ACE Seeds. Leafly, Weedmaps and a producer page supply explicitly labeled reports where an accessible originator page was unavailable. Each catalog record stores the URL, publisher, concise factual claim, access date, and evidence level. A breeder's product claim is labeled **breeder-reported**, never independently DNA-verified.

Some representative corrections:

| Entry | Original problem | Replacement |
| --- | --- | --- |
| White Widow | Afghani/Jamaican substitutions | Brazilian × South Indian |
| Runtz | Gelato × Durban Poison/Skunk | Original Z × Gelato |
| Do-Si-Dos | GSC × Bubba Kush/Afghani | OGKB × Face Off OG BX1 |
| Ice Cream Cake | Generic Gelato or Bubba Kush | Wedding Cake × Gelato #33 |
| GSC | Generic OG Kush × Durban Poison | Reported OG Kush parental selection × F1 Durb |
| Permanent Marker | Incomplete Biscotti / Sherbet / Jealousy shortcuts | (Biscotti S1 × Sherbert BX1) × Jealousy F2, using the published intermediate |
| Gary Payton | GG4 × GSC or MAC 1 × Runtz | The Y × Snowman |
| Cereal Milk | Gelato/Sherbet × Wedding Cake | Y Life × Snowman; The Y stays separate |
| MAC 1 | GSC × Chemdawg/Colombian Gold | MAC selection; MAC uses Alien Cookies F2 × Miracle 15 |
| White Runtz | White Widow parent | Named selection within the Gelato × Original Z family |
| Chemdawg | Thai/Nepalese/Malawi assertions | Unknown bag-seed ancestry; seed-bank accession |
| Original Z | Incomplete two-parent account | Undisclosed ancestry remains explicit; accession |
| Strawberry Cough | Haze × Durban Poison | Uncertain origin; avoids circular Strawberry Fields pedigrees |
| Biscotti / GDP | A single definitive pedigree despite conflicting accounts | Disputed ancestry remains visible; accession |
| AK-47 / Skunk #1 / Blueberry / Super Silver Haze | Partial ancestry forced into two slots | Complex founder accession; no invented intermediate |

Specific named parents remain separate: F1 Durb vs Durban Poison; SFV OG vs SFV OG Kush; The Y vs Y Life; Gelato vs numbered cuts; OGKB and Forum Cut vs generic GSC; Sherbert BX1 vs Sunset Sherbet; regional Thai vs OG Chocolate Thai; Colombian Gold vs Punta Roja. A separate Green House Jack Herer release follows that breeder's Haze × Red Skunk description rather than rewriting the original Sensi entry.

Regional names are populations, not authenticated individual clones. Breeder descriptions sometimes use broad terms such as Afghan or Skunk; explicit ambiguities are retained as accessions (including the Green House Skunk line). Cross direction, exact parent sex, repeated stabilization, and allele-level inheritance are not simulated by the two-slot game. Parent order is intentionally interchangeable for play.

Inherited prototype THC/CBD ranges, effect lists and flavor scores were outside this lineage audit; new records use unknown/Varies and empty profiles instead of invented measurements.

## Avoiding unreachable branches

Nine foundation accessions are available with the eight starters; Exodus Cheese is also awarded immediately as a Skunk #1 selection. Further packs arrive after 3, 8, 15 and 25 distinct cross outcomes. Imports and repeated attempts do not advance these milestones. Named selections unlock only after their source line. All awards are automatic and backfill existing saves.

The graph validator checks references, provenance, self-dependencies, dependency cycles, milestone reachability, exact recipe declarations, and the full closure. A separate test runs 100 different randomized discovery orders. Every run must finish all 199 entries, with a productive frontier until completion. This establishes structural reachability; it does not establish that all stages are equally fun or that no parent is central to several branches.

The UI exposes available recipes and upcoming seed-bank milestones. No random result is required to complete a branch. The lineage map and encyclopedia render every game tier dynamically rather than stopping at generation five.

## Saved progress and reproducibility

All 44 original IDs are preserved. Existing discoveries are grandfathered even if originally earned through a now-removed shortcut. Catalog metadata is updated in MySQL, stale recipe mappings are replaced transactionally, and user rows/discoveries/counts are retained. The uniqueness upgrade permits multiple outcomes from one pair.

- `backend/data/strains.json`: authoritative editable catalog with sources and unlock methods.
- `docs/strain-lineages.csv`: complete spreadsheet-friendly register of all 199 entries.
- `docs/original-lineage-audit.json`: all 44 original entries, before/after lineages, every prior recipe, dispositions, reasons and sources.
- `docs/progression-audit.json`: generated unlock waves and a complete constructive playthrough.
- `node scripts/catalog-report.js`: regenerate the CSV and progression audit after edits.
- `npm test --prefix backend`: run deterministic catalog and randomized reachability checks.
- `TEST_BASE_URL=https://your-playtest-domain npm test --prefix backend`: run the complete MySQL API playthrough, isolation, milestone, same-pair and persistence checks.

Further expansion should add evidence before adding a recipe. If a pedigree is undisclosed, disputed, or describes only a multi-way ancestry without a supported intermediate, use an accession or leave it for later research. Do not invent a cross simply to hit 300 entries.

## Completed playtest verification

The deployed MySQL playthrough passed all 199 entries and all 106 cross outcomes, including both pairs with multiple named results, reverse parent order, duplicate results, automatic milestone awards, isolated guests, authenticated parent ownership, rejection of removed fabricated recipes, and registered-login persistence. The migration check retained all 11 discoveries and all 3 attempts in a pre-update test account. The production React build and all six backend tests passed. Browser checks confirmed the 199-entry catalog, retained account progress, seed-bank milestones, encyclopedia provenance links, and dynamic map tiers.
