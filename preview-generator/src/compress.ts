import sharp from "sharp";

const TARGET_BYTES = 400 * 1024;

/**
 * Kompresuje PNG (ostre z deviceScaleFactor 2) tak, by mieścić się
 * najlepiej poniżej ~400 KB — najpierw silna kompresja, potem paleta.
 * Uwaga: w sharp opcja liczby kolorów to brytyjskie `colours`.
 */
export async function compressPng(input: Buffer): Promise<Buffer> {
  const candidates: Buffer[] = [
    await sharp(input)
      .png({ compressionLevel: 9, adaptiveFiltering: true })
      .toBuffer(),
  ];

  const paletteOpts = [
    { quality: 80, colours: 256 },
    { quality: 70, colours: 192 },
    { quality: 55, colours: 128 },
    { quality: 40, colours: 96 },
    { quality: 35, colours: 64 },
  ];

  for (const opts of paletteOpts) {
    candidates.push(
      await sharp(input)
        .png({
          compressionLevel: 9,
          palette: true,
          quality: opts.quality,
          colours: opts.colours,
          effort: 10,
        })
        .toBuffer()
    );
    if (candidates.some((b) => b.byteLength <= TARGET_BYTES)) break;
  }

  const under = candidates.filter((b) => b.byteLength <= TARGET_BYTES);
  if (under.length > 0) {
    return under.reduce((a, b) => (a.byteLength <= b.byteLength ? a : b));
  }

  const meta = await sharp(input).metadata();
  if (meta.width && meta.width > 2000) {
    const scaled = await sharp(input)
      .resize(Math.round(meta.width * 0.9), null, { kernel: "lanczos3" })
      .png({
        compressionLevel: 9,
        palette: true,
        quality: 40,
        colours: 80,
        effort: 10,
      })
      .toBuffer();
    candidates.push(scaled);
  }

  const underAfter = candidates.filter((b) => b.byteLength <= TARGET_BYTES);
  if (underAfter.length > 0) {
    return underAfter.reduce((a, b) => (a.byteLength <= b.byteLength ? a : b));
  }

  return candidates.reduce((a, b) => (a.byteLength <= b.byteLength ? a : b));
}
