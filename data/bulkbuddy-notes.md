# Bulk Buddy cannabis reference notes

Scraped: 2026-09-23T21:59:41.135Z  
Source: https://www.bulkbuddy.co/product-category/cannabis/  
Currency on source: **CAD** (our site shows €)

- **Flower products kept:** 142
- **Skipped (not flower):** 2 — Cartel Kush, Pre-Rolled Joints | Hybrid | 10 Pack
- **By type:** indica 87, sativa 6, hybrid 37, Unknown 12
- **By grade:** AAA 17, AAA++ 45, Craft 6, AAAA- 15, AAAA 6, AA++ 2, AAA+ 36, AA+ 3, Shake/Trim 10, Unknown 2

## Weight units (in order) and price ranges

| Unit | Products | Min | Median | Max |
|---|---|---|---|---|
| 7 Grams | 128 | 20 | 23 | 37 |
| 1/2 Ounce | 126 | 38 | 43 | 70 |
| 1 Ounce | 123 | 73 | 84 | 135 |
| Quarter Pound | 121 | 183 | 213 | 348 |
| Half Pound | 120 | 337 | 391 | 635 |
| Pound | 119 | 625 | 725 | 1175 |

## Most common price ladders

- **32 products:** 7 Grams=22 | 1/2 Ounce=42 | 1 Ounce=81 | Quarter Pound=205 | Half Pound=377 | Pound=700  
  e.g. White Wedding, Dream Wedding, Ahi Tuna Kush, Layer Cake, Cherry Kush
- **24 products:** 7 Grams=23 | 1/2 Ounce=43 | 1 Ounce=84 | Quarter Pound=213 | Half Pound=391 | Pound=725  
  e.g. BC Pink Kush, Cherry Diamond, High Octane OG, Super Lemon MAC, Purple Kush
- **17 products:** 7 Grams=24 | 1/2 Ounce=45 | 1 Ounce=87 | Quarter Pound=220 | Half Pound=404 | Pound=750  
  e.g. OMFG, Blue Cheese, Glazed Donut, Black Cherry Soda, Dos Diablo
- **14 products:**   
  e.g. Pink Chapo LSO AAAA+ Indica Craft, Grape Gasoline, AAA Shake/Trim (Bubba Cali), Shake/Trim (Pink Kush), Shake/Trim Yoda OG Premium Shake
- **11 products:** 7 Grams=21 | 1/2 Ounce=40 | 1 Ounce=78 | Quarter Pound=198 | Half Pound=364 | Pound=675  
  e.g. Bubba Cali Kush, Dairy Queen, Blueberry Pie, Great White Shark, Chocolate Kush
- **9 products:** 7 Grams=24 | 1/2 Ounce=46 | 1 Ounce=90 | Quarter Pound=228 | Half Pound=418 | Pound=775  
  e.g. Gorilla Glue #4, Ayahuasca Purple, Purple Goo, Tom Ford Pink Kush, Grape Soda
- **6 products:** 7 Grams=20 | 1/2 Ounce=39 | 1 Ounce=75 | Quarter Pound=190 | Half Pound=350 | Pound=650  
  e.g. Chemo Kush, White Widow, Fruit Loops, Yoda OG, Starbud
- **4 products:** 7 Grams=25 | 1/2 Ounce=48 | 1 Ounce=93 | Quarter Pound=235 | Half Pound=431 | Pound=800  
  e.g. Red Congolese, Grand Daddy Purple, Purple Diamond, Four Star General

## Description format on source

- Short description = spec lines: Bud Size, Ratings, Texture, Flavour, Medical Usage, THC, CBD, Batch (batch dropped).
- Long description = H1 sales heading (dropped) + paragraphs; "Bulk Buddy" rebranded to "WeedLaps".
- Images are downloaded to `public/uploads/bulkbuddy/` and referenced locally; `sourceImage` keeps the original URL.
- Sizes start at 7 grams — smaller units are dropped. Prices are the exact variation prices from the source.
