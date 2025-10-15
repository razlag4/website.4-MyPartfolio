(function(){
  const q = s => document.querySelector(s);
  const qa = s => Array.from(document.querySelectorAll(s));

  q('#year') && (q('#year').textContent = new Date().getFullYear());

  qa('.btn[data-target]').forEach(b=>{
    b.addEventListener('click',()=> {
      const t = document.querySelector(b.dataset.target);
      if(t) t.scrollIntoView({behavior:'smooth',block:'center'});
    });
  });

  qa('a[href^="#"]').forEach(a=>{
    a.addEventListener('click',e=>{
      const href = a.getAttribute('href');
      if(href && href.startsWith('#')){
        e.preventDefault();
        const t = document.querySelector(href);
        if(t) t.scrollIntoView({behavior:'smooth',block:'center'});
      }
    });
  });

  const canvas = q('#stars-canvas');
  const ctx = canvas && canvas.getContext && canvas.getContext('2d');
  let stars = [];
  function resizeCanvas(){
    if(!canvas) return;
    canvas.width = innerWidth * devicePixelRatio;
    canvas.height = innerHeight * devicePixelRatio;
    canvas.style.width = innerWidth + 'px';
    canvas.style.height = innerHeight + 'px';
    ctx.scale(devicePixelRatio, devicePixelRatio);
    initStars();
  }
  function initStars(){
    if(!ctx) return;
    stars = [];
    const count = Math.round((innerWidth*innerHeight)/7000);
    for(let i=0;i<count;i++){
      stars.push({
        x: Math.random()*innerWidth,
        y: Math.random()*innerHeight,
        r: Math.random()*1.6 + 0.2,
        a: Math.random()*0.9 + 0.1,
        s: Math.random()*0.02 + 0.002,
        p: Math.random()*Math.PI*2
      });
    }
  }
  function draw(){
    if(!ctx) return;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for(const st of stars){
      st.p += st.s;
      const alpha = Math.max(0, Math.min(1, st.a + Math.sin(st.p)*0.35*st.a));
      ctx.beginPath();
      ctx.fillStyle = 'rgba(255,255,255,'+alpha.toFixed(2)+')';
      ctx.arc(st.x, st.y, st.r, 0, Math.PI*2);
      ctx.fill();
    }
    ctx.restore();
    requestAnimationFrame(draw);
  }
  window.addEventListener('resize', resizeCanvas, {passive:true});
  resizeCanvas();
  draw();

  const leftCube = q('.cube--left');
  const rightCube = q('.cube--right');
  const bg = q('#bg-video');
  window.addEventListener('pointermove', e=>{
    const cx = innerWidth/2, cy = innerHeight/2;
    const mx = (e.clientX - cx) / cx;
    const my = (e.clientY - cy) / cy;
    leftCube && (leftCube.style.transform = `translate(${mx*-18}px, ${my*-12}px) rotate(${mx*-8}deg) scale(1.15)`);
    rightCube && (rightCube.style.transform = `translate(${mx*18}px, ${my*12}px) rotate(${mx*10}deg) scale(1.22)`);
    bg && (bg.style.transform = `scale(1.03) translate(${mx*6}px, ${my*4}px)`);
  }, {passive:true});

  const obsTargets = qa('.section, .project-card, .card, .skill, .contact-grid');
  obsTargets.forEach(el=>{ el.classList.add('is-hidden') });
  const io = new IntersectionObserver(entries=>{
    entries.forEach(ent=>{
      if(ent.isIntersecting) ent.target.classList.add('is-visible');
    });
  }, {threshold:0.16});
  obsTargets.forEach(el=>io.observe(el));

  qa('.project-card').forEach(card=>{
    card.addEventListener('click', e=>{
      const link = card.querySelector('.project-link');
      const href = link && link.getAttribute('href');
      if(href && href !== '#') window.open(href, '_blank');
    });
    card.addEventListener('keydown', e=>{
      if(e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const link = card.querySelector('.project-link');
        const href = link && link.getAttribute('href');
        if(href && href !== '#') window.open(href, '_blank');
      }
    });
    card.setAttribute('tabindex','0');
  });

  qa('.project-link').forEach(a=>{
    a.addEventListener('click', e=>{ e.stopPropagation(); });
  });

})();

const skillsRow = document.querySelector('.skills-row');
let offset = 0;
const speed = 0.5;

// клонируем контент, чтобы не было пустого места
skillsRow.innerHTML += skillsRow.innerHTML;

function animateSkills() {
  offset -= speed;
  const width = skillsRow.scrollWidth / 2; 
  if (Math.abs(offset) >= width) offset = 0; 
  skillsRow.style.transform = `translateX(${offset}px)`;
  requestAnimationFrame(animateSkills);
}

animateSkills();
