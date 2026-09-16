# Bezel measurements

Fill in the tables below and hand the file back. Each screen needs six numbers.
Everything is in **millimetres**, one decimal place if you have it (`1234.5`).

Leave a screen's row blank if it does not need calibration.

---

## What the six numbers mean

The TV sits inset behind a frame. The frame's cut opening is neither centred on
the panel nor the same size as it, so the frame covers some picture on each side.

```
   +=========================================+  <- frame (opaque)
   |          T                              |
   |     +---------------------------+       |
   |  L  |                           |   R   |
   |     |      VISIBLE OPENING      |       |
   |     |   (what a visitor sees)   |       |
   |     |                           |       |
   |     +---------------------------+       |
   |          B                              |
   +=========================================+
   <----------------- W ---------------------->
   the FULL LIT AREA of the panel, frame included
```

| Symbol | Meaning |
|---|---|
| `W` | Panel **lit area width** -- the glass that actually shows picture |
| `H` | Panel **lit area height** -- same, vertically |
| `L` | How far the frame covers the picture on the **left** |
| `R` | ... on the **right** |
| `T` | ... on the **top** |
| `B` | ... on the **bottom** |

### The one that goes wrong

`W` and `H` are the **lit area**, not the TV's outer chassis. Every TV has its
own black plastic border around the picture; if that gets included, all four
offsets come out wrong by however wide it is.

Measure the picture itself. Easiest way: put a full-white image on the screen,
pull the frame off (or look from the side), and measure the white.

### Sanity checks

- `L + R` must be **less** than `W`, and `T + B` less than `H`.
- If the frame does not cover a side at all, write `0`.
- If the picture does not reach the frame on some side (a gap of dead black),
  write that side as a **negative** number -- that is useful, not a mistake.

---

## Measurements

### Front game screens

| Screen | W (lit width) | H (lit height) | L | R | T | B |
|---|---|---|---|---|---|---|
| `screen_oled2` | | | | | | |
| `screen_oled4` | | | | | | |
| `screen_6` | | | | | | |

### Back screens

Reconciled against `Tepel_back.pdf` (26ZK008-S00-J, 1:10). Two values were
corrected -- see the notes under the table.

| Screen | W (lit width) | H (lit height) | L | R | T | B | Resolution |
|---|---|---|---|---|---|---|---|
| `screen_2R` | 680,4 | 1209,6 | 50 | 30,4 | 96 | 153,6 | 1920x1080 portrait |
| `screen_4R` | 375,3 | 666,1 | 12,65 | 12,65 | **33,05** | **33,05** | 1366x768 portrait |
| `screen_7R` | 533,4 | 945,2 | 16,7 | 16,7 | 12,6 | 12,6 | 3840x2160 portrait |
| `screen_8R` | **528,04** | **297,46** | **14,02** | **14,02** | **14,73** | **14,73** | 1920x1080 landscape |
| `screen_10` | **528,04** | **297,46** | **14,02** | **14,02** | **14,73** | **14,73** | 1920x1080 landscape |

**Corner radius: 80 mm on all five openings.** Taken from the arc segments in
the PDF -- exactly 20 arcs of R80, which is 5 openings x 4 corners.

### Corrections made

- `screen_4R` top/bottom were written as `33,5`; the drawing says **`33,05`**.
- `screen_8R` / `screen_10` are landscape, so W and H are the other way round
  from how they were written. The `14,02` pair is on the drawing's *horizontal*
  arrows (so L/R, against the 528,04 axis) and `14,73` on the *vertical* ones
  (T/B, against 297,46).

### Why these are right

Every opening comes out a round number, which is what a fabricator would cut to:

| Screen | Opening |
|---|---|
| `2R` | 600 x 960 |
| `4R` | 350 x 600 |
| `7R` | 500 x 920 |
| `8R` / `10` | 500 x 268 |

The rejected readings do not: `33,5` gives 599,1 and the transposed 8R gives
498,58 x 269,42.

`screen_9` is excluded -- it is not a product display app.

---

## Shortcut: identical screens

If several screens use the same panel **and** the same frame cut, do not measure
them all. Fill one row and list the rest here:

```
identical to screen_XX:
```

---

## Alternative: if you measured the opening instead

If what you have is the size and position of the **opening** rather than the
overlap on each side, use this instead and I will do the subtraction. Do not
convert by hand -- raw numbers are less error-prone.

| Screen | Panel W | Panel H | Opening W | Opening H | Opening offset from left | Opening offset from top |
|---|---|---|---|---|---|---|
| | | | | | | |

---

## Anything odd

Rotated panels, a screen where the frame sits at an angle, one that is already
correct, a measurement you are unsure of -- note it here rather than guessing:

```


```
