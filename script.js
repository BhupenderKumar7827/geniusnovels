// script.js - GeniusNovels dynamic engine with chapters and admin localStorage
const LS_KEY = 'geniusnovels_local_v1';
const ADMIN_SESSION = 'geniusnovels_admin_session_v1';

function getLocal(){ try{ const raw = localStorage.getItem(LS_KEY); return raw ? JSON.parse(raw) : []; }catch(e){return []; } }
function saveLocal(arr){ localStorage.setItem(LS_KEY, JSON.stringify(arr)); }
function merged(){ const local = getLocal(); return window.NOVELS.concat(local); }
function el(q){ return document.querySelector(q); }
function renderGrid(targetSelector, items){ const t=el(targetSelector); if(!t) return; t.innerHTML=''; items.forEach(it=>{ const a=document.createElement('article'); a.className='card'; a.innerHTML=`<img src="${it.cover}" alt="${it.title}"><h3>${it.title}</h3><div class="meta">${it.genre} • ${it.pages} pages</div><div style="margin-top:auto"><a class="read" href="novel.html?id=${it.id}">Details</a> <a class="read" href="reader.html?novel=${it.id}&chapter=${it.chapters && it.chapters[0] ? it.chapters[0].cid : ''}">Read</a></div>`; t.appendChild(a); }); }
function renderGenresList(targetSelector){ const t=el(targetSelector); if(!t) return; const genres = Array.from(new Set(merged().map(n=>n.genre))).sort(); t.innerHTML=''; genres.forEach(g=>{ const d=document.createElement('div'); d.className='card center'; d.style.padding='18px'; d.innerHTML=`<h3 style="font-size:16px">${g}</h3><div class="meta" style="margin-bottom:8px">Explore ${g}</div><a class="read" href="genre.html?genre=${encodeURIComponent(g)}">Open ${g}</a>`; t.appendChild(d); }); }
function renderGenrePage(genre, targetSelector){ const items = merged().filter(n=>n.genre.toLowerCase()===genre.toLowerCase()); renderGrid(targetSelector, items); }
function renderNovel(id){ const n = merged().find(x=>x.id===id); if(!n){ el('#title').textContent='Not found'; return; } el('#title').textContent=n.title; el('#cover').src=n.cover; el('#meta').textContent = n.genre + ' • ' + n.pages + ' pages'; el('#desc').textContent = n.desc; // chapters list
  const list = el('#chaptersList'); if(list){ list.innerHTML=''; (n.chapters||[]).forEach(ch=>{ const li=document.createElement('div'); li.className='small'; li.innerHTML = `<a class="link" href="reader.html?novel=${n.id}&chapter=${ch.cid}">${ch.title}</a>`; list.appendChild(li); }); }
}
function renderReader(novelId, cid){ const n = merged().find(x=>x.id===novelId); if(!n){ el('#readerTitle').textContent='Not found'; return; } const ch = (n.chapters||[]).find(c=>c.cid===cid) || (n.chapters && n.chapters[0]); if(!ch){ el('#readerTitle').textContent='No chapters'; return; } el('#readerTitle').textContent = n.title + ' — ' + ch.title; el('#readerMeta').textContent = n.genre + ' • ' + n.pages + ' pages'; el('#readerContent').textContent = ch.content;
  // prev/next
  const idx = (n.chapters||[]).findIndex(c=>c.cid===ch.cid); const prev = n.chapters && n.chapters[idx-1]; const next = n.chapters && n.chapters[idx+1]; el('#prevBtn').href = prev ? `reader.html?novel=${n.id}&chapter=${prev.cid}` : '#'; el('#nextBtn').href = next ? `reader.html?novel=${n.id}&chapter=${next.cid}` : '#'; el('#readerCover').src = n.cover;
}
function searchAndRender(q, targetSelector){ const terms = q.trim().toLowerCase(); if(!terms){ renderGrid(targetSelector, merged().slice(0,12)); return; } const items = merged().filter(n=> n.title.toLowerCase().includes(terms) || n.genre.toLowerCase().includes(terms) ); renderGrid(targetSelector, items); }

// admin helpers
function addLocal(n){ const arr = getLocalHelpers(); arr.unshift(n); saveLocal(arr); }
function getLocalHelpers(){ try{ return JSON.parse(localStorage.getItem(LS_KEY) || '[]'); }catch(e){return [];} }
function updateLocal(id, updated){ const arr = getLocalHelpers(); const idx = arr.findIndex(x=>x.id===id); if(idx>-1){ arr[idx]=updated; localStorage.setItem(LS_KEY, JSON.stringify(arr)); return true; } return false; }
function deleteLocal(id){ let arr = getLocalHelpers(); arr = arr.filter(x=>x.id!==id); localStorage.setItem(LS_KEY, JSON.stringify(arr)); }

function exportAll(){ const data = merged(); const blob = new Blob([JSON.stringify(data, null, 2)], {type:'application/json'}); const url = URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='geniusnovels-export.json'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url); }

window.GENIUS = { addLocal, getLocalHelpers, updateLocal, deleteLocal, exportAll, getAll: merged };
