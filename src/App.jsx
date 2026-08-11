import { useState, useEffect, useRef } from "react";
import { supabase } from "./supabase";

// ─── Paleta & fuentes ───────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800;900&family=Nunito:wght@400;500;600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --rojo:   #C0392B;
    --rojo2:  #E8651A;
    --oro:    #D4A017;
    --oro2:   #F5C842;
    --verde:  #1A7A4A;
    --crema:  #FDF6EC;
    --cafe:   #3D1C0A;
    --gris:   #F4EFE6;
    --text:   #1C0A00;
    --muted:  #7A6555;
    --white:  #FFFFFF;
    --grad:   linear-gradient(135deg, #7B1208 0%, #C0392B 40%, #E8651A 75%, #D4A017 100%);
    --shadow: 0 4px 24px rgba(60,20,0,0.13);
    --radius: 16px;
    --font-head: 'Sora', sans-serif;
    --font-body: 'Nunito', sans-serif;
  }

  html, body, #root {
    width: 100%;
    min-height: 100vh;
    background: var(--crema);
    font-family: var(--font-body);
    color: var(--text);
    overflow-x: hidden;
  }

  /* ── SCROLLBAR ── */
  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: var(--gris); }
  ::-webkit-scrollbar-thumb { background: #C0392B88; border-radius: 99px; }

  /* ── NAVBAR ── */
  .nav {
    width: 100%;
    background: var(--grad);
    display: flex;
    align-items: center;
    height: 64px;
    padding: 0 20px;
    gap: 14px;
    position: sticky;
    top: 0;
    z-index: 100;
    box-shadow: 0 2px 20px rgba(120,18,8,0.35);
  }
  .nav-logo {
    display: flex; align-items: center; gap: 10px;
    cursor: pointer; flex-shrink: 0; text-decoration: none;
  }
  .nav-logo-img {
    height: 40px; width: 40px;
    object-fit: contain; border-radius: 10px;
    background: rgba(255,255,255,0.18);
    border: 1.5px solid rgba(255,255,255,0.35);
    padding: 4px;
    transition: transform 0.2s;
  }
  .nav-logo-img:hover { transform: scale(1.08); }
  .nav-brand { font-family: var(--font-head); color: white; font-weight: 900; font-size: 19px; letter-spacing: -0.3px; }

  .search-wrap {
    flex: 1; display: flex;
    background: rgba(255,255,255,0.18);
    border: 1.5px solid rgba(255,255,255,0.35);
    border-radius: 50px;
    overflow: hidden;
    height: 42px;
    transition: background 0.2s, border 0.2s;
    backdrop-filter: blur(4px);
  }
  .search-wrap:focus-within {
    background: rgba(255,255,255,0.28);
    border-color: rgba(255,255,255,0.6);
  }
  .search-inp {
    flex: 1; padding: 0 18px;
    background: transparent; border: none; outline: none;
    font-size: 14px; color: white;
    font-family: var(--font-body);
  }
  .search-inp::placeholder { color: rgba(255,255,255,0.65); }
  .search-btn {
    background: rgba(255,255,255,0.2); border: none;
    padding: 0 18px; cursor: pointer; font-size: 16px;
    color: white; transition: background 0.2s;
    border-left: 1px solid rgba(255,255,255,0.2);
  }
  .search-btn:hover { background: rgba(255,255,255,0.32); }

  .nav-actions { display: flex; gap: 8px; flex-shrink: 0; }
  .nav-btn {
    background: rgba(255,255,255,0.18);
    border: 1.5px solid rgba(255,255,255,0.35);
    color: white; padding: 7px 16px; border-radius: 50px;
    cursor: pointer; font-size: 13px; font-weight: 700;
    white-space: nowrap; font-family: var(--font-body);
    transition: background 0.18s, transform 0.15s;
  }
  .nav-btn:hover { background: rgba(255,255,255,0.32); transform: translateY(-1px); }

  /* ── HERO ──────────────────────────────────────────────────────
     Imagen de fondo (artesanías peruanas) + degradado de marca encima.
     El degradado ahora es más opaco/oscuro que antes para garantizar
     contraste perfecto del texto blanco sobre una foto clara y con
     muchos colores (mimbre claro, cuentas rojas/amarillas/turquesas).
     3 capas: 1) degradado de marca oscurecido  2) velo negro direccional
     (más fuerte arriba y abajo, donde va el texto y el carrusel)
     3) la fotografía en sí.

     IMPORTANTE: el archivo de imagen debe llamarse "hero-bg.jpg" y
     colocarse en la carpeta "public" de tu proyecto (al mismo nivel
     que logo.png). Se usa ruta absoluta "/hero-bg.jpg" para que
     funcione igual que "/logo.png", sin importar desde qué pantalla
     se renderice el componente.
  */
  .hero {
    width: 100%;
    --hero-bg-img: url('/hero-bg.jpg');
    background-image:
      linear-gradient(135deg, rgba(88,10,4,0.93) 0%, rgba(160,45,33,0.90) 38%, rgba(196,82,20,0.86) 72%, rgba(178,128,14,0.90) 100%),
      linear-gradient(to bottom, rgba(10,3,0,0.55) 0%, rgba(10,3,0,0.15) 35%, rgba(10,3,0,0.20) 65%, rgba(10,3,0,0.6) 100%),
      var(--hero-bg-img);
    background-size: cover, cover, cover;
    background-position: center, center, center 38%;
    background-repeat: no-repeat, no-repeat, no-repeat;
    padding: 56px 24px 44px;
    text-align: center;
    position: relative;
    overflow: hidden;
  }
  .hero::before {
    content: '';
    position: absolute; inset: 0;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    pointer-events: none;
  }
  .hero-badge {
    display: inline-flex; align-items: center; gap: 6px;
    background: rgba(255,255,255,0.16);
    border: 1px solid rgba(255,255,255,0.45);
    color: white; padding: 6px 20px; border-radius: 100px;
    font-size: 11px; letter-spacing: 2px; font-weight: 700;
    margin-bottom: 20px; text-transform: uppercase;
    backdrop-filter: blur(3px);
    position: relative; z-index: 1;
  }
  .hero-title {
    font-family: var(--font-head); color: white;
    font-size: clamp(30px, 5.5vw, 54px);
    font-weight: 900; line-height: 1.15;
    margin-bottom: 12px;
    text-shadow: 0 3px 18px rgba(0,0,0,0.45), 0 1px 3px rgba(0,0,0,0.5);
    position: relative; z-index: 1;
  }
  .hero-title .oro { color: var(--oro2); }
  .hero-title .verde { color: #7ECBA1; }
  .hero-sub {
    color: rgba(255,255,255,0.92); font-size: 15px; margin-bottom: 28px;
    text-shadow: 0 2px 10px rgba(0,0,0,0.4);
    position: relative; z-index: 1;
  }

  /* Carrusel hero */
  .hero-carousel {
    display: flex; gap: 14px; overflow-x: auto;
    padding: 4px 4px 12px; scroll-snap-type: x mandatory;
    scrollbar-width: none;
    position: relative; z-index: 1;
  }
  .hero-carousel::-webkit-scrollbar { display: none; }
  .hero-card {
    min-width: 160px; flex-shrink: 0;
    background: rgba(255,255,255,0.16);
    border: 1px solid rgba(255,255,255,0.3);
    border-radius: 14px; padding: 16px;
    scroll-snap-align: start; text-align: left;
    backdrop-filter: blur(8px);
    transition: transform 0.2s;
    overflow: hidden;
    box-shadow: 0 8px 24px rgba(0,0,0,0.18);
  }
  .hero-card:hover { transform: translateY(-3px); }
  .hero-card-img {
    width: 100%; height: 90px;
    border-radius: 8px; object-fit: cover;
    margin-bottom: 10px;
    background: rgba(255,255,255,0.1);
  }
  .hero-card-name { color: white; font-weight: 700; font-size: 13px; margin-bottom: 4px; }
  .hero-card-price { color: var(--oro2); font-weight: 900; font-size: 17px; margin-bottom: 4px; }
  .hero-card-foot { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-top: 6px; }
  .hero-card-likes { color: rgba(255,255,255,0.7); font-size: 12px; }
  .hero-card-buy {
    background: rgba(255,255,255,0.22); border: 1px solid rgba(255,255,255,0.4);
    color: white; width: 30px; height: 30px; border-radius: 9px;
    cursor: pointer; font-size: 15px; display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; transition: background 0.18s, transform 0.15s;
  }
  .hero-card-buy:hover { background: rgba(255,255,255,0.34); transform: translateY(-1px); }

  /* ── PANEL AGREGAR AL CARRITO ── */
  .qty-stepper { display: flex; align-items: center; gap: 14px; margin-bottom: 22px; }
  .qty-btn {
    width: 40px; height: 40px; border-radius: 10px; flex-shrink: 0;
    background: var(--gris); border: 1.5px solid #E8E0D4;
    color: var(--rojo); font-size: 19px; font-weight: 800;
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    transition: background 0.15s, border-color 0.15s;
  }
  .qty-btn:hover { background: #fff0ee; border-color: var(--rojo); }
  .qty-btn:disabled { opacity: 0.4; cursor: not-allowed; }
  .qty-val { font-family: var(--font-head); font-weight: 800; font-size: 19px; min-width: 32px; text-align: center; }
  .panel-prod-img {
    width: 100%; height: 180px; border-radius: 14px; overflow: hidden;
    background: var(--gris); display: flex; align-items: center; justify-content: center;
    font-size: 46px; margin-bottom: 16px;
  }
  .panel-prod-img img { width: 100%; height: 100%; object-fit: cover; }

  /* ── WRAP / PAGE ── */
  .page { width: 100%; max-width: 1200px; margin: 0 auto; padding: 32px 20px 60px; }

  /* ── SECTION TITLE ── */
  .sec-title {
    font-family: var(--font-head); font-size: 20px; font-weight: 800;
    color: var(--cafe); margin-bottom: 18px;
    display: flex; align-items: center; gap: 10px;
  }
  .sec-title::after {
    content: ''; flex: 1; height: 2px;
    background: linear-gradient(90deg, #C0392B44, transparent);
    border-radius: 2px;
  }

  /* ── GRID ── */
  .grid { display: grid; gap: 16px; margin-bottom: 36px; }
  .grid-cat { grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); }
  .grid-prod { grid-template-columns: repeat(auto-fill, minmax(188px, 1fr)); }
  .grid-tienda { grid-template-columns: repeat(auto-fill, minmax(230px, 1fr)); }

  /* ── CAT CARD ── */
  .cat-card {
    border-radius: var(--radius); padding: 22px 18px;
    cursor: pointer; color: white; position: relative; overflow: hidden;
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .cat-card:hover { transform: translateY(-4px); box-shadow: 0 10px 30px rgba(0,0,0,0.18); }
  .cat-card::after {
    content: ''; position: absolute; top: -20px; right: -20px;
    width: 80px; height: 80px; border-radius: 50%;
    background: rgba(255,255,255,0.1);
  }
  .cat-card-name { font-family: var(--font-head); font-weight: 800; font-size: 14px; margin-bottom: 5px; position: relative; }
  .cat-card-desc { font-size: 12px; opacity: 0.85; margin: 0; position: relative; }

  /* ── PRODUCT CARD ── */
  .prod-card {
    background: white; border-radius: var(--radius);
    overflow: hidden; box-shadow: var(--shadow);
    transition: transform 0.2s, box-shadow 0.2s;
    display: flex; flex-direction: column;
  }
  .prod-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(60,20,0,0.16); }
  .prod-img {
    height: 148px; background: var(--gris);
    display: flex; align-items: center; justify-content: center;
    font-size: 42px; position: relative; overflow: hidden;
  }
  .prod-img img {
    width: 100%; height: 100%; object-fit: cover;
    position: absolute; inset: 0;
  }
  .prod-img::after {
    content: ''; position: absolute; bottom: 0; left: 0; right: 0;
    height: 40px; background: linear-gradient(transparent, rgba(0,0,0,0.06));
    pointer-events: none;
  }
  .prod-body { padding: 14px; flex: 1; display: flex; flex-direction: column; gap: 4px; }
  .prod-name { font-weight: 700; font-size: 13px; line-height: 1.4; color: var(--text); }
  .prod-price { color: var(--rojo); font-weight: 900; font-size: 19px; font-family: var(--font-head); }
  .prod-foot { display: flex; justify-content: space-between; align-items: center; margin-top: 6px; }
  .prod-likes { font-size: 12px; color: var(--muted); }
  .btn-like {
    background: none; border: 1.5px solid #eee; border-radius: 8px;
    padding: 4px 12px; cursor: pointer; font-size: 12px; font-family: var(--font-body);
    font-weight: 600; color: var(--muted); transition: all 0.18s;
  }
  .btn-like:hover { border-color: var(--rojo); color: var(--rojo); background: #fff0ee; }

  /* ── TIENDA CARD ── */
  .tienda-card {
    background: white; border-radius: var(--radius); padding: 18px;
    box-shadow: var(--shadow); cursor: pointer; display: flex; align-items: center; gap: 14px;
    transition: transform 0.2s, box-shadow 0.2s;
    border: 1.5px solid transparent;
  }
  .tienda-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 28px rgba(60,20,0,0.14);
    border-color: rgba(192,57,43,0.15);
  }
  .tienda-avatar {
    width: 52px; height: 52px; border-radius: 14px;
    object-fit: cover; flex-shrink: 0;
    box-shadow: 0 2px 8px rgba(0,0,0,0.12);
  }
  .tienda-avatar-letter {
    width: 52px; height: 52px; border-radius: 14px;
    background: var(--grad); display: flex; align-items: center; justify-content: center;
    color: white; font-weight: 900; font-size: 22px; flex-shrink: 0;
    font-family: var(--font-head);
    box-shadow: 0 2px 8px rgba(192,57,43,0.3);
  }
  .tienda-name { font-weight: 800; font-size: 14px; margin-bottom: 3px; }
  .tienda-loc { font-size: 12px; color: var(--muted); }

  /* ── EMPTY ── */
  .empty {
    background: white; border-radius: var(--radius); padding: 44px 24px;
    text-align: center; color: var(--muted);
    box-shadow: var(--shadow); margin-bottom: 28px;
  }
  .empty-icon { font-size: 44px; margin-bottom: 12px; }
  .empty-txt { font-weight: 700; font-size: 15px; }

  /* ── BUTTONS ── */
  .btn-primary {
    display: block; width: 100%; padding: 14px;
    background: var(--grad); color: white;
    border: none; border-radius: 50px; font-size: 15px;
    font-weight: 800; cursor: pointer; font-family: var(--font-body);
    box-shadow: 0 4px 16px rgba(192,57,43,0.3);
    transition: opacity 0.18s, transform 0.15s, box-shadow 0.18s;
    margin-bottom: 10px;
  }
  .btn-primary:hover { opacity: 0.92; transform: translateY(-2px); box-shadow: 0 8px 22px rgba(192,57,43,0.36); }
  .btn-primary:disabled { opacity: 0.55; cursor: not-allowed; transform: none; }

  .btn-secondary {
    display: block; width: 100%; padding: 13px;
    background: none; border: 2px solid #e0d8d0;
    border-radius: 50px; font-size: 15px;
    cursor: pointer; font-family: var(--font-body); font-weight: 700;
    color: var(--muted); transition: all 0.18s;
    margin-bottom: 10px;
  }
  .btn-secondary:hover { border-color: var(--rojo); color: var(--rojo); background: #fff0ee; }

  .btn-wa {
    display: block; width: 100%; padding: 14px;
    background: linear-gradient(90deg, #25D366, #128C7E);
    color: white; border: none; border-radius: 50px; font-size: 15px;
    font-weight: 800; cursor: pointer; font-family: var(--font-body);
    box-shadow: 0 4px 16px rgba(37,211,102,0.3);
    transition: opacity 0.18s, transform 0.15s;
    margin-bottom: 10px;
  }
  .btn-wa:hover { opacity: 0.9; transform: translateY(-2px); }

  /* ── INPUTS ── */
  .inp {
    display: block; width: 100%; padding: 13px 16px;
    margin-bottom: 12px; border-radius: 12px;
    border: 2px solid #E8E0D4; font-size: 15px;
    font-family: var(--font-body); background: white; color: var(--text);
    outline: none; transition: border-color 0.18s, box-shadow 0.18s;
  }
  .inp:focus { border-color: var(--rojo); box-shadow: 0 0 0 4px rgba(192,57,43,0.1); }
  .inp::placeholder { color: #BBB; }
  textarea.inp { resize: vertical; }

  /* ── FORM CARD ── */
  .form-card {
    background: white; border-radius: var(--radius);
    padding: 28px; box-shadow: var(--shadow);
    max-width: 520px; margin: 0 auto;
  }
  .form-title {
    font-family: var(--font-head); font-size: 20px;
    font-weight: 800; margin-bottom: 6px; color: var(--cafe);
  }
  .form-sub { color: var(--muted); font-size: 13px; margin-bottom: 22px; }

  /* ── BACK ROW ── */
  .back-row { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; }
  .btn-back {
    background: white; border: 2px solid #E8E0D4; border-radius: 12px;
    width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;
    cursor: pointer; font-size: 20px; color: var(--rojo); flex-shrink: 0;
    transition: background 0.15s, border-color 0.15s;
  }
  .btn-back:hover { background: #fff0ee; border-color: var(--rojo); }

  /* ── TAGS / FILTROS ── */
  .tag { display: inline-block; padding: 7px 18px; border-radius: 100px; font-size: 13px; font-weight: 700; margin-right: 8px; margin-bottom: 8px; cursor: pointer; transition: all 0.18s; }
  .tag-active { background: var(--rojo); color: white; box-shadow: 0 3px 10px rgba(192,57,43,0.3); }
  .tag-inactive { background: white; color: var(--muted); border: 1.5px solid #E8E0D4; }
  .tag-inactive:hover { border-color: var(--rojo); color: var(--rojo); }

  /* ── MENU LATERAL ── */
  .overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 200; backdrop-filter: blur(2px); }
  .drawer {
    position: fixed; right: 0; top: 0; bottom: 0;
    width: min(300px, 85vw); background: white; z-index: 201;
    box-shadow: -6px 0 40px rgba(0,0,0,0.18); overflow-y: auto;
    animation: slideIn 0.26s ease;
  }
  @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
  .drawer-head {
    background: var(--grad); padding: 24px 24px 20px;
    position: relative; overflow: hidden;
  }
  .drawer-head::before {
    content: ''; position: absolute; bottom: -30px; right: -30px;
    width: 100px; height: 100px; border-radius: 50%;
    background: rgba(255,255,255,0.08);
  }
  .drawer-brand { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
  .drawer-user { color: rgba(255,255,255,0.95); font-size: 14px; font-weight: 700; margin-bottom: 2px; }
  .drawer-id { color: rgba(255,255,255,0.65); font-size: 12px; }
  .drawer-items { padding: 12px 20px; }
  .drawer-item {
    padding: 14px 4px; border-bottom: 1px solid #F0EAE0;
    cursor: pointer; font-weight: 600; font-size: 15px;
    display: flex; align-items: center; gap: 12px;
    color: var(--text); transition: color 0.15s, padding-left 0.15s;
  }
  .drawer-item:hover { color: var(--rojo); padding-left: 8px; }
  .drawer-item-icon { font-size: 20px; width: 28px; text-align: center; }

  /* ── PERFIL MODAL ── */
  .perfil-modal {
    min-height: 100vh; background: var(--grad);
    display: flex; align-items: center; justify-content: center; padding: 20px;
  }

  /* ── TIENDA DETALLE ── */
  .tienda-info-card {
    background: white; border-radius: var(--radius); padding: 24px;
    margin-bottom: 24px; box-shadow: var(--shadow);
  }
  .tienda-info-head { display: flex; align-items: center; gap: 18px; margin-bottom: 18px; }
  .tienda-big-avatar {
    width: 80px; height: 80px; border-radius: 18px;
    object-fit: cover; flex-shrink: 0;
    box-shadow: 0 4px 16px rgba(192,57,43,0.2);
  }
  .tienda-big-letter {
    width: 80px; height: 80px; border-radius: 18px;
    background: var(--grad); display: flex; align-items: center; justify-content: center;
    color: white; font-weight: 900; font-size: 32px; flex-shrink: 0;
    font-family: var(--font-head); box-shadow: 0 4px 16px rgba(192,57,43,0.3);
  }
  .notice {
    font-size: 11px; color: var(--muted); text-align: center;
    margin-top: 6px; display: flex; align-items: center; justify-content: center; gap: 5px;
  }

  /* ── CARRITO ── */
  .cart-card {
    background: white; border-radius: var(--radius); padding: 22px;
    margin-bottom: 18px; box-shadow: var(--shadow);
  }
  .cart-item {
    display: flex; justify-content: space-between; padding: 11px 0;
    border-bottom: 1px solid #F0EAE0; align-items: center;
    gap: 10px;
  }
  .cart-item:last-child { border-bottom: none; }
  .cart-item-qty {
    display: flex; align-items: center; gap: 8px; margin-top: 4px;
  }
  .cart-qty-btn {
    width: 24px; height: 24px; border-radius: 6px;
    border: 1.5px solid #E8E0D4; background: var(--gris);
    color: var(--rojo); font-weight: 800; cursor: pointer;
    font-size: 14px; line-height: 1; display: flex;
    align-items: center; justify-content: center;
    transition: background 0.15s, border-color 0.15s;
  }
  .cart-qty-btn:hover { background: #fff0ee; border-color: var(--rojo); }
  .cart-qty-btn:disabled { opacity: 0.4; cursor: not-allowed; }
  .cart-qty-val { font-size: 13px; font-weight: 700; min-width: 16px; text-align: center; }
  .cart-item-remove {
    background: none; border: none; color: var(--muted);
    cursor: pointer; font-size: 16px; padding: 2px;
    transition: color 0.15s;
    flex-shrink: 0;
  }
  .cart-item-remove:hover { color: var(--rojo); }
  .cart-total {
    display: flex; justify-content: space-between;
    margin-top: 16px; font-weight: 900; font-size: 18px;
    font-family: var(--font-head);
  }

  /* ── ID BADGE ── */
  .id-badge {
    background: var(--grad); color: white;
    padding: 12px 32px; border-radius: 100px;
    display: inline-block; font-weight: 900; font-size: 22px;
    letter-spacing: 4px; font-family: var(--font-head);
    box-shadow: 0 4px 18px rgba(192,57,43,0.35);
  }

  /* ── STEPS (cómo vender) ── */
  .step-row { display: flex; gap: 18px; margin-bottom: 26px; }
  .step-num {
    width: 42px; height: 42px; border-radius: 14px;
    background: var(--grad); display: flex; align-items: center; justify-content: center;
    color: white; font-weight: 900; font-size: 17px; flex-shrink: 0;
    font-family: var(--font-head);
    box-shadow: 0 3px 10px rgba(192,57,43,0.3);
  }

  /* ── POLITICA ITEM ── */
  .pol-item { margin-bottom: 22px; padding: 18px; background: var(--gris); border-radius: 12px; border-left: 4px solid var(--rojo); }
  .pol-title { font-weight: 800; font-size: 14px; color: var(--rojo); margin-bottom: 6px; }
  .pol-txt { font-size: 14px; line-height: 1.7; color: #444; margin: 0; }

  /* ── MSG ── */
  .msg-ok { color: var(--verde); font-weight: 700; margin-bottom: 10px; background: #e8f5ee; padding: 10px 14px; border-radius: 10px; }
  .msg-err { color: var(--rojo); font-weight: 700; margin-bottom: 10px; background: #fff0ee; padding: 10px 14px; border-radius: 10px; }

  /* ── MODAL ── */
  .modal-wrap { position: fixed; inset: 0; z-index: 300; display: flex; align-items: center; justify-content: center; padding: 20px; }
  .modal-bg { position: absolute; inset: 0; background: rgba(0,0,0,0.55); backdrop-filter: blur(3px); }
  .modal-box {
    position: relative; background: white; border-radius: 20px;
    padding: 32px 28px; max-width: 340px; width: 100%; text-align: center;
    box-shadow: 0 20px 60px rgba(0,0,0,0.25);
    animation: popIn 0.22s ease;
  }
  @keyframes popIn { from { transform: scale(0.88); opacity: 0; } to { transform: scale(1); opacity: 1; } }
  .modal-title { font-family: var(--font-head); font-size: 18px; font-weight: 800; margin-bottom: 10px; }
  .modal-sub { font-size: 14px; color: var(--muted); margin-bottom: 24px; line-height: 1.6; }

  /* ── PAGO / CULQI PLACEHOLDER ── */
  .pago-section { background: linear-gradient(135deg, #FDF6EC, #FFF8F0); border-radius: var(--radius); padding: 24px; border: 2px dashed #E8D0A0; margin-bottom: 24px; }
  .pago-title { font-family: var(--font-head); font-weight: 800; font-size: 16px; color: var(--cafe); margin-bottom: 6px; }
  .pago-price { font-family: var(--font-head); font-weight: 900; font-size: 28px; color: var(--rojo); }

  /* ── UPLOAD AREA ── */
  .upload-area {
    border: 2px dashed #D0C8BC; border-radius: 14px;
    padding: 20px; text-align: center; cursor: pointer;
    margin-bottom: 12px; transition: border-color 0.18s, background 0.18s;
    background: var(--gris);
  }
  .upload-area:hover { border-color: var(--rojo); background: #fff7f5; }

  /* ── STATS GRID ── */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    margin-bottom: 20px;
  }
  .stat-card {
    background: var(--gris);
    border-radius: 14px;
    padding: 14px 12px;
    text-align: center;
  }
  .stat-val {
    font-family: var(--font-head);
    font-size: 26px;
    font-weight: 900;
    color: var(--rojo);
    line-height: 1;
    margin-bottom: 4px;
  }
  .stat-lbl {
    font-size: 11px;
    color: var(--muted);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  /* ── TOKENS BADGE ── */
  .tokens-bar {
    background: var(--gris);
    border-radius: 12px;
    padding: 14px 16px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
  }
  .tokens-left { flex: 1; }
  .tokens-title { font-weight: 800; font-size: 13px; color: var(--cafe); margin-bottom: 4px; }
  .tokens-track {
    height: 8px;
    background: #E0D8D0;
    border-radius: 99px;
    overflow: hidden;
    margin-bottom: 4px;
  }
  .tokens-fill {
    height: 100%;
    border-radius: 99px;
    background: var(--grad);
    transition: width 0.5s ease;
  }
  .tokens-sub { font-size: 11px; color: var(--muted); }
  .btn-comprar-tokens {
    background: var(--grad);
    color: white;
    border: none;
    border-radius: 10px;
    padding: 8px 14px;
    font-size: 12px;
    font-weight: 800;
    cursor: pointer;
    white-space: nowrap;
    font-family: var(--font-body);
    transition: opacity 0.18s;
    flex-shrink: 0;
  }
  .btn-comprar-tokens:hover { opacity: 0.88; }

  /* ── TOGGLE PUBLICAR ── */
  .btn-toggle-form {
    width: 100%;
    background: var(--grad);
    color: white;
    border: none;
    border-radius: 14px;
    padding: 16px 20px;
    font-size: 15px;
    font-weight: 800;
    cursor: pointer;
    font-family: var(--font-body);
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
    box-shadow: 0 4px 16px rgba(192,57,43,0.25);
    transition: opacity 0.18s, transform 0.15s;
  }
  .btn-toggle-form:hover { opacity: 0.92; transform: translateY(-1px); }
  .btn-toggle-arrow {
    font-size: 20px;
    transition: transform 0.25s ease;
  }
  .btn-toggle-arrow.open { transform: rotate(180deg); }

  /* ── FORM SLIDE ── */
  .form-slide {
    overflow: hidden;
    transition: max-height 0.35s ease, opacity 0.3s ease;
    max-height: 0;
    opacity: 0;
  }
  .form-slide.visible {
    max-height: 1400px;
    opacity: 1;
  }

  /* ── PROD ITEM (publicados en mi tienda) ── */
  .prod-item {
    display: flex;
    gap: 12px;
    padding: 12px 0;
    border-bottom: 1px solid #F0EAE0;
    align-items: center;
  }
  .prod-item:last-child { border-bottom: none; }
  .prod-item-img {
    width: 52px; height: 52px;
    border-radius: 12px;
    background: var(--gris);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    flex-shrink: 0;
    overflow: hidden;
  }
  .prod-item-img img {
    width: 100%; height: 100%; object-fit: cover;
  }
  .prod-item-info { flex: 1; min-width: 0; }
  .prod-item-name {
    font-weight: 700;
    font-size: 13px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-bottom: 2px;
  }
  .prod-item-meta { font-size: 12px; color: var(--muted); }
  .prod-item-price {
    font-family: var(--font-head);
    font-weight: 900;
    font-size: 16px;
    color: var(--rojo);
    flex-shrink: 0;
  }

  /* ── GALERÍA DE FOTOS DE PRODUCTO ── */
  .prod-gallery {
    display: flex; gap: 6px; overflow-x: auto;
    padding-bottom: 4px; scrollbar-width: none;
    margin-bottom: 10px;
  }
  .prod-gallery::-webkit-scrollbar { display: none; }
  .prod-gallery-thumb {
    width: 56px; height: 56px; border-radius: 8px;
    object-fit: cover; flex-shrink: 0; cursor: pointer;
    border: 2px solid transparent;
    transition: border-color 0.15s;
  }
  .prod-gallery-thumb.active { border-color: var(--rojo); }

  /* ── BAN OVERLAY ── */
  .ban-overlay {
    position: fixed; inset: 0; z-index: 999;
    background: rgba(15,5,0,0.72); backdrop-filter: blur(6px);
    display: flex; align-items: center; justify-content: center; padding: 20px;
  }
  .ban-box {
    background: white; border-radius: 22px; max-width: 420px; width: 100%;
    padding: 32px 28px; text-align: center;
    box-shadow: 0 24px 70px rgba(0,0,0,0.4);
    animation: popIn 0.22s ease;
  }
  .ban-icon {
    width: 64px; height: 64px; border-radius: 18px;
    background: linear-gradient(135deg,#7B0000,#EF4444);
    display: flex; align-items: center; justify-content: center;
    font-size: 30px; margin: 0 auto 16px;
    box-shadow: 0 6px 20px rgba(239,68,68,0.35);
  }
  .ban-title { font-family: var(--font-head); font-weight: 900; font-size: 20px; color: var(--rojo); margin-bottom: 10px; }
  .ban-row {
    background: var(--gris); border-radius: 12px; padding: 12px 14px;
    text-align: left; margin-bottom: 10px; font-size: 13px;
  }
  .ban-row b { display: block; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: var(--muted); margin-bottom: 3px; font-weight: 800; }

  @media (max-width: 600px) {
    .nav { padding: 0 12px; gap: 10px; }
    .nav-brand { display: none; }
    .page { padding: 24px 14px 50px; }
    .grid-prod { grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); }
  }
`;

// ─── Datos ───────────────────────────────────────────────────────────
const CATS = ["Procesados","Materias primas","Plantas y flores","Artesanales","Otros"];
const CATS_INFO = [
  { nombre:"Procesados",      desc:"Dulces, galletas y chocolates", bg:"linear-gradient(135deg,#E8651A,#C0392B)", icon:"🍫" },
  { nombre:"Materias primas", desc:"Granos, harinas, por mayor",    bg:"linear-gradient(135deg,#C0392B,#8B1A0E)", icon:"🌾" },
  { nombre:"Plantas y flores",desc:"Viveros y ornamentales",        bg:"linear-gradient(135deg,#1A7A4A,#0D4A2A)", icon:"🌿" },
  { nombre:"Artesanales",     desc:"Textiles, cerámica y arte",     bg:"linear-gradient(135deg,#8B4513,#5C2D0A)", icon:"🎨" },
  { nombre:"Otros",           desc:"Variedad de productos locales", bg:"linear-gradient(135deg,#6B3FA0,#4A2070)", icon:"✨" },
];

const UBIGEO = {
  "Amazonas":{"Chachapoyas":["Chachapoyas","Asunción","Balsas","Cheto","Chiliquín","Chuquibamba","Granada","Huancas","La Jalca","Leimebamba","Levanto","Magdalena","Mariscal Castilla","Molinopampa","Montevideo","Olleros","Quinjalca","San Francisco de Daguas","San Isidro de Maino","Soloco","Sonche"],"Bagua":["Bagua","La Peca","Aramango","Copallin","El Parco","Imaza","Copallín"],"Bongará":["Jumbilla","Chisquilla","Churuja","Corosha","Cuispes","Florida","Jazán","Recta","San Carlos","Shipasbamba","Valera","Yambrasbamba"],"Utcubamba":["Bagua Grande","Cajaruro","Cumba","El Milagro","Jamalca","Lonya Grande","Yamón"]},
  "Áncash":{"Huaraz":["Huaraz","Cochabamba","Colcabamba","Huanchay","Independencia","Jangas","La Libertad","Llanganuco","Pampas","Paria","Tarica"],"Santa":["Chimbote","Cáceres del Perú","Coishco","Macate","Moro","Nepeña","Samanco","Santa","Nuevo Chimbote"],"Casma":["Casma","Buenavista Alta","Comandante Noel","Yaután"],"Huarmey":["Huarmey","Cochapetí","Huamba","Malvas","Pampas Chico"]},
  "Arequipa":{"Arequipa":["Arequipa","Alto Selva Alegre","Cayma","Cerro Colorado","Characato","Chiguata","Jacobo Hunter","José Luis Bustamante y Rivero","La Joya","Mariano Melgar","Miraflores","Mollebaya","Paucarpata","Pocsi","Polobaya","Quequeña","Sabandía","Sachaca","San Juan de Siguas","San Juan de Tarucani","Santa Isabel de Siguas","Santa Rita de Siguas","Socabaya","Tiabaya","Uchumayo","Vitor","Yanahuara","Yarabamba","Yura"],"Camaná":["Camaná","José María Quimper","Mariano Nicolás Valcárcel","Mariscal Cáceres","Nicolás de Piérola","Ocoña","Quilca","Samuel Pastor"],"Islay":["Mollendo","Cocachacra","Dean Valdivia","Islay","Mejía","Punta de Bombón"]},
  "Ayacucho":{"Huamanga":["Ayacucho","Acocro","Acos Vinchos","Carmen Alto","Chiara","Jesús Nazareno","Lucanas","Ocros","Pacaycasa","Quinua","San José de Ticllas","San Juan Bautista","Santiago de Pischa","Socos","Tambillo","Vinchos","Jesús de Nazareno"],"Huanta":["Huanta","Ayahuanco","Huamanguilla","Iguaín","Llochegua","Luricocha","Santillana","Sivia"],"La Mar":["San Miguel","Anco","Ayna","Chilcas","Chungui","Luis Carranza","Santa Rosa","Tambo","Samugari"]},
  "Cajamarca":{"Cajamarca":["Cajamarca","Asunción","Chetilla","Cospán","Encañada","Jesús","Llacanora","Los Baños del Inca","Magdalena","Matara","Namora","San Juan"],"Jaén":["Jaén","Bellavista","Chontali","Colasay","Huabal","Las Pirias","Pomahuaca","Pucara","Sallique","San Felipe","San José del Alto","Santa Rosa"],"Chota":["Chota","Anguia","Chadin","Chiguirip","Chimban","Choropampa","Cochabamba","Conchan","Huambos","Lajas","Llama","Miracosta","Paccha","Pion","Querocoto","San Juan de Licupis","Tacabamba","Tocmoche","Chalamarca"],"San Ignacio":["San Ignacio","Chirinos","Huarango","La Coipa","Namballe","San José de Lourdes","Tabaconas"]},
  "Callao":{"Callao":["Callao","Bellavista","Carmen de La Legua Reynoso","La Perla","La Punta","Ventanilla","Mi Perú"]},
  "Cusco":{"Cusco":["Cusco","Ccorca","Poroy","San Jerónimo","San Sebastián","Santiago","Saylla","Wanchaq"],"La Convención":["Santa Ana","Echarate","Huayopata","Maranura","Ocobamba","Quellouno","Kimbiri","Pichari","Vilcabamba","Inkawasi","Villa Virgen","Villa Kintiarina","Megantoni"],"Urubamba":["Urubamba","Chinchero","Huayllabamba","Machupicchu","Maras","Ollantaytambo","Yucay"],"Calca":["Calca","Coya","Lamay","Lares","Pisac","San Salvador","Taray","Yanatile"]},
  "Huánuco":{"Huánuco":["Huánuco","Amarilis","Chinchao","Churubamba","Margos","Quisqui","San Francisco de Cayran","San Pedro de Chaulan","Santa María del Valle","Yarumayo","Pillco Marca"],"Leoncio Prado":["Rupa-Rupa","Daniel Alomía Robles","Hermilio Valdizan","José Crespo y Castillo","Luyando","Mariano Dámaso Beraún","Pucayacu","Castillo Grande","Pueblo Nuevo","Santo Domingo de Anda"],"Puerto Inca":["Puerto Inca","Codo del Pozuzo","Honoria","Tournavista","Yuyapichis"]},
  "Ica":{"Ica":["Ica","La Tinguiña","Los Aquijes","Ocucaje","Pachacútec","Parcona","Pueblo Nuevo","Salas","San José de Los Molinos","San Juan Bautista","Santiago","Subtanjalla","Tate","Yauca del Rosario"],"Chincha":["Chincha Alta","Alto Larán","Chavin","Chincha Baja","El Carmen","Grocio Prado","Pueblo Nuevo","San Juan de Yanac","San Pedro de Huacarpana","Sunampe","Tambo de Mora"],"Pisco":["Pisco","Huancano","Humay","Independencia","Paracas","San Andrés","San Clemente","Túpac Amaru Inca"],"Nasca":["Nasca","Changuillo","El Ingenio","Marcona","Vista Alegre"]},
  "Junín":{"Huancayo":["Huancayo","Carhuacallanga","Chacapampa","Chicche","Chilca","Chongos Alto","Chupuro","Colca","Cullhuas","El Tambo","Huacrapuquio","Hualhuas","Huancan","Huasicancha","Huayucachi","Ingenio","Pariahuanca","Pilcomayo","Pucará","Quichuay","Quilcas","San Agustín","San Jerónimo de Tunán","Saño","Sapallanga","Sicaya","Santo Domingo de Acobamba","Viques"],"Chanchamayo":["Chanchamayo","Perené","Pichanaqui","San Luis de Shuaro","San Ramón","Vitoc"],"Satipo":["Satipo","Coviriali","Llaylla","Mazamari","Pampa Hermosa","Pangoa","Río Negro","Río Tambo","Vizcatan del Ene"],"Tarma":["Tarma","Acobamba","Huaricolca","Huasahuasi","La Unión","Palca","Palcamayo","San Pedro de Cajas","Tapo"]},
  "La Libertad":{"Trujillo":["Trujillo","El Porvenir","Florencia de Mora","Huanchaco","La Esperanza","Laredo","Moche","Poroto","Salaverry","Simbal","Victor Larco Herrera"],"Pacasmayo":["San Pedro de Lloc","Guadalupe","Jequetepeque","Pacasmayo","San José"],"Ascope":["Ascope","Chicama","Chocope","Magdalena de Cao","Paijan","Razuri","Santiago de Cao","Casa Grande"]},
  "Lambayeque":{"Chiclayo":["Chiclayo","Chongoyape","Eten","Eten Puerto","José Leonardo Ortiz","La Victoria","Lagunas","Monsefú","Nueva Arica","Oyotún","Picsi","Pimentel","Reque","Santa Rosa","Saña","Cayaltí","Pátapo","Pomalca","Pucalá","Tumán"],"Lambayeque":["Lambayeque","Chóchope","Íllimo","Jayanca","Mochumí","Mórrope","Motupe","Olmos","Pacora","Salas","San José","Túcume"],"Ferreñafe":["Ferreñafe","Cañaris","Incahuasi","Manuel Antonio Mesones Muro","Pitipo","Pueblo Nuevo"]},
  "Lima":{"Lima":["Lima","Ancón","Ate","Barranco","Breña","Carabayllo","Chaclacayo","Chorrillos","Cieneguilla","Comas","El Agustino","Independencia","Jesús María","La Molina","La Victoria","Lince","Los Olivos","Lurigancho","Lurín","Magdalena del Mar","Miraflores","Pachacámac","Pucusana","Pueblo Libre","Puente Piedra","Punta Hermosa","Punta Negra","Rímac","San Bartolo","San Borja","San Isidro","San Juan de Lurigancho","San Juan de Miraflores","San Luis","San Martín de Porres","San Miguel","Santa Anita","Santa María del Mar","Santa Rosa","Santiago de Surco","Surquillo","Villa El Salvador","Villa María del Triunfo"],"Cañete":["San Vicente de Cañete","Asia","Calango","Cerro Azul","Chilca","Coayllo","Imperial","Lunahuaná","Mala","Nuevo Imperial","Pacarán","Quilmaná","San Antonio","San Luis","Santa Cruz de Flores","Zúñiga"],"Huaral":["Huaral","Atavillos Alto","Atavillos Bajo","Aucallama","Chancay","Ihuarí","Lampián","Pacaraos","San Miguel de Acos","Santa Cruz de Andamarca","Sumbilca","Veintisiete de Noviembre"],"Barranca":["Barranca","Paramonga","Pativilca","Supe","Supe Puerto"]},
  "Loreto":{"Maynas":["Iquitos","Alto Nanay","Fernando Lores","Indiana","Las Amazonas","Mazan","Napo","Punchana","Torres Causana","Belén","San Juan Bautista"],"Alto Amazonas":["Yurimaguas","Balsapuerto","Jeberos","Lagunas","Santa Cruz","Teniente César López Rojas"],"Requena":["Requena","Alto Tapiche","Capelo","Emilio San Martín","Maquia","Puinahua","Saquena","Soplin","Tapiche","Jenaro Herrera","Yaquerana"]},
  "Madre de Dios":{"Tambopata":["Tambopata","Inambari","Las Piedras","Laberinto"],"Manu":["Manu","Fitzcarrald","Madre de Dios","Huepetuhe"],"Tahuamanu":["Iñapari","Iberia","Tahuamanu"]},
  "Moquegua":{"Mariscal Nieto":["Moquegua","Carumas","Cuchumbaya","Samegua","San Cristóbal","Torata"],"Ilo":["Ilo","El Algarrobal","Pacocha"],"General Sánchez Cerro":["Omate","Chojata","Coalaque","Ichuña","La Capilla","Lloque","Matalaque","Puquina","Quinistaquillas","Ubinas","Yunga"]},
  "Pasco":{"Pasco":["Chaupimarca","Huachón","Huariaca","Huayllay","Ninacaca","Pallanchacra","Paucartambo","San Francisco de Asís de Yarusyacán","Simón Bolívar","Ticlacayan","Tinyahuarco","Vicco","Yanacancha"],"Daniel Alcides Carrión":["Yanahuanca","Chacayan","Goyllarisquizga","Paucar","San Pedro de Pillao","Santa Ana de Tusi","Tapuc","Vilcabamba"],"Oxapampa":["Oxapampa","Chontabamba","Huancabamba","Palcazu","Pozuzo","Puerto Bermúdez","Villa Rica","Constitución"]},
  "Piura":{"Piura":["Piura","Castilla","Catacaos","Cura Mori","El Tallán","La Arena","La Unión","Las Lomas","Tambo Grande","Veintiséis de Octubre"],"Sullana":["Sullana","Bellavista","Ignacio Escudero","Lancones","Marcavelica","Miguel Checa","Querecotillo","Salitral"],"Talara":["Pariñas","El Alto","La Brea","Lobitos","Los Órganos","Mancora"],"Paita":["Paita","Amotape","Arenal","Colan","La Huaca","Tamarindo","Vichayal"],"Huancabamba":["Huancabamba","Canchaque","El Carmen de la Frontera","Huarmaca","Lalaquiz","San Miguel del Faique","Sondor","Sondorillo"],"Morropón":["Chulucanas","Buenos Aires","Chalaco","La Matanza","Morropón","Salitral","San Juan de Bigote","Santa Catalina de Mossa","Santo Domingo","Yamango"],"Ayabaca":["Ayabaca","Frias","Jilili","Lagunas","Montero","Pacaipampa","Paimas","Sapillica","Sicchez","Suyo"],"Sechura":["Sechura","Bellavista de la Unión","Bernal","Cristo Nos Valga","Vice","Rinconada Llicuar"]},
  "Puno":{"Puno":["Puno","Acora","Amantani","Atuncolla","Capachica","Chucuito","Coata","Huata","Mañazo","Paucarcolla","Pichacani","Platería","San Antonio","Tiquillaca","Vilque"],"San Román":["Juliaca","Cabana","Cabanillas","Caracoto","San Miguel"],"Melgar":["Ayaviri","Antauta","Cupi","Llalli","Macari","Nuñoa","Orurillo","Santa Rosa","Umachiri"],"El Collao":["Ilave","Capazo","Pilcuyo","Santa Rosa","Conduriri"],"Chucuito":["Juli","Desaguadero","Huacullani","Kelluyo","Pisacoma","Pomata","Zepita"],"Azángaro":["Azángaro","Achaya","Arapa","Asillo","Caminaca","Chupa","José Domingo Choquehuanca","Muñani","Potoni","Saman","San Anton","San José","San Juan de Salinas","Santiago de Pupuja","Tirapata"]},
  "San Martín":{"Moyobamba":["Moyobamba","Calzada","Habana","Jepelacio","Soritor","Yantalo"],"San Martín":["Tarapoto","Alberto Leveau","Cacatachi","Chazuta","Chipurana","El Porvenir","Huimbayoc","Juan Guerra","La Banda de Shilcayo","Morales","Papaplaya","San Antonio","Santa Rosa","Sauce","Shapaja"],"Tocache":["Tocache","Nuevo Progreso","Pólvora","Shunte","Uchiza"],"Bellavista":["Bellavista","Alto Biavo","Bajo Biavo","Huallaga","San Pablo","San Rafael"],"Rioja":["Rioja","Awajun","Elías Soplin Vargas","Nueva Cajamarca","Pardo Miguel","Posic","San Fernando","Yorongos","Yuracyacu"]},
  "Tacna":{"Tacna":["Tacna","Alto de La Alianza","Calana","Ciudad Nueva","Inclán","Pachia","Palca","Pocollay","Sama","Coronel Gregorio Albarracín Lanchipa"],"Tarata":["Tarata","Estique","Estique-Pampa","Sitajara","Susapaya","Tarucachi","Ticaco"],"Candarave":["Candarave","Cairani","Camilaca","Curibaya","Huanuara","Quilahuani"],"Jorge Basadre":["Locumba","Ilabaya","Ite"]},
  "Tumbes":{"Tumbes":["Tumbes","Corrales","La Cruz","Pampas de Hospital","San Jacinto","San Juan de la Virgen"],"Contralmirante Villar":["Zorritos","Casitas","Canoas de Punta Sal"],"Zarumilla":["Zarumilla","Aguas Verdes","Matapalo","Papayal"]},
  "Ucayali":{"Coronel Portillo":["Callería","Campoverde","Iparia","Masisea","Yarinacocha","Nueva Requena","Manantay"],"Padre Abad":["Padre Abad","Irazola","Curimaná","Neshuya","Alexander Von Humboldt"],"Atalaya":["Raymondi","Sepahua","Tahuania","Yurúa"],"Purús":["Purús"]},
};

// ─── Culqi helpers ────────────────────────────────────────────────────
function abrirPagoCulqi({ monto, descripcion, email, onSuccess }) {
  if (typeof window.Culqi === "undefined") {
    alert("Culqi no está disponible en este momento. Por favor intente más tarde.");
    return;
  }
  window.Culqi.publicKey = "YOUR_CULQI_PUBLIC_KEY";
  window.Culqi.settings({
    title: "TinkaMarket 🇵🇪",
    currency: "PEN",
    description: descripcion,
    amount: monto * 100,
  });
  window.Culqi.open();
  window.culqi = () => {
    if (window.Culqi.token) {
      onSuccess(window.Culqi.token);
      window.Culqi.close();
    } else {
      console.error("Error Culqi:", window.Culqi.error);
    }
  };
}

// ─── Sonidos ──────────────────────────────────────────────────────────
function playSound(type) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === "click") {
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc.start(); osc.stop(ctx.currentTime + 0.15);
    } else if (type === "success") {
      [523.25, 659.25, 783.99].forEach((freq, i) => {
        const o2 = ctx.createOscillator();
        const g2 = ctx.createGain();
        o2.connect(g2); g2.connect(ctx.destination);
        o2.frequency.value = freq;
        g2.gain.setValueAtTime(0, ctx.currentTime + i * 0.12);
        g2.gain.linearRampToValueAtTime(0.15, ctx.currentTime + i * 0.12 + 0.05);
        g2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.2);
        o2.start(ctx.currentTime + i * 0.12);
        o2.stop(ctx.currentTime + i * 0.12 + 0.25);
      });
    } else if (type === "error") {
      osc.frequency.setValueAtTime(200, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.25);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.28);
      osc.start(); osc.stop(ctx.currentTime + 0.28);
    } else if (type === "like") {
      [880, 1108.73].forEach((freq, i) => {
        const o2 = ctx.createOscillator();
        const g2 = ctx.createGain();
        o2.connect(g2); g2.connect(ctx.destination);
        o2.type = "sine"; o2.frequency.value = freq;
        g2.gain.setValueAtTime(0, ctx.currentTime + i * 0.08);
        g2.gain.linearRampToValueAtTime(0.12, ctx.currentTime + i * 0.08 + 0.04);
        g2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.08 + 0.18);
        o2.start(ctx.currentTime + i * 0.08);
        o2.stop(ctx.currentTime + i * 0.08 + 0.2);
      });
    } else if (type === "open") {
      osc.frequency.setValueAtTime(300, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
      osc.start(); osc.stop(ctx.currentTime + 0.18);
    } else if (type === "close") {
      osc.frequency.setValueAtTime(500, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(250, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.14);
      osc.start(); osc.stop(ctx.currentTime + 0.14);
    }
  } catch (e) {
    // Audio no disponible en este entorno, ignorar
  }
}

// ─── Sub-componente: imagen de producto con galería ───────────────────
function ProdImgViewer({ fotos, fallbackIcon = "📦" }) {
  const [idx, setIdx] = useState(0);
  if (!fotos || fotos.length === 0) {
    return (
      <div className="prod-img">
        <span>{fallbackIcon}</span>
      </div>
    );
  }
  return (
    <div style={{ display:"flex", flexDirection:"column" }}>
      <div className="prod-img">
        <img src={fotos[idx]} alt="producto" />
      </div>
      {fotos.length > 1 && (
        <div className="prod-gallery" style={{ padding:"6px 10px 0" }}>
          {fotos.map((f, i) => (
            <img
              key={i}
              src={f}
              alt={`foto-${i}`}
              className={`prod-gallery-thumb ${i === idx ? "active" : ""}`}
              onClick={() => setIdx(i)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────
export default function App() {
  const [pantalla, setPantalla] = useState("inicio");
  const [usuario, setUsuario] = useState(null);
  const [perfilDB, setPerfilDB] = useState(null);
  const [baneado, setBaneado] = useState(null); // objeto usuario baneado (o null)
  const [menuOpen, setMenuOpen] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [filtroCat, setFiltroCat] = useState("Todos");
  const [productos, setProductos] = useState([]);
  const [tiendas, setTiendas] = useState([]);
  const [miTienda, setMiTienda] = useState(null);
  const [carrito, setCarrito] = useState([]);
  const [tiendaCarrito, setTiendaCarrito] = useState(null);
  const [modalVaciar, setModalVaciar] = useState(null);
  const [panelProducto, setPanelProducto] = useState(null);
  const [panelCantidad, setPanelCantidad] = useState(1);
  const [agregandoPanel, setAgregandoPanel] = useState(false);
  const [mostrarPerfil, setMostrarPerfil] = useState(false);
  const [mostrarFormProd, setMostrarFormProd] = useState(false);

  const [perfilForm, setPerfilForm] = useState({ nombre:"", apellido:"", departamento:"", provincia:"", distrito:"" });
  const [tiendaForm, setTiendaForm] = useState({ nombre:"", whatsapp:"", departamento:"", provincia:"", distrito:"", direccion:"", descripcion:"" });
  const [tiendaFoto, setTiendaFoto] = useState(null);
  const [tiendaFotoPreview, setTiendaFotoPreview] = useState(null);
  const [prodForm, setProdForm] = useState({ nombre:"", precio:"", cantidad:"", descripcion:"", categoria:"Procesados" });
  const [prodFotos, setProdFotos] = useState([]);
  const [prodFotosPrev, setProdFotosPrev] = useState([]);
  const [misLikes, setMisLikes] = useState([]);
  const [reporteForm, setReporteForm] = useState({ tipo:"reporte_usuario", id_reportado:"", detalle:"" });

  const [msg, setMsg] = useState("");
  const [guardando, setGuardando] = useState(false);
  const carruselRef = useRef(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) iniciarSesion(session.user);
    });
    supabase.auth.onAuthStateChange((_e, session) => {
      if (session?.user) iniciarSesion(session.user);
      else { setUsuario(null); setPerfilDB(null); setMiTienda(null); setMostrarPerfil(false); setBaneado(null); }
    });
    cargarProductos();
    cargarTiendas();
  }, []);

  async function iniciarSesion(user) {
    setUsuario(user);
    const { data: perfil } = await supabase.from("usuarios").select("*").eq("email", user.email).single();

    // Si el usuario está baneado, se bloquea el acceso al resto de la app
    // hasta que se desbanee (o mientras el bloqueo esté vigente).
    if (perfil?.baneado) {
      setPerfilDB(perfil);
      setBaneado(perfil);
      setMostrarPerfil(false);
      return;
    }
    setBaneado(null);

    if (!perfil || !perfil.perfil_completo) {
      setMostrarPerfil(true); setPerfilDB(perfil);
    } else {
      setPerfilDB(perfil); setMostrarPerfil(false); cargarMiTienda(user.id); cargarMisLikes();
      if (perfil.departamento) {
        setTiendaForm(f => ({
          ...f,
          departamento: perfil.departamento || "",
          provincia:    perfil.provincia    || "",
          distrito:     perfil.distrito     || "",
        }));
      }
    }
  }

  async function guardarPerfil() {
    if (!perfilForm.nombre || !perfilForm.apellido || !perfilForm.departamento || !perfilForm.provincia || !perfilForm.distrito) {
      setMsg("Completa todos los campos."); return;
    }
    setGuardando(true);
    const { count } = await supabase.from("usuarios").select("*", { count:"exact", head:true });
    const nuevoId = String((count || 0) + 1).padStart(9, "0");
    const { data, error } = await supabase.from("usuarios").upsert({
      email: usuario.email, nombre: perfilForm.nombre, apellidos: perfilForm.apellido,
      usuario_id: nuevoId, departamento: perfilForm.departamento,
      provincia: perfilForm.provincia, distrito: perfilForm.distrito, perfil_completo: true,
    }, { onConflict:"email" }).select().single();
    if (error) setMsg("Error al guardar. Intenta de nuevo.");
    else { setPerfilDB(data); setMostrarPerfil(false); cargarMiTienda(usuario.id); setMsg(""); }
    setGuardando(false);
  }

  // Trae solo productos cuya tienda esté "activa" o "revision".
  // Así, si la tienda dueña está suspendida, sus productos dejan de
  // aparecer en el catálogo general aunque el registro siga existiendo.
  async function cargarProductos(cat = null) {
    let q = supabase
      .from("productos")
      .select("*, tiendas!inner(estado)")
      .in("tiendas.estado", ["activa", "revision"])
      .order("likes", { ascending:false });
    if (cat && cat !== "Todos") q = q.eq("categoria", cat);
    const { data, error } = await q;
    if (error) { console.error("Error cargando productos:", error); setProductos([]); return; }
    setProductos(data || []);
  }

  // Incluye "revision" además de "activa" para que las tiendas en
  // revisión también aparezcan (se distinguen con el badge 👁️ en su perfil).
  async function cargarTiendas() {
    const { data } = await supabase.from("tiendas").select("*").in("estado", ["activa", "revision"]);
    setTiendas(data || []);
  }

  async function cargarMiTienda(uid) {
    const { data } = await supabase.from("tiendas").select("*").eq("usuario_id", uid).single();
    setMiTienda(data || null);
  }

  async function buscar() {
    if (!busqueda.trim()) return;
    const cat = filtroCat === "Todos" ? null : filtroCat;
    let qP = supabase
      .from("productos")
      .select("*, tiendas!inner(estado)")
      .in("tiendas.estado", ["activa", "revision"])
      .ilike("nombre", `%${busqueda}%`)
      .order("likes", { ascending:false });
    if (cat) qP = qP.eq("categoria", cat);
    const qT = supabase.from("tiendas").select("*").in("estado", ["activa","revision"]).ilike("nombre", `%${busqueda}%`);
    const [{ data:p }, { data:t }] = await Promise.all([qP, qT]);
    setProductos(p || []); setTiendas(t || []); setPantalla("busqueda");
  }

  async function login() {
    await supabase.auth.signInWithOAuth({ provider:"google", options:{ redirectTo: window.location.origin } });
  }

  async function logout() {
    await supabase.auth.signOut();
    setUsuario(null); setPerfilDB(null); setMiTienda(null);
    setCarrito([]); setTiendaCarrito(null); setMostrarPerfil(false);
    setBaneado(null);
    setPantalla("inicio"); setMenuOpen(false);
  }

  async function crearTienda() {
    if (!tiendaForm.nombre || !tiendaForm.whatsapp || !tiendaForm.departamento || !tiendaForm.provincia || !tiendaForm.distrito) {
      playSound("error"); setMsg("Completa los campos obligatorios."); return;
    }
    setGuardando(true);
    let foto_url = null;
    if (tiendaFoto) {
      const ext = tiendaFoto.name.split(".").pop();
      const path = `tiendas/${usuario.id}_${Date.now()}.${ext}`;
      const { error:upErr } = await supabase.storage.from("fotos").upload(path, tiendaFoto);
      if (!upErr) {
        const { data:urlData } = supabase.storage.from("fotos").getPublicUrl(path);
        foto_url = urlData.publicUrl;
      }
    }
    const { data:{ user: authUser } } = await supabase.auth.getUser();
    const { data, error } = await supabase.from("tiendas").insert({
      nombre: tiendaForm.nombre, whatsapp: tiendaForm.whatsapp,
      departamento: tiendaForm.departamento, provincia: tiendaForm.provincia,
      distrito: tiendaForm.distrito, direccion_exacta: tiendaForm.direccion,
      descripcion: tiendaForm.descripcion, usuario_id: authUser.id, foto_url, estado:"activa",
      ubicacion: `${tiendaForm.distrito}, ${tiendaForm.provincia}, ${tiendaForm.departamento}`,
    }).select().single();
    if (error) { playSound("error"); console.error("Error tienda:", error); setMsg("Error: " + error.message); }
    else { playSound("success"); setMiTienda(data); setMsg("¡Tienda creada exitosamente!"); cargarTiendas(); }
    setGuardando(false);
  }

  async function publicarProducto() {
    // Bloqueo defensivo: si la tienda está suspendida no debe poder publicar
    // (además de que el formulario ya está oculto en la UI en modo solo-lectura).
    if (miTienda?.estado === "suspendida") {
      playSound("error");
      setMsg("Tu tienda está suspendida. No puedes publicar productos mientras dure la suspensión.");
      return;
    }
    if (!prodForm.nombre || !prodForm.precio || !prodForm.cantidad) {
      playSound("error"); setMsg("Completa los campos obligatorios."); return;
    }
    setGuardando(true);
    const fotos_urls = [];
    for (const foto of prodFotos.slice(0,4)) {
      const ext = foto.name.split(".").pop();
      const path = `productos/${miTienda.id}_${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: upErr } = await supabase.storage.from("fotos").upload(path, foto);
      if (!upErr) {
        const { data: urlData } = supabase.storage.from("fotos").getPublicUrl(path);
        fotos_urls.push(urlData.publicUrl);
      }
    }
    const { error } = await supabase.from("productos").insert({
      tienda_id: miTienda.id,
      nombre: prodForm.nombre.toUpperCase(),
      precio: parseFloat(prodForm.precio), cantidad: parseInt(prodForm.cantidad),
      descripcion: prodForm.descripcion, categoria: prodForm.categoria, likes:0,
      fotos: fotos_urls,
    });
    if (error) { playSound("error"); setMsg("Error al publicar."); }
    else {
      playSound("success");
      setMsg("¡Producto publicado!");
      setMostrarFormProd(false);
      setProdForm({ nombre:"", precio:"", cantidad:"", descripcion:"", categoria:"Procesados" });
      setProdFotos([]); setProdFotosPrev([]);
      cargarProductos();
    }
    setGuardando(false);
  }

  async function cargarMisLikes() {
    if (!usuario) return;
    const { data } = await supabase.from("likes").select("producto_id").eq("usuario_id", usuario.id);
    setMisLikes((data || []).map(l => l.producto_id));
  }

  async function darLike(prod) {
    if (!usuario) { login(); return; }
    if (misLikes.includes(prod.id)) return;
    playSound("like");
    const { error } = await supabase.from("likes").insert({ usuario_id: usuario.id, producto_id: prod.id });
    if (!error) {
      await supabase.from("productos").update({ likes: prod.likes + 1 }).eq("id", prod.id);
      setMisLikes(l => [...l, prod.id]);
      cargarProductos();
    }
  }

  // Busca la tienda de un producto: primero en lo que ya tenemos cargado en memoria,
  // y si no está ahí (por ejemplo tras una búsqueda que filtró la lista de tiendas),
  // la trae directamente de la base de datos para no fallar en silencio.
  async function obtenerTienda(tiendaId) {
    const enCache = tiendas.find(x => x.id === tiendaId);
    if (enCache) return enCache;
    const { data } = await supabase.from("tiendas").select("*").eq("id", tiendaId).single();
    return data || null;
  }

  function agregarCarrito(prod, tienda, cantidad = 1) {
    if (tiendaCarrito && tiendaCarrito.id !== tienda.id) { setModalVaciar({ prod, tienda, cantidad }); return; }
    setCarrito(c => {
      const idx = c.findIndex(item => item.id === prod.id);
      if (idx >= 0) {
        const copia = [...c];
        copia[idx] = { ...copia[idx], cantidadCarrito: copia[idx].cantidadCarrito + cantidad };
        return copia;
      }
      return [...c, { ...prod, cantidadCarrito: cantidad }];
    });
    setTiendaCarrito(tienda);
  }

  function vaciarYAgregar(prod, tienda, cantidad = 1) {
    setCarrito([{ ...prod, cantidadCarrito: cantidad }]); setTiendaCarrito(tienda); setModalVaciar(null);
  }

  // Cambia la cantidad de un producto ya en el carrito. Si la nueva
  // cantidad llega a 0 (o menos), el producto se elimina del carrito.
  function actualizarCantidadCarrito(prodId, nuevaCantidad) {
    if (nuevaCantidad <= 0) { eliminarDelCarrito(prodId); return; }
    playSound("click");
    setCarrito(c => c.map(item =>
      item.id === prodId ? { ...item, cantidadCarrito: nuevaCantidad } : item
    ));
  }

  // Elimina un producto del carrito. Si era el último, también se
  // limpia la tienda asociada al carrito para permitir comprar en otra.
  function eliminarDelCarrito(prodId) {
    playSound("close");
    setCarrito(c => {
      const nuevo = c.filter(item => item.id !== prodId);
      if (nuevo.length === 0) setTiendaCarrito(null);
      return nuevo;
    });
  }

  // Abre el panel de "agregar al carrito" con foto, nombre, descripción y selector de cantidad.
  function abrirPanelCarrito(prod) {
    if (!usuario) { login(); return; }
    playSound("open");
    setPanelProducto(prod);
    setPanelCantidad(1);
  }

  function cerrarPanelCarrito() {
    playSound("close");
    setPanelProducto(null);
  }

  async function confirmarAgregarCarrito() {
    if (!panelProducto) return;
    setAgregandoPanel(true);
    const t = await obtenerTienda(panelProducto.tienda_id);
    if (!t) {
      playSound("error");
      setMsg("No se pudo encontrar la tienda de este producto. Intenta de nuevo.");
      setAgregandoPanel(false);
      return;
    }
    agregarCarrito(panelProducto, t, panelCantidad);
    playSound("success");
    setAgregandoPanel(false);
    setPanelProducto(null);
  }

  async function verWhatsApp(tienda) {
    if (!usuario) { login(); return; }
    if (perfilDB?.id) await supabase.from("vistas_whatsapp").insert({ tienda_id: tienda.id, comprador_id: perfilDB.id });
    window.open(`https://wa.me/51${tienda.whatsapp}`, "_blank");
  }

  async function comprarWhatsApp() {
    if (!tiendaCarrito || !usuario) return;
    if (perfilDB?.id) await supabase.from("vistas_whatsapp").insert({ tienda_id: tiendaCarrito.id, comprador_id: perfilDB.id });
    const lista = carrito.map(p => `- ${p.nombre} x${p.cantidadCarrito}: S/ ${(parseFloat(p.precio) * p.cantidadCarrito).toFixed(2)}`).join("\n");
    const total = carrito.reduce((s, p) => s + parseFloat(p.precio) * p.cantidadCarrito, 0);
    const nombre = perfilDB ? `${perfilDB.nombre} ${perfilDB.apellidos || ''}`.trim() : (usuario.user_metadata?.full_name || "Cliente");
    const idUsuario = perfilDB?.usuario_id || "--------";
    const texto = `Hola ${tiendaCarrito.nombre}, soy ${nombre} (ID: ${idUsuario}). Quiero comprar:\n${lista}\nTotal: S/ ${total.toFixed(2)}`;
    window.open(`https://wa.me/51${tiendaCarrito.whatsapp}?text=${encodeURIComponent(texto)}`, "_blank");
  }

  async function enviarReporte() {
    if (!usuario) { login(); return; }
    if (!reporteForm.detalle) { setMsg("Describe el problema."); return; }
    setGuardando(true);
    await supabase.from("reportes").insert({
      reportado_por: perfilDB?.id || usuario.id, tipo: reporteForm.tipo,
      motivo: `ID reportado: ${reporteForm.id_reportado || "no especificado"} | ${reporteForm.detalle}`,
      referencia_id: perfilDB?.id || usuario.id,
    });
    setMsg("Reporte enviado. El equipo lo revisará pronto.");
    setReporteForm({ tipo:"reporte_usuario", id_reportado:"", detalle:"" });
    setGuardando(false);
  }

  function pagarTienda(monto, descripcion) {
    if (!usuario) { login(); return; }
    abrirPagoCulqi({
      monto, descripcion, email: usuario.email,
      onSuccess: async (token) => {
        console.log("Token Culqi recibido:", token.id);
        setMsg("¡Pago procesado! Tu tienda será activada pronto.");
      },
    });
  }

  const ir = (p) => { setPantalla(p); setMenuOpen(false); setMsg(""); window.scrollTo(0,0); };
  const deps = Object.keys(UBIGEO).sort();
  const provsDisp = tiendaForm.departamento ? Object.keys(UBIGEO[tiendaForm.departamento] || {}).sort() : [];
  const distDisp = (tiendaForm.departamento && tiendaForm.provincia) ? (UBIGEO[tiendaForm.departamento]?.[tiendaForm.provincia] || []).sort() : [];
  const provsPerfilDisp = perfilForm.departamento ? Object.keys(UBIGEO[perfilForm.departamento] || {}).sort() : [];
  const distPerfilDisp = (perfilForm.departamento && perfilForm.provincia) ? (UBIGEO[perfilForm.departamento]?.[perfilForm.provincia] || []).sort() : [];

  // ── Helper: primera foto de producto ──────────────────────────────
  const firstFoto = (p) => p.fotos && p.fotos.length > 0 ? p.fotos[0] : null;

  const fechaBan = (d) => d
    ? new Date(d).toLocaleDateString("es-PE", { day:"2-digit", month:"long", year:"numeric" })
    : "—";

  // ── OVERLAY DE CUENTA BANEADA ──────────────────────────────────────
  if (baneado) return (
    <div className="ban-overlay">
      <style>{CSS}</style>
      <div className="ban-box">
        <div className="ban-icon">🚫</div>
        <p className="ban-title">Cuenta suspendida</p>
        <div className="ban-row">
          <b>Motivo</b>
          {baneado.motivo_baneo || "No especificado"}
        </div>
        <div className="ban-row">
          <b>Duración</b>
          {baneado.baneo_hasta ? `Suspendida hasta el ${fechaBan(baneado.baneo_hasta)}` : "Suspensión permanente"}
        </div>
        {baneado.multa_reactivacion ? (
          <div className="ban-row">
            <b>Monto a pagar para reactivar</b>
            S/ {Number(baneado.multa_reactivacion).toFixed(2)}
          </div>
        ) : null}
        <p style={{ fontSize:12, color:"var(--muted)", margin:"14px 0 18px", lineHeight:1.6 }}>
          Si crees que esto es un error, contacta a soporte de TinkaMarket.
        </p>
        <button className="btn-secondary" style={{ marginBottom:0 }} onClick={logout}>Cerrar sesión</button>
      </div>
    </div>
  );

  // ── MODAL PERFIL ─────────────────────────────────────────────────
  if (mostrarPerfil && usuario) return (
    <div className="perfil-modal">
      <style>{CSS}</style>
      <div className="form-card" style={{ maxWidth:460 }}>
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <img src="/logo.png" alt="TinkaMarket" style={{ height:68, objectFit:"contain", marginBottom:14 }}
            onError={e => e.target.style.display="none"} />
          <h2 style={{ fontFamily:"var(--font-head)", fontWeight:900, fontSize:22, marginBottom:6, color:"var(--cafe)" }}>¡Bienvenido a TinkaMarket!</h2>
          <p style={{ color:"var(--muted)", fontSize:14 }}>Completa tu perfil para continuar 🇵🇪</p>
        </div>
        <input className="inp" placeholder="Nombres *" value={perfilForm.nombre} onChange={e => setPerfilForm({...perfilForm, nombre:e.target.value})} />
        <input className="inp" placeholder="Apellidos *" value={perfilForm.apellido} onChange={e => setPerfilForm({...perfilForm, apellido:e.target.value})} />
        <select className="inp" value={perfilForm.departamento} onChange={e => setPerfilForm({...perfilForm, departamento:e.target.value, provincia:"", distrito:""})}>
          <option value="">— Selecciona tu departamento *</option>
          {deps.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <select className="inp" value={perfilForm.provincia} onChange={e => setPerfilForm({...perfilForm, provincia:e.target.value, distrito:""})} disabled={!perfilForm.departamento}>
          <option value="">— Selecciona tu provincia *</option>
          {provsPerfilDisp.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
        <select className="inp" value={perfilForm.distrito} onChange={e => setPerfilForm({...perfilForm, distrito:e.target.value})} disabled={!perfilForm.provincia}>
          <option value="">— Selecciona tu distrito *</option>
          {distPerfilDisp.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        {msg && <p className="msg-err">{msg}</p>}
        <button className="btn-primary" onClick={guardarPerfil} disabled={guardando}>{guardando ? "Guardando..." : "Continuar →"}</button>
      </div>
    </div>
  );

  // ── APP PRINCIPAL ─────────────────────────────────────────────────
  return (
    <div style={{ fontFamily:"var(--font-body)", minHeight:"100vh", background:"var(--crema)", width:"100%", overflowX:"hidden" }}>
      <style>{CSS}</style>

      {/* NAVBAR */}
      <nav className="nav">
        <div className="nav-logo" onClick={() => { ir("inicio"); cargarProductos(); cargarTiendas(); setBusqueda(""); }}>
          <img src="/logo.png" alt="TinkaMarket" className="nav-logo-img" onError={e => e.target.style.display="none"} />
          <span className="nav-brand">TinkaMarket</span>
        </div>
        <div className="search-wrap">
          <input className="search-inp" value={busqueda} onChange={e => setBusqueda(e.target.value)}
            onKeyDown={e => e.key==="Enter" && buscar()} placeholder="Buscar productos, tiendas..." />
          <button className="search-btn" onClick={buscar}>🔍</button>
        </div>
        <div className="nav-actions">
          {usuario
            ? <button className="nav-btn" onClick={() => ir("carrito")}>🛒{carrito.length > 0 ? ` ${carrito.reduce((s,p)=>s+p.cantidadCarrito,0)}` : ""}</button>
            : <button className="nav-btn" onClick={login}>Iniciar sesión</button>
          }
          <button className="nav-btn" style={{ padding:"7px 12px" }} onClick={() => setMenuOpen(true)}>☰</button>
        </div>
      </nav>

      {/* HERO */}
      {pantalla === "inicio" && (
        <div className="hero">
          <div className="hero-badge">🇵🇪 Solo para el Perú</div>
          <h1 className="hero-title">
            Lo nuestro.<br />
            <span className="oro">De cada rincón </span>
            <span className="verde">a tu casa.</span>
          </h1>
          <p className="hero-sub">El marketplace de productos peruanos auténticos</p>
          {productos.length > 0 && (
            <div className="hero-carousel" ref={carruselRef}>
              {productos.map(p => (
                <div key={p.id} className="hero-card">
                  {firstFoto(p) && (
                    <img src={firstFoto(p)} alt={p.nombre} className="hero-card-img" />
                  )}
                  <p className="hero-card-name">{p.nombre}</p>
                  <p className="hero-card-price">S/ {p.precio}</p>
                  <div className="hero-card-foot">
                    <p className="hero-card-likes">❤️ {p.likes} likes</p>
                    <button className="hero-card-buy" title="Agregar al carrito" onClick={() => abrirPanelCarrito(p)}>🛒</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* PÁGINAS */}
      <div className="page">

        {/* ── INICIO ── */}
        {pantalla === "inicio" && <>
          <p className="sec-title">Explora por categoría</p>
          <div className="grid grid-cat">
            {CATS_INFO.map((c, i) => (
              <div key={i} className="cat-card" style={{ background: c.bg }}
                onClick={() => { cargarProductos(c.nombre); ir("categoria_"+c.nombre); }}>
                <div style={{ fontSize:28, marginBottom:8 }}>{c.icon}</div>
                <p className="cat-card-name">{c.nombre}</p>
                <p className="cat-card-desc">{c.desc}</p>
              </div>
            ))}
          </div>

          <p className="sec-title">Productos más likeados</p>
          {productos.length === 0
            ? <div className="empty"><div className="empty-icon">📦</div><p className="empty-txt">Aún no hay productos publicados</p></div>
            : <div className="grid grid-prod">
              {productos.map(p => (
                <div key={p.id} className="prod-card">
                  <ProdImgViewer fotos={p.fotos} />
                  <div className="prod-body">
                    <p className="prod-name">{p.nombre}</p>
                    <p className="prod-price">S/ {p.precio}</p>
                    <div className="prod-foot">
                      <span className="prod-likes">❤️ {p.likes}</span>
                      <button className="btn-like" onClick={() => darLike(p)}
                        style={{ color: misLikes.includes(p.id) ? "var(--rojo)" : "var(--muted)", borderColor: misLikes.includes(p.id) ? "var(--rojo)" : "#eee" }}
                        disabled={misLikes.includes(p.id)}>
                        {misLikes.includes(p.id) ? "❤️ Likeado" : "Me gusta"}
                      </button>
                    </div>
                    <button className="btn-primary" style={{ marginTop:8, marginBottom:0, fontSize:13, padding:"9px 0" }}
                      onClick={() => abrirPanelCarrito(p)}>
                      Agregar al carrito
                    </button>
                  </div>
                </div>
              ))}
            </div>
          }

          <p className="sec-title">Tiendas activas</p>
          {tiendas.length === 0
            ? <div className="empty"><div className="empty-icon">🏪</div><p className="empty-txt">Aún no hay tiendas activas</p></div>
            : <div className="grid grid-tienda">
              {tiendas.map(t => (
                <div key={t.id} className="tienda-card" onClick={() => { setPantalla("tienda_"+t.id); window.scrollTo(0,0); }}>
                  {t.foto_url
                    ? <img src={t.foto_url} alt={t.nombre} className="tienda-avatar" />
                    : <div className="tienda-avatar-letter">{t.nombre[0]}</div>
                  }
                  <div>
                    <p className="tienda-name">{t.nombre} {t.estado === "revision" && <span title="En revisión">👁️</span>}</p>
                    <p className="tienda-loc">📍 {t.distrito}, {t.provincia}</p>
                  </div>
                </div>
              ))}
            </div>
          }
        </>}

        {/* ── CATEGORÍA ── */}
        {pantalla.startsWith("categoria_") && (() => {
          const catNom = pantalla.replace("categoria_","");
          const info = CATS_INFO.find(c => c.nombre === catNom);
          return <>
            <div className="back-row">
              <button className="btn-back" onClick={() => { ir("inicio"); cargarProductos(); }}>←</button>
              <p className="sec-title" style={{ margin:0 }}>{info?.icon} {catNom}</p>
            </div>
            {productos.length === 0
              ? <div className="empty"><div className="empty-icon">{info?.icon || "📦"}</div><p className="empty-txt">Aún no hay productos en esta categoría</p></div>
              : <div className="grid grid-prod">
                {productos.map(p => (
                  <div key={p.id} className="prod-card">
                    <ProdImgViewer fotos={p.fotos} />
                    <div className="prod-body">
                      <p className="prod-name">{p.nombre}</p>
                      <p className="prod-price">S/ {p.precio}</p>
                      <div className="prod-foot">
                        <span className="prod-likes">❤️ {p.likes}</span>
                        <button className="btn-like" onClick={() => darLike(p)}
                          style={{ color: misLikes.includes(p.id) ? "var(--rojo)" : "var(--muted)", borderColor: misLikes.includes(p.id) ? "var(--rojo)" : "#eee" }}
                          disabled={misLikes.includes(p.id)}>
                          {misLikes.includes(p.id) ? "❤️ Likeado" : "Me gusta"}
                        </button>
                      </div>
                      <button className="btn-primary" style={{ marginTop:8, marginBottom:0, fontSize:13, padding:"9px 0" }}
                        onClick={() => abrirPanelCarrito(p)}>
                        Agregar al carrito
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            }
          </>;
        })()}

        {/* ── PERFIL TIENDA ── */}
        {pantalla.startsWith("tienda_") && (() => {
          const tid = pantalla.replace("tienda_","");
          const t = tiendas.find(x => x.id === tid);
          if (!t) return <div className="empty"><p className="empty-txt">Tienda no encontrada</p></div>;
          const prodsTienda = productos.filter(p => p.tienda_id === tid);
          return <>
            <div className="back-row">
              <button className="btn-back" onClick={() => ir("inicio")}>←</button>
              <p className="sec-title" style={{ margin:0 }}>{t.nombre} {t.estado === "revision" && <span title="En revisión">👁️</span>}</p>
            </div>
            <div className="tienda-info-card">
              <div className="tienda-info-head">
                {t.foto_url
                  ? <img src={t.foto_url} alt={t.nombre} className="tienda-big-avatar" />
                  : <div className="tienda-big-letter">{t.nombre[0]}</div>
                }
                <div>
                  <p style={{ fontFamily:"var(--font-head)", fontWeight:800, fontSize:18, marginBottom:5 }}>{t.nombre} {t.estado === "revision" && <span title="En revisión">👁️</span>}</p>
                  <p style={{ fontSize:13, color:"var(--muted)", marginBottom:3 }}>📍 {t.distrito}, {t.provincia}, {t.departamento}</p>
                  {t.direccion_exacta && <p style={{ fontSize:13, color:"var(--muted)", marginBottom:3 }}>🏠 {t.direccion_exacta}</p>}
                  {t.descripcion && <p style={{ fontSize:13, color:"#555", marginTop:6 }}>{t.descripcion}</p>}
                </div>
              </div>
              <button className="btn-wa" onClick={() => verWhatsApp(t)}>📲 Contactar por WhatsApp</button>
              <p className="notice">🔒 Al contactar se registra tu ID para seguridad de ambas partes</p>
            </div>
            {prodsTienda.length === 0
              ? <div className="empty"><div className="empty-icon">📦</div><p className="empty-txt">Esta tienda aún no tiene productos</p></div>
              : <div className="grid grid-prod">
                {prodsTienda.map(p => (
                  <div key={p.id} className="prod-card">
                    <ProdImgViewer fotos={p.fotos} />
                    <div className="prod-body">
                      <p className="prod-name">{p.nombre}</p>
                      <p className="prod-price">S/ {p.precio}</p>
                      {p.descripcion && <p style={{ fontSize:12, color:"var(--muted)", lineHeight:1.5 }}>{p.descripcion}</p>}
                      <button className="btn-primary" style={{ marginTop:8, marginBottom:0, fontSize:13, padding:"9px 0" }}
                        onClick={() => abrirPanelCarrito(p)}>
                        Agregar al carrito
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            }
          </>;
        })()}

        {/* ── BÚSQUEDA ── */}
        {pantalla === "busqueda" && <>
          <div className="back-row">
            <button className="btn-back" onClick={() => { ir("inicio"); cargarProductos(); cargarTiendas(); setBusqueda(""); }}>←</button>
            <p className="sec-title" style={{ margin:0 }}>Resultados de búsqueda</p>
          </div>
          <div style={{ marginBottom:18 }}>
            {["Todos",...CATS].map(f => (
              <span key={f} className={`tag ${filtroCat===f?"tag-active":"tag-inactive"}`}
                onClick={() => { setFiltroCat(f); cargarProductos(f==="Todos"?null:f); }}>{f}</span>
            ))}
          </div>
          {productos.length===0 && tiendas.length===0
            ? <div className="empty"><div className="empty-icon">🔍</div><p className="empty-txt">No se encontró ningún resultado</p></div>
            : <>
              {productos.length > 0 && <div className="grid grid-prod">
                {productos.map(p => (
                  <div key={p.id} className="prod-card">
                    <ProdImgViewer fotos={p.fotos} />
                    <div className="prod-body">
                      <p className="prod-name">{p.nombre}</p>
                      <p className="prod-price">S/ {p.precio}</p>
                      <button className="btn-primary" style={{ marginTop:8, marginBottom:0, fontSize:13, padding:"9px 0" }}
                        onClick={() => abrirPanelCarrito(p)}>
                        Agregar al carrito
                      </button>
                    </div>
                  </div>
                ))}
              </div>}
              {tiendas.length > 0 && <div className="grid grid-tienda">
                {tiendas.map(t => (
                  <div key={t.id} className="tienda-card" onClick={() => { setPantalla("tienda_"+t.id); window.scrollTo(0,0); }}>
                    {t.foto_url
                      ? <img src={t.foto_url} alt={t.nombre} className="tienda-avatar" />
                      : <div className="tienda-avatar-letter">{t.nombre[0]}</div>
                    }
                    <div><p className="tienda-name">{t.nombre} {t.estado === "revision" && <span title="En revisión">👁️</span>}</p><p className="tienda-loc">📍 {t.distrito}, {t.provincia}</p></div>
                  </div>
                ))}
              </div>}
            </>
          }
        </>}

        {/* ── CARRITO ── */}
        {pantalla === "carrito" && <>
          <div className="back-row">
            <button className="btn-back" onClick={() => ir("inicio")}>←</button>
            <p className="sec-title" style={{ margin:0 }}>Mi carrito 🛒</p>
          </div>
          {!usuario
            ? <div className="empty">
              <div className="empty-icon">🔑</div>
              <p className="empty-txt" style={{ marginBottom:18 }}>Inicia sesión para usar el carrito</p>
              <button className="btn-primary" style={{ maxWidth:280, margin:"0 auto" }} onClick={login}>Iniciar sesión con Google</button>
            </div>
            : carrito.length === 0
              ? <div className="empty"><div className="empty-icon">🛒</div><p className="empty-txt">Tu carrito está vacío</p></div>
              : <>
                <div className="cart-card">
                  <p style={{ fontWeight:800, marginBottom:2, fontFamily:"var(--font-head)", fontSize:15 }}>{perfilDB ? `${perfilDB.nombre} ${perfilDB.apellidos || ''}`.trim() : usuario.user_metadata?.full_name}</p>
                  <p style={{ fontSize:12, color:"var(--muted)", marginBottom:2 }}>ID: {perfilDB?.usuario_id}</p>
                  <p style={{ fontSize:13, color:"var(--muted)", marginBottom:16 }}>Tienda: <strong>{tiendaCarrito?.nombre}</strong></p>
                  {carrito.map((p, i) => (
                    <div key={i} className="cart-item">
                      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                        {firstFoto(p) && (
                          <img src={firstFoto(p)} alt={p.nombre}
                            style={{ width:40, height:40, borderRadius:8, objectFit:"cover", flexShrink:0 }} />
                        )}
                        <div>
                          <span style={{ fontSize:14 }}>{p.nombre}</span>
                          <div className="cart-item-qty">
                            <button
                              className="cart-qty-btn"
                              onClick={() => actualizarCantidadCarrito(p.id, p.cantidadCarrito - 1)}
                              title="Disminuir cantidad"
                            >−</button>
                            <span className="cart-qty-val">{p.cantidadCarrito}</span>
                            <button
                              className="cart-qty-btn"
                              onClick={() => actualizarCantidadCarrito(p.id, p.cantidadCarrito + 1)}
                              disabled={p.cantidad ? p.cantidadCarrito >= p.cantidad : false}
                              title="Aumentar cantidad"
                            >+</button>
                          </div>
                        </div>
                      </div>
                      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                        <span style={{ fontWeight:800, color:"var(--rojo)", fontFamily:"var(--font-head)" }}>S/ {(parseFloat(p.precio) * p.cantidadCarrito).toFixed(2)}</span>
                        <button
                          className="cart-item-remove"
                          onClick={() => eliminarDelCarrito(p.id)}
                          title="Eliminar producto"
                        >✕</button>
                      </div>
                    </div>
                  ))}
                  <div className="cart-total">
                    <span>Total</span>
                    <span style={{ color:"var(--rojo)" }}>S/ {carrito.reduce((s,p) => s+parseFloat(p.precio)*p.cantidadCarrito,0).toFixed(2)}</span>
                  </div>
                </div>
                <button className="btn-wa" onClick={comprarWhatsApp}>📲 Comprar por WhatsApp</button>
                <button className="btn-secondary" onClick={() => { setCarrito([]); setTiendaCarrito(null); }}>Vaciar carrito</button>
              </>
          }
        </>}

        {/* ── MI PERFIL ── */}
        {pantalla === "miperfil" && <>
          <div className="back-row">
            <button className="btn-back" onClick={() => ir("inicio")}>←</button>
            <p className="sec-title" style={{ margin:0 }}>Mi perfil</p>
          </div>
          {!usuario
            ? <div className="empty">
              <button className="btn-primary" style={{ maxWidth:280, margin:"0 auto" }} onClick={login}>Iniciar sesión con Google</button>
            </div>
            : <div className="form-card">
              <div style={{ textAlign:"center", marginBottom:28 }}>
                <div style={{ width:80, height:80, borderRadius:22, background:"var(--grad)", display:"flex", alignItems:"center", justifyContent:"center", color:"white", fontWeight:900, fontSize:32, margin:"0 auto 14px", boxShadow:"0 6px 20px rgba(192,57,43,0.3)", fontFamily:"var(--font-head)" }}>
                  {(perfilDB?.nombre || usuario.user_metadata?.full_name || "U")[0].toUpperCase()}
                </div>
                <p style={{ fontFamily:"var(--font-head)", fontWeight:800, fontSize:19, marginBottom:4 }}>{perfilDB ? `${perfilDB.nombre} ${perfilDB.apellidos || ''}`.trim() : usuario.user_metadata?.full_name}</p>
                <p style={{ fontSize:13, color:"var(--muted)", marginBottom:18 }}>{usuario.email}</p>
                <div className="id-badge">{perfilDB?.usuario_id || "--------"}</div>
                <p style={{ fontSize:12, color:"var(--muted)", marginTop:8 }}>Tu ID único de TinkaMarket</p>
              </div>
              {perfilDB && <p style={{ fontSize:14, color:"var(--muted)", textAlign:"center" }}>📍 {perfilDB.distrito}, {perfilDB.provincia}, {perfilDB.departamento}</p>}
            </div>
          }
        </>}

        {/* ── MI TIENDA ── */}
        {pantalla === "mitienda" && <>
          <div className="back-row">
            <button className="btn-back" onClick={() => { playSound("click"); ir("inicio"); }}>←</button>
            <p className="sec-title" style={{ margin:0 }}>Mi tienda</p>
          </div>

          {!usuario
            ? <div className="empty">
                <button className="btn-primary" style={{ maxWidth:280, margin:"0 auto" }} onClick={() => { playSound("click"); login(); }}>
                  Iniciar sesión con Google
                </button>
              </div>

            : !miTienda
              ? <div className="form-card">
                  <p className="form-title">Crea tu tienda 🏪</p>
                  <p className="form-sub">300 días activa · 5 productos gratis · S/ 1 por producto extra</p>
                  <div className="upload-area" onClick={() => { playSound("click"); document.getElementById("fotoTienda").click(); }}>
                    {tiendaFotoPreview
                      ? <img src={tiendaFotoPreview} alt="preview" style={{ maxHeight:120, borderRadius:10, maxWidth:"100%" }} />
                      : <p style={{ color:"var(--muted)", margin:0, fontSize:14 }}>📷 Foto o logo de tu tienda</p>
                    }
                    <input id="fotoTienda" type="file" accept="image/*" style={{ display:"none" }} onChange={e => {
                      const f = e.target.files[0];
                      if (f) { setTiendaFoto(f); setTiendaFotoPreview(URL.createObjectURL(f)); }
                    }} />
                  </div>
                  <input className="inp" placeholder="Nombre de la tienda o marca *" value={tiendaForm.nombre} onChange={e => setTiendaForm({...tiendaForm, nombre:e.target.value})} />
                  <input className="inp" placeholder="WhatsApp (solo números, sin +51) *" value={tiendaForm.whatsapp} onChange={e => setTiendaForm({...tiendaForm, whatsapp:e.target.value})} />
                  <select className="inp" value={tiendaForm.departamento} onChange={e => setTiendaForm({...tiendaForm, departamento:e.target.value, provincia:"", distrito:""})}>
                    <option value="">— Departamento *</option>
                    {deps.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                  <select className="inp" value={tiendaForm.provincia} onChange={e => setTiendaForm({...tiendaForm, provincia:e.target.value, distrito:""})} disabled={!tiendaForm.departamento}>
                    <option value="">— Provincia *</option>
                    {provsDisp.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                  <select className="inp" value={tiendaForm.distrito} onChange={e => setTiendaForm({...tiendaForm, distrito:e.target.value})} disabled={!tiendaForm.provincia}>
                    <option value="">— Distrito *</option>
                    {distDisp.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                  <input className="inp" placeholder="Dirección exacta (opcional)" value={tiendaForm.direccion} onChange={e => setTiendaForm({...tiendaForm, direccion:e.target.value})} />
                  <textarea className="inp" style={{ height:80 }} placeholder="Descripción de tu tienda (opcional)" value={tiendaForm.descripcion} onChange={e => setTiendaForm({...tiendaForm, descripcion:e.target.value})} />
                  {msg && <p className={msg.includes("!")?"msg-ok":"msg-err"}>{msg}</p>}
                  <button className="btn-primary" onClick={() => { playSound("click"); crearTienda(); }} disabled={guardando}>{guardando?"Creando...":"Crear tienda"}</button>
                  <button className="btn-secondary" onClick={() => { playSound("click"); ir("inicio"); }}>Cancelar</button>
                </div>

              : (() => {
                  const prodsTienda = productos.filter(p => p.tienda_id === miTienda.id);
                  const totalLikes = prodsTienda.reduce((s, p) => s + (p.likes || 0), 0);
                  const tokensLibres = 5;
                  const tokensUsados = prodsTienda.length;
                  const tokensComprados = miTienda.tokens_extra || 0;
                  const tokensTotal = tokensLibres + tokensComprados;
                  const tokensPct = Math.min(100, Math.round((tokensUsados / Math.max(tokensTotal, 1)) * 100));
                  const suspendida = miTienda.estado === "suspendida";

                  return <>
                    {/* ── AVISO DE SUSPENSIÓN (modo solo-lectura) ── */}
                    {suspendida && (
                      <div className="empty" style={{ textAlign:"left", background:"#FFF0EE", border:"1.5px solid #F5C0B8" }}>
                        <p style={{ fontWeight:800, color:"var(--rojo)", fontSize:15, marginBottom:6 }}>🚫 Tu tienda está suspendida</p>
                        <p style={{ fontSize:13, color:"#7A4438", lineHeight:1.6, margin:0 }}>
                          Mientras dure la suspensión no aparece en el catálogo ni puedes publicar productos nuevos.
                          Puedes revisar tu información y tus productos existentes en modo solo lectura.
                          Si crees que es un error, contáctanos desde Soporte.
                        </p>
                      </div>
                    )}

                    {/* ── INFO DE TIENDA ── */}
                    <div className="tienda-info-card" style={{ marginBottom:20 }}>
                      <div className="tienda-info-head" style={{ marginBottom:18 }}>
                        {miTienda.foto_url
                          ? <img src={miTienda.foto_url} alt={miTienda.nombre} className="tienda-big-avatar" />
                          : <div className="tienda-big-letter">{miTienda.nombre[0]}</div>
                        }
                        <div>
                          <p style={{ fontFamily:"var(--font-head)", fontWeight:800, fontSize:18, marginBottom:4 }}>{miTienda.nombre}</p>
                          <p style={{ fontSize:13, color:"var(--muted)", marginBottom:2 }}>📍 {miTienda.distrito}, {miTienda.provincia}, {miTienda.departamento}</p>
                          <p style={{ fontSize:13, color:"var(--muted)", marginBottom:miTienda.descripcion?6:0 }}>📲 +51 {miTienda.whatsapp}</p>
                          {miTienda.descripcion && <p style={{ fontSize:13, color:"#555" }}>{miTienda.descripcion}</p>}
                        </div>
                      </div>

                      {/* ── STATS ── */}
                      <div className="stats-grid">
                        <div className="stat-card">
                          <p className="stat-val">{prodsTienda.length}</p>
                          <p className="stat-lbl">Productos</p>
                        </div>
                        <div className="stat-card">
                          <p className="stat-val">{totalLikes}</p>
                          <p className="stat-lbl">❤️ Likes</p>
                        </div>
                        <div className="stat-card">
                          <p className="stat-val">{tokensComprados > 0 ? `+${tokensComprados}` : "300"}</p>
                          <p className="stat-lbl">{tokensComprados > 0 ? "Extras" : "Días"}</p>
                        </div>
                      </div>

                      {/* ── TOKENS ── */}
                      {!suspendida && (
                        <div className="tokens-bar">
                          <div className="tokens-left">
                            <p className="tokens-title">Publicaciones usadas</p>
                            <div className="tokens-track">
                              <div className="tokens-fill" style={{ width: tokensPct + "%" }} />
                            </div>
                            <p className="tokens-sub">
                              {tokensUsados} de {tokensTotal} ({tokensPct}%)
                              {tokensComprados > 0 && <> · {tokensComprados} extra{tokensComprados>1?"s":""} comprado{tokensComprados>1?"s":""}</>}
                            </p>
                          </div>
                          {tokensUsados >= tokensTotal && (
                            <button className="btn-comprar-tokens" onClick={() => { playSound("click"); pagarTienda(1, "Publicación extra - TinkaMarket"); }}>
                              + Comprar
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    {/* ── PRODUCTOS PUBLICADOS ── */}
                    {prodsTienda.length > 0 && (
                      <div className="tienda-info-card" style={{ marginBottom:20 }}>
                        <p style={{ fontFamily:"var(--font-head)", fontWeight:800, fontSize:15, marginBottom:12, color:"var(--cafe)" }}>
                          📦 Tus productos ({prodsTienda.length})
                        </p>
                        {prodsTienda.map(p => (
                          <div key={p.id} className="prod-item">
                            <div className="prod-item-img">
                              {p.fotos && p.fotos[0]
                                ? <img src={p.fotos[0]} alt={p.nombre} />
                                : "✨"
                              }
                            </div>
                            <div className="prod-item-info">
                              <p className="prod-item-name">{p.nombre}</p>
                              <p className="prod-item-meta">❤️ {p.likes || 0} likes · {p.cantidad} disponibles</p>
                            </div>
                            <p className="prod-item-price">S/ {p.precio}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* ── BOTÓN TOGGLE PUBLICAR (bloqueado si suspendida) ── */}
                    {!suspendida && <>
                      <button
                        className="btn-toggle-form"
                        onClick={() => {
                          const next = !mostrarFormProd;
                          playSound(next ? "open" : "close");
                          setMostrarFormProd(next);
                        }}
                      >
                        <span>{mostrarFormProd ? "Cerrar formulario" : "➕  Publicar nuevo producto"}</span>
                        <span className={`btn-toggle-arrow ${mostrarFormProd ? "open" : ""}`}>▾</span>
                      </button>

                      {/* ── FORMULARIO COLAPSABLE ── */}
                      <div className={`form-slide ${mostrarFormProd ? "visible" : ""}`}>
                        <div className="form-card" style={{ margin:"0 0 24px" }}>
                          <p style={{ fontWeight:700, fontSize:13, marginBottom:8, color:"var(--muted)" }}>📷 Fotos del producto (máximo 4)</p>
                          <div className="upload-area" onClick={() => { playSound("click"); document.getElementById("fotosProducto").click(); }}>
                            {prodFotosPrev.length > 0
                              ? <div style={{ display:"flex", gap:8, flexWrap:"wrap", justifyContent:"center" }}>
                                  {prodFotosPrev.map((p,i) => <img key={i} src={p} style={{ height:80, borderRadius:8, objectFit:"cover" }} />)}
                                </div>
                              : <p style={{ color:"var(--muted)", margin:0, fontSize:14 }}>📷 Toca para agregar fotos (máx. 4)</p>
                            }
                            <input id="fotosProducto" type="file" accept="image/*" multiple style={{ display:"none" }} onChange={e => {
                              const files = Array.from(e.target.files).slice(0,4);
                              setProdFotos(files);
                              setProdFotosPrev(files.map(f => URL.createObjectURL(f)));
                            }} />
                          </div>
                          <input className="inp" placeholder="Nombre del producto *" value={prodForm.nombre} onChange={e => setProdForm({...prodForm, nombre:e.target.value.toUpperCase()})} />
                          <input className="inp" placeholder="Precio en soles *" type="number" value={prodForm.precio} onChange={e => setProdForm({...prodForm, precio:e.target.value})} />
                          <input className="inp" placeholder="Cantidad disponible *" type="number" value={prodForm.cantidad} onChange={e => setProdForm({...prodForm, cantidad:e.target.value})} />
                          <select className="inp" value={prodForm.categoria} onChange={e => setProdForm({...prodForm, categoria:e.target.value})}>
                            {CATS.map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                          <textarea className="inp" style={{ height:70 }} placeholder="Descripción del producto (opcional)" value={prodForm.descripcion} onChange={e => setProdForm({...prodForm, descripcion:e.target.value})} />
                          {msg && <p className={msg.includes("!")?"msg-ok":"msg-err"}>{msg}</p>}
                          <button className="btn-primary" onClick={() => { playSound("click"); publicarProducto(); }} disabled={guardando}>
                            {guardando ? "Publicando..." : "Publicar producto"}
                          </button>
                          <button className="btn-secondary" onClick={() => { playSound("close"); setMostrarFormProd(false); }}>
                            Cancelar
                          </button>
                        </div>
                      </div>
                    </>}
                  </>;
                })()
          }
        </>}

        {/* ── SOPORTE ── */}
        {pantalla === "soporte" && <>
          <div className="back-row">
            <button className="btn-back" onClick={() => ir("inicio")}>←</button>
            <p className="sec-title" style={{ margin:0 }}>Soporte</p>
          </div>
          <div className="form-card">
            <p className="form-title">¿En qué podemos ayudarte? 💬</p>
            <p className="form-sub">Nuestro equipo revisará tu reporte pronto</p>
            <select className="inp" value={reporteForm.tipo} onChange={e => setReporteForm({...reporteForm, tipo:e.target.value})}>
              <option value="reporte_usuario">Reportar vendedor o comprador malicioso</option>
              <option value="bug">Reportar fallo o bug técnico</option>
            </select>
            {reporteForm.tipo === "reporte_usuario" && (
              <input className="inp" placeholder="ID del reportado (lo ves en su perfil)" value={reporteForm.id_reportado} onChange={e => setReporteForm({...reporteForm, id_reportado:e.target.value})} />
            )}
            <textarea className="inp" style={{ height:100 }} placeholder="Describe el problema con detalle..." value={reporteForm.detalle} onChange={e => setReporteForm({...reporteForm, detalle:e.target.value})} />
            {msg && <p className={msg.includes("enviado")?"msg-ok":"msg-err"}>{msg}</p>}
            {!usuario
              ? <><p style={{ fontSize:13, color:"var(--muted)", textAlign:"center", marginBottom:12 }}>Debes iniciar sesión para enviar un reporte</p>
                <button className="btn-primary" onClick={login}>Iniciar sesión con Google</button></>
              : <button className="btn-primary" onClick={enviarReporte} disabled={guardando}>{guardando?"Enviando...":"Enviar reporte"}</button>
            }
          </div>
        </>}

        {/* ── POLÍTICAS ── */}
        {pantalla === "politicas" && <>
          <div className="back-row">
            <button className="btn-back" onClick={() => ir("inicio")}>←</button>
            <p className="sec-title" style={{ margin:0 }}>Políticas de uso</p>
          </div>
          <div style={{ maxWidth:700, margin:"0 auto" }}>
            {[
              ["🟢 Uso permitido","TinkaMarket es exclusiva para peruanos que desean comprar y vender productos locales. Solo puedes usarla si resides en Perú y tienes una cuenta de Google válida."],
              ["🚫 Productos prohibidos","Está prohibido publicar productos ilegales, falsificados, peligrosos o que infrinjan derechos de autor. El incumplimiento resulta en eliminación inmediata y lista negra permanente."],
              ["🏪 Tiendas","Cada tienda dura 300 días. Al vencer, tienes 10 días para pagar S/ 5 y reactivarla. Si no, se elimina. Para reactivarla pagas S/ 10. Registrar la misma tienda eliminada se detecta como infracción."],
              ["📦 Productos","Cada publicación dura 30 días. Al vencer tienes 2 días para republicar. Tienes 5 productos gratis; cada extra cuesta S/ 1 (máximo 100). Solo puedes cambiar el precio una vez al día."],
              ["💳 Pagos","Los pagos de activación se realizan por Yape o tarjeta via Culqi. El beneficio se activa inmediatamente. TinkaMarket no procesa pagos entre compradores y vendedores."],
              ["🔒 Privacidad y seguridad","El número de WhatsApp del vendedor solo se revela cuando el comprador decide contactar. Cada contacto queda registrado con el ID del comprador para seguridad de ambas partes."],
              ["⚖️ Responsabilidad","TinkaMarket conecta compradores y vendedores, pero no se hace responsable de la calidad, entrega o pago de las transacciones."],
              ["🚷 Cuentas baneadas","Las cuentas que infrinjan estas políticas serán baneadas y añadidas a la lista negra permanente."],
            ].map(([t,txt]) => (
              <div key={t} className="pol-item">
                <p className="pol-title">{t}</p>
                <p className="pol-txt">{txt}</p>
              </div>
            ))}
          </div>
        </>}

        {/* ── CÓMO VENDER ── */}
        {pantalla === "comovender" && <>
          <div className="back-row">
            <button className="btn-back" onClick={() => ir("inicio")}>←</button>
            <p className="sec-title" style={{ margin:0 }}>Cómo vender en TinkaMarket</p>
          </div>
          <div className="form-card" style={{ maxWidth:700 }}>
            {[
              ["Inicia sesión con Google","Toca Iniciar sesión en la barra superior o en el menú. Usa tu cuenta de Google. Es gratis y tarda menos de 1 minuto."],
              ["Completa tu perfil","Al ingresar por primera vez completa tu nombre y ubicación. Recibirás un ID único permanente que te identifica en TinkaMarket."],
              ["Crea tu tienda","Ve al menú y selecciona Mi tienda. Sube una foto o logo, escribe el nombre, WhatsApp y ubicación. Tu tienda estará activa 300 días."],
              ["Publica tus productos","Desde tu tienda publica hasta 5 productos gratis. Indica nombre, precio, cantidad y categoría. Cada publicación dura 30 días."],
              ["Recibe pedidos por WhatsApp","Cuando un comprador decide comprar, recibirás un mensaje automático con la lista de productos, el total y el ID del comprador."],
              ["Reglas importantes","Solo puedes cambiar el precio una vez al día. Si tu tienda vence tienes 10 días para reactivarla por S/ 5. Productos inapropiados serán eliminados."],
            ].map(([paso,txt], i) => (
              <div key={i} className="step-row">
                <div className="step-num">{i+1}</div>
                <div>
                  <p style={{ fontFamily:"var(--font-head)", fontWeight:800, fontSize:15, marginBottom:5, color:"var(--rojo)" }}>{paso}</p>
                  <p style={{ fontSize:14, color:"#444", lineHeight:1.65 }}>{txt}</p>
                </div>
              </div>
            ))}
            {!usuario && <button className="btn-primary" onClick={login}>Comenzar a vender →</button>}
            {usuario && !miTienda && <button className="btn-primary" onClick={() => ir("mitienda")}>Crear mi tienda →</button>}
          </div>
        </>}

      </div>

      {/* MODAL VACIAR CARRITO */}
      {modalVaciar && (
        <div className="modal-wrap">
          <div className="modal-bg" onClick={() => setModalVaciar(null)} />
          <div className="modal-box">
            <p className="modal-title">¿Vaciar carrito?</p>
            <p className="modal-sub">Ya tienes productos de otra tienda. Si continúas se vaciará tu carrito actual.</p>
            <button className="btn-primary" onClick={() => vaciarYAgregar(modalVaciar.prod, modalVaciar.tienda, modalVaciar.cantidad)}>Vaciar y agregar</button>
            <button className="btn-secondary" onClick={() => setModalVaciar(null)}>Cancelar</button>
          </div>
        </div>
      )}

      {/* PANEL AGREGAR AL CARRITO: foto, nombre, descripción y selector de cantidad */}
      {panelProducto && (
        <div className="modal-wrap">
          <div className="modal-bg" onClick={cerrarPanelCarrito} />
          <div className="modal-box" style={{ maxWidth:360, textAlign:"left" }}>
            <div className="panel-prod-img">
              {firstFoto(panelProducto)
                ? <img src={firstFoto(panelProducto)} alt={panelProducto.nombre} />
                : <span>📦</span>
              }
            </div>
            <p style={{ fontFamily:"var(--font-head)", fontWeight:800, fontSize:17, marginBottom:6, color:"var(--cafe)" }}>{panelProducto.nombre}</p>
            {panelProducto.descripcion && (
              <p style={{ fontSize:13, color:"var(--muted)", lineHeight:1.6, marginBottom:14 }}>{panelProducto.descripcion}</p>
            )}
            <p style={{ fontFamily:"var(--font-head)", fontWeight:900, fontSize:22, color:"var(--rojo)", marginBottom:18 }}>S/ {panelProducto.precio}</p>

            <p style={{ fontSize:13, fontWeight:700, color:"var(--muted)", marginBottom:8 }}>Cantidad</p>
            <div className="qty-stepper">
              <button className="qty-btn" onClick={() => setPanelCantidad(q => Math.max(1, q - 1))} disabled={panelCantidad <= 1}>−</button>
              <span className="qty-val">{panelCantidad}</span>
              <button className="qty-btn" onClick={() => setPanelCantidad(q => Math.min(panelProducto.cantidad || 99, q + 1))} disabled={panelProducto.cantidad ? panelCantidad >= panelProducto.cantidad : false}>+</button>
              {panelProducto.cantidad ? <span style={{ fontSize:12, color:"var(--muted)" }}>{panelProducto.cantidad} disponibles</span> : null}
            </div>

            <button className="btn-primary" onClick={confirmarAgregarCarrito} disabled={agregandoPanel}>
              {agregandoPanel ? "Agregando..." : `Agregar al carrito · S/ ${(parseFloat(panelProducto.precio) * panelCantidad).toFixed(2)}`}
            </button>
            <button className="btn-secondary" onClick={cerrarPanelCarrito}>Cancelar</button>
          </div>
        </div>
      )}

      {/* MENÚ LATERAL */}
      {menuOpen && (
        <>
          <div className="overlay" onClick={() => setMenuOpen(false)} />
          <div className="drawer">
            <div className="drawer-head">
              <div className="drawer-brand">
                <img src="/logo.png" alt="logo" style={{ height:36, width:36, objectFit:"contain", borderRadius:8, background:"rgba(255,255,255,0.2)", padding:3, border:"1px solid rgba(255,255,255,0.3)" }}
                  onError={e => e.target.style.display="none"} />
                <span style={{ color:"white", fontFamily:"var(--font-head)", fontWeight:900, fontSize:17 }}>TinkaMarket 🇵🇪</span>
              </div>
              {usuario
                ? <>
                  <p className="drawer-user">{perfilDB ? `${perfilDB.nombre} ${perfilDB.apellidos || ''}`.trim() : usuario.user_metadata?.full_name}</p>
                  <p className="drawer-id">ID: {perfilDB?.usuario_id || "--------"}</p>
                </>
                : <p className="drawer-id">Bienvenido al marketplace peruano</p>
              }
            </div>
            <div className="drawer-items">
              {!usuario
                ? <div className="drawer-item" style={{ color:"var(--rojo)", fontWeight:800 }} onClick={() => { login(); setMenuOpen(false); }}>
                    <span className="drawer-item-icon">🔑</span> Iniciar sesión con Google
                  </div>
                : <>
                  <div className="drawer-item" onClick={() => ir("miperfil")}><span className="drawer-item-icon">👤</span> Mi perfil</div>
                  <div className="drawer-item" onClick={() => ir("mitienda")}><span className="drawer-item-icon">🏪</span> {miTienda ? "Mi tienda" : "Crear mi tienda"}</div>
                  <div className="drawer-item" onClick={() => ir("carrito")}><span className="drawer-item-icon">🛒</span> Mi carrito{carrito.length>0?` (${carrito.reduce((s,p)=>s+p.cantidadCarrito,0)})`:""}</div>
                </>
              }
              <div className="drawer-item" onClick={() => ir("comovender")}><span className="drawer-item-icon">📖</span> Cómo vender</div>
              <div className="drawer-item" onClick={() => ir("politicas")}><span className="drawer-item-icon">📋</span> Políticas de uso</div>
              <div className="drawer-item" onClick={() => ir("soporte")}><span className="drawer-item-icon">💬</span> Soporte</div>
              {usuario && <div className="drawer-item" style={{ color:"var(--rojo)" }} onClick={logout}><span className="drawer-item-icon">🚪</span> Cerrar sesión</div>}
            </div>
          </div>
        </>
      )}
    </div>
  );
}