# Iran Radiological Emergency Planning & Awareness
# سامانه‌ی برنامه‌ریزی و آگاهی اضطراری رادیولوژیک ایران

**Bilingual (فارسی / English) civilian-protection planning tool for publicly documented Iranian nuclear and radiological facilities.**

[فارسی را پایین‌تر بخوانید ↓](#فارسی)

---

## What this is

An evidence-based, reproducible, geographically-referenced planning tool. For each publicly documented facility it shows:

- **The real hazard type** — not every nuclear site poses the same risk. A power reactor (Bushehr) can produce a long-range radioactive cloud. An enrichment plant (Natanz, Fordow) poses a *chemical*, local hazard from UF₆. These require different public responses.
- **Five normalized source-term scenarios** per facility, ordered most-confident to least, each evidence-graded.
- **A wind-driven, non-circular plume footprint** (the "candle-flame" shape), computed from **real weather** fetched live for the facility coordinates at a date/time you choose.
- **RED / ORANGE / YELLOW / GREEN planning zones** based on relative concentration.

## What this is NOT

- **Not an operational warning system.** In a real event, the authoritative sources are the Atomic Energy Organization of Iran (AEOI), Iran's Passive Defense Organization, and the IAEA.
- **Not a dose prediction.** Output is *relative concentration* (χ/Q, s/m³), the shape and relative intensity of a footprint — not Sieverts. Converting to dose requires a real source term, nuclide-specific coefficients, exposure pathway and integration time, none of which are assumed.
- **Not a facility damage or targeting analysis.** No attack is assumed; scenarios are generic screening cases.

## The core design decision: hazard is not uniform

| Facility type | Dominant hazard | Public action | KI pills? |
|---|---|---|---|
| Power reactor (Bushehr) | Radiological, long-range (I-131, Cs-137) | Shelter; evacuate on order | Yes, on official order |
| Research reactor (Tehran/Amirabad) | Radiological, local; dense population | Near-field action | Possibly, on order |
| Enrichment (Natanz, Fordow) | **Chemical** (HF from UF₆), local | Avoid fumes, move crosswind | **No, useless** |
| Conversion (Isfahan) | Chemical, local | Avoid fumes | No |
| Heavy-water (Arak, not fueled) | Low — no active inventory | Local monitoring | No |
| Tunnel complex (Pickaxe Mt.) | **Unverified inventory** | Precaution only | Unknown |

A single blanket "nuclear attack, take iodine" message is both wrong and harmful (unneeded KI, panic, evacuation gridlock). This tool encodes the difference.

## How to run

This is a static site. Because it loads `data/facilities.json` by `fetch`, it must be served over HTTP (not opened as a `file://`):

```bash
cd radrep-iran
python3 -m http.server 8000
# then open http://localhost:8000/web/
```

For GitHub Pages: push the repo, enable Pages on the root, and open `/web/`.

**Live weather** requires internet access from the browser (it calls the free [Open-Meteo](https://open-meteo.com) API — no key needed). If offline, the facility data, hazard profiles and planning zones still display.

## Repository layout

```
radrep-iran/
  data/facilities.json       Evidence-graded inventory, 5 scenarios each
  web/index.html             Bilingual interactive map (Leaflet)
  web/dispersion.js          Gaussian screening plume model
  web/weather.js             Open-Meteo live/historical fetch
  docs/METHODOLOGY.md        Model equations, assumptions, validation
  docs/EVIDENCE_MATRIX.md    Facility-by-facility evidence and gaps
  docs/PUBLIC_GUIDANCE_FA.md Ready-to-use public messages (Persian)
```

## Method summary

- **Dispersion:** Gaussian plume, Pasquill-Gifford (Briggs open-country) sigma coefficients. Ground-level relative concentration with reflection, receptor at z=0. Stability class estimated from wind speed, day/night and cloud cover.
- **Weather:** Open-Meteo. Past dates → ERA5 reanalysis (archive endpoint). Near-future → numerical forecast (within ~16-day horizon). Beyond that → explicitly labeled as outside horizon, no fabricated data.
- **Zones:** RED ≥ 0.3 of peak, ORANGE ≥ 0.05, YELLOW ≥ 0.005, GREEN > 0. These are illustrative bands on relative concentration, not regulatory dose thresholds.

See `docs/METHODOLOGY.md` for equations, limits, and the Fukushima/Chernobyl validation note.

## Evidence grading

Every data point carries a grade: **A** verified, **B** corroborated, **C** secondary, **D** unconfirmed, **E** inference, **F** hypothesis, **G** speculation. Only Bushehr's long-range radiological profile is grade A. Enrichment-site profiles are inference (E). Pickaxe Mountain is grade D — tunneling is confirmed, function and inventory are not.

## Primary sources

IAEA (iaea.org), CTBTO (ctbto.org), ECMWF (ecmwf.int), Copernicus (climate.copernicus.eu), ICRP (icrp.org), UNSCEAR (unscear.org), WHO (who.int). Facility-specific sources are listed inside `data/facilities.json`.

## License

Released for civilian protection, education and research. Provided as-is, no warranty. Not for operational emergency response, which must use official national and IAEA channels.

---

<a name="فارسی"></a>
# فارسی

**ابزار دوزبانه (فارسی/انگلیسی) برای حفاظت غیرنظامی در برابر خطرات تأسیسات هسته‌ای و رادیولوژیک مستند ایران.**

## این ابزار چیست

یک ابزار برنامه‌ریزی مبتنی بر شواهد، بازتولیدپذیر و مکان‌مرجع. برای هر تأسیسات مستند عمومی نشان می‌دهد:

- **نوع واقعی خطر** — همه‌ی سایت‌های هسته‌ای خطر یکسان ندارند. رآکتور قدرت (بوشهر) می‌تواند ابر رادیواکتیو دوربرد تولید کند. تأسیسات غنی‌سازی (نطنز، فردو) خطر **شیمیایی** و محلی از UF۶ دارند. پاسخ عمومی این دو متفاوت است.
- **پنج سناریوی چشمه‌ی نرمال‌شده** برای هر تأسیسات، از مطمئن‌تر به کم‌اطمینان‌تر، هرکدام با درجه‌ی شواهد.
- **ردپای غیردایره‌ای باد (شکل شعله‌ی شمعی)** که از **هواشناسی واقعی** محاسبه می‌شود؛ هواشناسی برای مختصات تأسیسات در تاریخ و ساعتی که انتخاب می‌کنید به‌صورت زنده دریافت می‌شود.
- **زون‌های قرمز / نارنجی / زرد / سبز** بر اساس غلظت نسبی.

## این ابزار چه نیست

- **سامانه‌ی هشدار عملیاتی نیست.** در رخداد واقعی، منبع معتبر: سازمان انرژی اتمی ایران، سازمان پدافند غیرعامل و IAEA.
- **پیش‌بینی دوز نیست.** خروجی، *غلظت نسبی* (χ/Q) است؛ یعنی شکل و شدت نسبی ردپا، نه سیورت. تبدیل به دوز نیازمند چشمه‌ی واقعی، ضرایب نوکلئیدی، مسیر مواجهه و زمان انتگرال‌گیری است که هیچ‌کدام فرض نشده‌اند.
- **تحلیل آسیب یا هدف‌گیری نیست.** هیچ حمله‌ای فرض نشده؛ سناریوها عمومی و غربالگری‌اند.

## تصمیم طراحی اصلی: خطر یکسان نیست

| نوع تأسیسات | خطر غالب | اقدام عمومی | قرص ید؟ |
|---|---|---|---|
| رآکتور قدرت (بوشهر) | رادیولوژیک، دوربرد | پناه‌گیری؛ تخلیه با دستور | بله، با دستور رسمی |
| رآکتور تحقیقاتی (تهران/امیرآباد) | رادیولوژیک، محلی؛ جمعیت متراکم | اقدام نزدیک‌میدان | احتمالاً، با دستور |
| غنی‌سازی (نطنز، فردو) | **شیمیایی** (HF از UF۶)، محلی | دوری از دود، حرکت عمود بر باد | **نه، بی‌فایده** |
| تبدیل (اصفهان) | شیمیایی، محلی | دوری از دود | نه |
| آب سنگین (اراک، بدون سوخت) | پایین — بدون موجودی فعال | پایش محلی | نه |
| مجموعه‌ی تونلی (کوه کلنگ) | **موجودی نامعلوم** | فقط احتیاط | نامعلوم |

پیام یکسان «حمله‌ی اتمی، قرص ید بخورید» هم غلط است و هم آسیب‌زا (مصرف بی‌مورد KI، وحشت، قفل‌شدن تخلیه). این ابزار تفاوت را کدگذاری می‌کند.

## نحوه‌ی اجرا

سایت ایستا است. چون `data/facilities.json` را با fetch بارگذاری می‌کند، باید روی HTTP اجرا شود نه با باز کردن مستقیم فایل:

```bash
cd radrep-iran
python3 -m http.server 8000
# سپس باز کنید: http://localhost:8000/web/
```

برای GitHub Pages: ریپو را پوش کنید، Pages را روی ریشه فعال کنید و `/web/` را باز کنید.

**هواشناسی زنده** به اینترنت در مرورگر نیاز دارد (API رایگان Open-Meteo، بدون کلید). آفلاین هم داده‌ی تأسیسات، پروفایل خطر و زون‌ها نمایش داده می‌شوند.

## درجه‌بندی شواهد

هر داده درجه دارد: **A** راستی‌آزمایی‌شده، **B** تأییدشده، **C** ثانویه، **D** تأییدنشده، **E** استنتاج، **F** فرضیه، **G** حدس. فقط پروفایل رادیولوژیک دوربرد بوشهر درجه A است. پروفایل سایت‌های غنی‌سازی استنتاج (E) است. کوه کلنگ درجه D است؛ تونل‌سازی تأییدشده، کاربرد و موجودی نه.

## روش (خلاصه)

- **پخش:** مدل گاوسی، ضرایب Pasquill-Gifford (Briggs). غلظت نسبی سطح زمین با بازتاب. کلاس پایداری از سرعت باد، روز/شب و ابرناکی.
- **هواشناسی:** Open-Meteo. گذشته → بازتحلیل ERA5. آینده‌ی نزدیک → پیش‌بینی عددی (تا حدود ۱۶ روز). فراتر → برچسب «خارج از افق»، بدون داده‌ی ساختگی.
- **زون‌ها:** قرمز ≥ ۰٫۳ اوج، نارنجی ≥ ۰٫۰۵، زرد ≥ ۰٫۰۰۵، سبز > ۰. این‌ها باندهای نمایشی غلظت نسبی‌اند، نه آستانه‌ی دوز قانونی.

جزئیات معادلات و اعتبارسنجی در `docs/METHODOLOGY.md`.

## مجوز

برای حفاظت غیرنظامی، آموزش و پژوهش. بدون ضمانت. برای واکنش اضطراری عملیاتی نیست؛ آن باید از مجاری رسمی ملی و IAEA استفاده کند.
