import { ImageResponse } from 'next/og';

export const alt = 'Itch. Every problem deserves to be heard.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div style={{
        width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
        justifyContent: 'space-between', padding: '64px 72px', background: '#08090c',
        color: '#f3f0e8', fontFamily: 'Arial, sans-serif', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', right: '-110px', top: '-190px', width: '620px', height: '620px', border: '1px solid #28263d', borderRadius: '50%', display: 'flex' }} />
        <div style={{ position: 'absolute', right: '-5px', top: '-85px', width: '420px', height: '420px', border: '1px solid #28263d', borderRadius: '50%', display: 'flex' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 32, fontWeight: 700 }}>
          <div style={{ width: 48, height: 48, borderRadius: 13, background: '#6743e8', color: '#efff79', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30 }}>!</div>
          Itch<span style={{ color: '#d8ff57' }}>.</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 950 }}>
          <div style={{ fontSize: 76, lineHeight: 1.04, letterSpacing: -4, fontWeight: 750 }}>Every problem</div>
          <div style={{ fontSize: 76, lineHeight: 1.04, letterSpacing: -4, fontWeight: 750, color: '#a48bff' }}>deserves to be heard.</div>
          <div style={{ marginTop: 24, fontSize: 25, lineHeight: 1.4, color: '#b7b5c0' }}>Share what gets in your way. Find people who understand.</div>
        </div>
        <div style={{ display: 'flex', fontSize: 17, color: '#d8ff57', letterSpacing: 1 }}>TRYITCH.ONLINE</div>
      </div>
    ),
    { ...size },
  );
}
